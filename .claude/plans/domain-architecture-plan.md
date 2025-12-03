# Domain Architecture Plan: Expense Tracker AI

**Created**: 2025-12-03
**Session**: session_expense_tracker_20251202
**Complexity**: Medium
**Status**: Planning Phase

---

## 1. Executive Summary

This plan establishes the complete domain-driven architecture for the Expense Tracker AI application. The application is **offline-first** using IndexedDB (NO server backend), requiring adaptation of traditional architecture patterns. Three core domains are defined:

1. **expenses domain** - CRUD operations, filtering, searching
2. **dashboard domain** - Metrics calculation, chart data aggregation
3. **ai-chat domain** - Chat state management, Layout Intelligence Agent integration

Key constraint: All data operations are **client-side** (IndexedDB), not Server Actions.

---

## 2. Business Context

### Problem Statement

Users need a lightweight, offline-capable expense tracker with AI-assisted layout customization. Traditional expense tracking lacks intelligent UI adaptation, and online-only solutions don't work offline.

### Business Goals

- **Primary Goal**: Enable personal expense tracking with fast, intuitive UI (< 30 seconds to add expense)
- **Secondary Goals**:
  - Provide real-time financial insights (dashboard metrics)
  - Support AI-driven layout customization suggestions (Stage 1-2)
  - Future: AI execution of layout changes (Stage 3)
- **Success Metrics**:
  - All CRUD operations work offline via IndexedDB
  - Dashboard metrics calculate correctly with month boundary edge cases
  - Filtering and search work smoothly with debouncing
  - Chat interface persists across page navigation
  - Mobile and desktop responsive layouts function perfectly

### Key Constraints

- **Offline-First**: NO server backend, no Server Actions pattern, client-side IndexedDB only
- **No Authentication**: Single user, personal device
- **Date Handling**: Month calculation edge cases (1st of month average daily = divide by 1)
- **Mobile Responsiveness**: Modal (desktop) vs Drawer (mobile) for forms

---

## 3. Domain Model Architecture

### 3.1 Core Domains

```
src/domains/
├── expenses/              # Expense CRUD, filtering, search
│   ├── actions.ts         # Client-side CRUD functions (IndexedDB)
│   ├── queries.ts         # Read operations (for consistency)
│   ├── hooks/
│   │   ├── use-expenses.ts
│   │   ├── use-create-expense.ts
│   │   ├── use-update-expense.ts
│   │   ├── use-delete-expense.ts
│   │   └── use-expense-filters.ts
│   ├── stores/
│   │   └── expense-filters-store.ts
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   ├── schema.ts          # Zod validation schemas
│   ├── types.ts           # TypeScript interfaces
│   └── expenses.text-map.ts
│
├── dashboard/             # Metrics, chart data aggregation
│   ├── hooks/
│   │   ├── use-dashboard-metrics.ts
│   │   ├── use-expense-chart.ts
│   │   └── use-recent-expenses.ts
│   ├── utils/
│   │   ├── metrics.ts     # Metric calculation functions
│   │   ├── chart-data.ts  # Chart aggregation logic
│   │   └── filters.ts     # Shared filter utilities
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   └── organisms/
│   ├── types.ts
│   └── dashboard.text-map.ts
│
└── ai-chat/               # Chat state, Layout Intelligence Agent
    ├── agents/
    │   └── layout-intelligence-agent.ts
    ├── hooks/
    │   ├── use-chat.ts
    │   └── use-layout-agent.ts
    ├── stores/
    │   └── chat-store.ts
    ├── components/
    │   ├── atoms/
    │   ├── molecules/
    │   └── organisms/
    ├── types.ts
    └── ai-chat.text-map.ts
```

---

## 4. Entity Definitions

### 4.1 Expense Entity

**Purpose**: Core domain entity representing a single expense transaction.

#### TypeScript Interface

```typescript
// src/domains/expenses/types.ts

export type ExpenseCategory =
  | 'Comida'
  | 'Transporte'
  | 'Entretenimiento'
  | 'Salud'
  | 'Compras'
  | 'Servicios'
  | 'Otros';

export interface Expense {
  id: string;                    // UUID v4, auto-generated
  description: string;           // User-entered text (3-200 chars)
  amount: number;                // Positive decimal, 2 decimal places
  category: ExpenseCategory;     // One of 7 predefined categories
  date: Date;                    // Transaction date (not future)
  createdAt: Date;               // Auto-generated timestamp
  updatedAt: Date;               // Auto-updated on modification
}

// DTOs for CRUD operations
export type CreateExpenseInput = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExpenseInput = Partial<CreateExpenseInput>;

// Query filters
export interface ExpenseFilters {
  categories?: ExpenseCategory[];
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  searchQuery?: string;
  sortBy?: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';
  pagination?: {
    page: number;
    pageSize: number;
  };
}

// Query result
export interface ExpensesQueryResult {
  data: Expense[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

### 4.2 Dashboard Metrics (Derived Entity)

**Purpose**: Calculated metrics NOT stored in IndexedDB, derived from expenses on-demand.

#### TypeScript Interface

```typescript
// src/domains/dashboard/types.ts

export interface DashboardMetrics {
  totalSpentThisMonth: number;           // Sum of amounts in current month
  averageDailySpending: number;          // Total ÷ days elapsed in month
  topCategory: {
    name: ExpenseCategory;
    amount: number;
  } | null;                               // null if no expenses
  transactionCount: number;               // Count of expenses in current month
}

// Calculation input
export interface MetricsCalculationContext {
  expenses: Expense[];
  currentDate?: Date;                    // Default: today
}
```

### 4.3 Chart Data (Derived Entity)

**Purpose**: Aggregated data for chart visualization.

```typescript
// src/domains/dashboard/types.ts

export interface ChartDataPoint {
  label: string;                          // Day or category name
  amount: number;
  date?: Date;                            // For day-based charts
}

export interface ExpenseChartData {
  data: ChartDataPoint[];
  groupBy: 'day' | 'category';
  currency: string;                       // Format hint: USD, MXN, etc
  period: {
    start: Date;
    end: Date;
  };
}
```

### 4.4 Chat Message (Session-Only)

**Purpose**: Chat conversation state, NOT persisted to IndexedDB.

```typescript
// src/domains/ai-chat/types.ts

export interface ChatMessage {
  id: string;                            // UUID v4
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  layoutConfig?: LayoutSuggestion;       // Optional, from AI
  status?: 'sending' | 'sent' | 'error';
}

export interface LayoutSuggestion {
  suggestion: string;                    // Human-readable suggestion
  layoutConfig: {
    dashboardLayout: 'single-column' | 'two-column' | 'grid';
    metricsPanel?: {
      position: 'top' | 'left' | 'right';
      width?: string;
    };
    chartPanel?: {
      position: 'top' | 'left' | 'right';
      width?: string;
      chartType?: 'bar' | 'line' | 'pie';
    };
  };
  previewAvailable: boolean;              // For future Stage 3
}

export interface ChatStoreState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
}
```

---

## 5. Zod Validation Schemas

### 5.1 Expense Schemas

```typescript
// src/domains/expenses/schema.ts

import { z } from 'zod';

// Categories as enum
const EXPENSE_CATEGORIES = [
  'Comida',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Compras',
  'Servicios',
  'Otros'
] as const;

// Core expense schema
export const expenseSchema = z.object({
  id: z.string().uuid('Invalid expense ID'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters')
    .max(200, 'Description cannot exceed 200 characters')
    .trim(),
  amount: z
    .number()
    .positive('Amount must be greater than 0')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places')
    .finite('Amount must be a valid number')
    .max(999999999.99, 'Amount exceeds maximum value'),
  category: z.enum(EXPENSE_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid category' })
  }),
  date: z
    .coerce.date()
    .max(new Date(), 'Date cannot be in the future'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// For creating expenses (omit ID and timestamps)
export const createExpenseSchema = expenseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// For updating expenses (all fields optional)
export const updateExpenseSchema = createExpenseSchema.partial();

// Filters schema
export const expenseFiltersSchema = z.object({
  categories: z.array(z.enum(EXPENSE_CATEGORIES)).optional(),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional(),
  }).optional(),
  searchQuery: z.string().max(100).optional(),
  sortBy: z.enum(['date-desc', 'date-asc', 'amount-desc', 'amount-asc']).optional(),
  pagination: z.object({
    page: z.number().int().positive(),
    pageSize: z.number().int().positive().max(100),
  }).optional(),
});

// TypeScript types
export type Expense = z.infer<typeof expenseSchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseFilters = z.infer<typeof expenseFiltersSchema>;
```

### 5.2 Chat Message Schema

```typescript
// src/domains/ai-chat/schema.ts

export const chatMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(5000),
  timestamp: z.date(),
  layoutConfig: z.object({
    suggestion: z.string(),
    layoutConfig: z.object({
      dashboardLayout: z.enum(['single-column', 'two-column', 'grid']),
      metricsPanel: z.object({
        position: z.enum(['top', 'left', 'right']),
        width: z.string().optional(),
      }).optional(),
      chartPanel: z.object({
        position: z.enum(['top', 'left', 'right']),
        width: z.string().optional(),
        chartType: z.enum(['bar', 'line', 'pie']).optional(),
      }).optional(),
    }),
    previewAvailable: z.boolean(),
  }).optional(),
  status: z.enum(['sending', 'sent', 'error']).optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
```

---

## 6. Client-Side Actions (NOT Server Actions)

### 6.1 Expense Actions (IndexedDB CRUD)

```typescript
// src/domains/expenses/actions.ts

import { openDB } from 'idb';
import { v4 as uuidv4 } from 'uuid';
import { Expense, CreateExpenseInput, UpdateExpenseInput, ExpenseFilters } from './types';
import { createExpenseSchema, updateExpenseSchema } from './schema';

const DB_NAME = 'expense-tracker-db';
const STORE_NAME = 'expenses';

// Get or open database
async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('date', 'date');
        store.createIndex('category', 'category');
        store.createIndex('createdAt', 'createdAt');
      }
    }
  });
}

// CREATE: Add new expense
export async function createExpense(input: unknown): Promise<Expense> {
  // 1. Validate input
  const validated = createExpenseSchema.parse(input);

  // 2. Add business logic: auto-generate ID and timestamps
  const expense: Expense = {
    ...validated,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // 3. Persist to IndexedDB
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add(expense);
  await tx.done;

  return expense;
}

// READ: Get all expenses with filters
export async function getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
  const db = await getDB();
  let expenses = await db.getAll(STORE_NAME);

  // Apply filters
  if (filters) {
    expenses = applyFilters(expenses, filters);
  }

  // Default sort: date descending
  expenses.sort((a, b) => b.date.getTime() - a.date.getTime());

  return expenses;
}

// READ: Get single expense
export async function getExpenseById(id: string): Promise<Expense | null> {
  const db = await getDB();
  return db.get(STORE_NAME, id) || null;
}

// UPDATE: Modify existing expense
export async function updateExpense(id: string, input: unknown): Promise<Expense> {
  // 1. Validate input
  const updates = updateExpenseSchema.parse(input);

  // 2. Fetch existing expense
  const db = await getDB();
  const existing = await db.get(STORE_NAME, id);
  if (!existing) {
    throw new Error(`Expense with ID ${id} not found`);
  }

  // 3. Merge updates, auto-update timestamp
  const updated: Expense = {
    ...existing,
    ...updates,
    updatedAt: new Date(),
  };

  // 4. Persist to IndexedDB
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.put(updated);
  await tx.done;

  return updated;
}

// DELETE: Remove expense
export async function deleteExpense(id: string): Promise<void> {
  const db = await getDB();

  // 1. Verify exists
  const existing = await db.get(STORE_NAME, id);
  if (!existing) {
    throw new Error(`Expense with ID ${id} not found`);
  }

  // 2. Delete from IndexedDB
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
}

// HELPER: Apply filters to expense array
function applyFilters(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  let result = [...expenses];

  // Category filter (OR logic: match ANY selected category)
  if (filters.categories && filters.categories.length > 0) {
    result = result.filter(e => filters.categories!.includes(e.category));
  }

  // Date range filter
  if (filters.dateRange) {
    const { start, end } = filters.dateRange;
    result = result.filter(e => {
      if (start && e.date < start) return false;
      if (end && e.date > end) return false;
      return true;
    });
  }

  // Search filter (case-insensitive)
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    result = result.filter(e => e.description.toLowerCase().includes(query));
  }

  // Sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'date-asc':
        result.sort((a, b) => a.date.getTime() - b.date.getTime());
        break;
      case 'amount-desc':
        result.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount-asc':
        result.sort((a, b) => a.amount - b.amount);
        break;
      case 'date-desc':
      default:
        result.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
  }

  // Pagination (optional)
  if (filters.pagination) {
    const { page, pageSize } = filters.pagination;
    const start = (page - 1) * pageSize;
    result = result.slice(start, start + pageSize);
  }

  return result;
}
```

### 6.2 Dashboard Actions (Metrics Calculation)

```typescript
// src/domains/dashboard/utils/metrics.ts

import { Expense, ExpenseCategory } from '@/domains/expenses/types';
import { DashboardMetrics } from '../types';

export function calculateDashboardMetrics(
  expenses: Expense[],
  currentDate: Date = new Date()
): DashboardMetrics {
  // Get current month boundaries
  const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Filter expenses for this month
  const monthExpenses = expenses.filter(
    e => e.date >= monthStart && e.date <= monthEnd
  );

  if (monthExpenses.length === 0) {
    return {
      totalSpentThisMonth: 0,
      averageDailySpending: 0,
      topCategory: null,
      transactionCount: 0,
    };
  }

  // Total spent
  const totalSpent = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Average daily spending
  // Days elapsed = current day of month
  const daysElapsed = currentDate.getDate();
  const averageDaily = totalSpent / daysElapsed;

  // Top category
  const categoryTotals: Record<ExpenseCategory, number> = {
    'Comida': 0,
    'Transporte': 0,
    'Entretenimiento': 0,
    'Salud': 0,
    'Compras': 0,
    'Servicios': 0,
    'Otros': 0,
  };

  monthExpenses.forEach(e => {
    categoryTotals[e.category] += e.amount;
  });

  const topCategoryName = (
    Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .at(0)?.[0]
  ) as ExpenseCategory | undefined;

  const topCategory = topCategoryName
    ? { name: topCategoryName, amount: categoryTotals[topCategoryName] }
    : null;

  return {
    totalSpentThisMonth: Math.round(totalSpent * 100) / 100,
    averageDailySpending: Math.round(averageDaily * 100) / 100,
    topCategory,
    transactionCount: monthExpenses.length,
  };
}
```

### 6.3 Chart Data Aggregation

```typescript
// src/domains/dashboard/utils/chart-data.ts

import { Expense } from '@/domains/expenses/types';
import { ExpenseChartData, ChartDataPoint } from '../types';

export function aggregateExpensesByDay(expenses: Expense[]): ChartDataPoint[] {
  const dayMap: Record<string, number> = {};

  expenses.forEach(expense => {
    const dateKey = expense.date.toISOString().split('T')[0]; // YYYY-MM-DD
    dayMap[dateKey] = (dayMap[dateKey] || 0) + expense.amount;
  });

  return Object.entries(dayMap)
    .map(([date, amount]) => ({
      label: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: Math.round(amount * 100) / 100,
      date: new Date(date),
    }))
    .sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));
}

export function aggregateExpensesByCategory(expenses: Expense[]): ChartDataPoint[] {
  const categoryMap: Record<string, number> = {};

  expenses.forEach(expense => {
    categoryMap[expense.category] = (categoryMap[expense.category] || 0) + expense.amount;
  });

  return Object.entries(categoryMap)
    .map(([category, amount]) => ({
      label: category,
      amount: Math.round(amount * 100) / 100,
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildChartData(
  expenses: Expense[],
  groupBy: 'day' | 'category' = 'day'
): ExpenseChartData {
  const data = groupBy === 'day'
    ? aggregateExpensesByDay(expenses)
    : aggregateExpensesByCategory(expenses);

  // Determine period from expenses
  const dates = expenses.map(e => e.date.getTime());
  const period = {
    start: new Date(Math.min(...dates)),
    end: new Date(Math.max(...dates)),
  };

  return {
    data,
    groupBy,
    currency: 'USD',
    period,
  };
}
```

---

## 7. Custom Hooks (Business Logic)

### 7.1 Expense Hooks

```typescript
// src/domains/expenses/hooks/use-expenses.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Expense, ExpenseFilters, ExpensesQueryResult } from '../types';
import { getExpenses } from '../actions';

const DEFAULT_PAGE_SIZE = 20;

export function useExpenses(initialFilters?: ExpenseFilters) {
  const [expenses, setExpenses] = useState<ExpensesQueryResult>({
    data: [],
    total: 0,
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    hasMore: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch expenses with filters
  const fetchExpenses = useCallback(async (filters?: ExpenseFilters) => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await getExpenses(filters);
      const pageSize = filters?.pagination?.pageSize ?? DEFAULT_PAGE_SIZE;
      const page = filters?.pagination?.page ?? 1;

      setExpenses({
        data,
        total: data.length,
        page,
        pageSize,
        hasMore: data.length > page * pageSize,
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch expenses'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchExpenses(initialFilters);
  }, []);

  return {
    expenses: expenses.data,
    total: expenses.total,
    isLoading,
    error,
    refetch: fetchExpenses,
  };
}

// src/domains/expenses/hooks/use-create-expense.ts
'use client';

import { useState } from 'react';
import { Expense, CreateExpenseInput } from '../types';
import { createExpense as createExpenseAction } from '../actions';

export function useCreateExpense() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (input: CreateExpenseInput): Promise<Expense | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const expense = await createExpenseAction(input);
      return expense;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create expense');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}

// Similar for useUpdateExpense and useDeleteExpense...
```

### 7.2 Dashboard Hooks

```typescript
// src/domains/dashboard/hooks/use-dashboard-metrics.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { DashboardMetrics } from '../types';
import { getExpenses } from '@/domains/expenses/actions';
import { calculateDashboardMetrics } from '../utils/metrics';

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSpentThisMonth: 0,
    averageDailySpending: 0,
    topCategory: null,
    transactionCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const calculateMetrics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const expenses = await getExpenses();
      const calculated = calculateDashboardMetrics(expenses);
      setMetrics(calculated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to calculate metrics'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    calculateMetrics();
  }, []);

  return {
    metrics,
    isLoading,
    error,
    refetch: calculateMetrics,
  };
}

// src/domains/dashboard/hooks/use-expense-chart.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ExpenseChartData } from '../types';
import { getExpenses } from '@/domains/expenses/actions';
import { buildChartData } from '../utils/chart-data';

export function useExpenseChart(groupBy: 'day' | 'category' = 'day') {
  const [chartData, setChartData] = useState<ExpenseChartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadChart = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const expenses = await getExpenses();
      const data = buildChartData(expenses, groupBy);
      setChartData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load chart data'));
    } finally {
      setIsLoading(false);
    }
  }, [groupBy]);

  useEffect(() => {
    loadChart();
  }, [groupBy]);

  return {
    chartData,
    isLoading,
    error,
    refetch: loadChart,
  };
}
```

### 7.3 Chat Hooks

```typescript
// src/domains/ai-chat/hooks/use-chat.ts
'use client';

import { useCallback } from 'react';
import { useChatStore } from '../stores/chat-store';
import { ChatMessage } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function useChat() {
  const {
    messages,
    isOpen,
    isTyping,
    addMessage,
    toggleChat,
    setTyping,
    clearMessages,
  } = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      // Add user message
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date(),
        status: 'sent',
      };

      addMessage(userMessage);

      // Simulate AI response (integrate with Layout Intelligence Agent)
      setTyping(true);

      // Call Layout Intelligence Agent
      const aiResponse = await generateAIResponse(content);

      // Add AI message
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse.suggestion,
        timestamp: new Date(),
        layoutConfig: aiResponse,
        status: 'sent',
      };

      addMessage(aiMessage);
      setTyping(false);
    },
    [addMessage, setTyping]
  );

  return {
    messages,
    isOpen,
    isTyping,
    sendMessage,
    toggleChat,
    clearMessages,
  };
}

// src/domains/ai-chat/hooks/use-layout-agent.ts
'use client';

import { useCallback } from 'react';
import { LayoutSuggestion } from '../types';
import { parseLayoutRequest } from '../agents/layout-intelligence-agent';

export function useLayoutAgent() {
  const processRequest = useCallback(
    async (userRequest: string): Promise<LayoutSuggestion> => {
      // Parse natural language request and generate structured response
      const suggestion = await parseLayoutRequest(userRequest);
      return suggestion;
    },
    []
  );

  return { processRequest };
}
```

---

## 8. State Management Strategy

### 8.1 Zustand Stores (Client/UI State Only)

```typescript
// src/domains/expenses/stores/expense-filters-store.ts
'use client';

import { create } from 'zustand';
import { ExpenseCategory } from '../types';

interface ExpenseFiltersStore {
  // UI state
  selectedCategories: ExpenseCategory[];
  dateRange: { start: Date | null; end: Date | null };
  searchQuery: string;
  sortBy: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

  // Actions
  setSelectedCategories: (categories: ExpenseCategory[]) => void;
  setDateRange: (range: { start: Date | null; end: Date | null }) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc') => void;
  resetFilters: () => void;
}

export const useExpenseFiltersStore = create<ExpenseFiltersStore>((set) => ({
  // Initial state
  selectedCategories: [],
  dateRange: { start: null, end: null },
  searchQuery: '',
  sortBy: 'date-desc',

  // Actions
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setDateRange: (range) => set({ dateRange: range }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  resetFilters: () => set({
    selectedCategories: [],
    dateRange: { start: null, end: null },
    searchQuery: '',
    sortBy: 'date-desc',
  }),
}));

// src/domains/ai-chat/stores/chat-store.ts
'use client';

import { create } from 'zustand';
import { ChatMessage } from '../types';

interface ChatStore {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;

  addMessage: (message: ChatMessage) => void;
  removeMessage: (id: string) => void;
  toggleChat: () => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  // Initial state
  messages: [],
  isOpen: false,
  isTyping: false,

  // Actions
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message],
  })),
  removeMessage: (id) => set((state) => ({
    messages: state.messages.filter((m) => m.id !== id),
  })),
  toggleChat: () => set((state) => ({
    isOpen: !state.isOpen,
  })),
  setTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () => set({ messages: [] }),
}));
```

### 8.2 Data Flow Pattern

**Server State** (IndexedDB Data):
- Custom hooks (`useExpenses`, `useDashboardMetrics`) manage IndexedDB queries
- Data fetched on component mount
- Refetch on mutations
- Local state via `useState` in hooks

**Client/UI State** (Filters, UI toggles):
- Zustand stores for filters (`useExpenseFiltersStore`)
- Zustand store for chat state (`useChatStore`)
- Independent from server state

---

## 9. Layout Intelligence Agent

### 9.1 Agent Architecture

```typescript
// src/domains/ai-chat/agents/layout-intelligence-agent.ts

import { LayoutSuggestion } from '../types';

// Rule-based layout parser (Stage 1-2, no external API)
export async function parseLayoutRequest(userRequest: string): Promise<LayoutSuggestion> {
  const request = userRequest.toLowerCase();

  // Pattern matching for common layout requests

  if (request.includes('two column') || request.includes('two-column')) {
    return {
      suggestion: 'I can help you create a two-column layout with metrics on the left and the chart on the right.',
      layoutConfig: {
        dashboardLayout: 'two-column',
        metricsPanel: {
          position: 'left',
          width: '40%',
        },
        chartPanel: {
          position: 'right',
          width: '60%',
        },
      },
      previewAvailable: false,
    };
  }

  if (request.includes('make') && (request.includes('chart') || request.includes('graph'))) {
    if (request.includes('bigger') || request.includes('larger')) {
      return {
        suggestion: 'I can expand the chart to take up more space. Would you like it to take 70% of the dashboard width?',
        layoutConfig: {
          dashboardLayout: 'two-column',
          chartPanel: {
            position: 'right',
            width: '70%',
          },
        },
        previewAvailable: false,
      };
    }
  }

  if (request.includes('grid') || request.includes('grid layout')) {
    return {
      suggestion: 'I can arrange your dashboard in a flexible grid layout.',
      layoutConfig: {
        dashboardLayout: 'grid',
      },
      previewAvailable: false,
    };
  }

  // Default fallback
  return {
    suggestion: 'I understand you want to customize your dashboard layout. Could you be more specific? Try asking me to arrange it in two columns, create a grid layout, or resize specific sections.',
    layoutConfig: {
      dashboardLayout: 'single-column',
    },
    previewAvailable: false,
  };
}

// Future enhancement (Stage 3)
export async function generateAIResponse(userRequest: string): Promise<LayoutSuggestion> {
  // Current: Use rule-based parser
  return parseLayoutRequest(userRequest);

  // Future: Call external LLM API for more sophisticated responses
  // const response = await fetch('/.../chat/completions', {
  //   method: 'POST',
  //   body: JSON.stringify({ messages: [{ role: 'user', content: userRequest }] }),
  // });
}
```

### 9.2 Agent Capabilities

- **Stage 1-2 (Current)**: Rule-based parsing of layout requests
- **Stage 3 (Future)**: External LLM API for natural language understanding
- **Constraints**: Read-only access to metrics (future), never modify data

---

## 10. IndexedDB Schema

### 10.1 Database Configuration

```typescript
// src/lib/db.ts

import { openDB, IDBPDatabase } from 'idb';
import { Expense } from '@/domains/expenses/types';

export const DB_NAME = 'expense-tracker-db';
export const DB_VERSION = 1;
export const EXPENSES_STORE = 'expenses';

export async function initializeDB(): Promise<IDBPDatabase> {
  return openDB<{ [EXPENSES_STORE]: Expense }>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(EXPENSES_STORE)) {
        const store = db.createObjectStore(EXPENSES_STORE, { keyPath: 'id' });

        // Create indexes for efficient querying
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    },
  });
}

// Export helper to get DB in any component
let db: IDBPDatabase | null = null;

export async function getDB(): Promise<IDBPDatabase> {
  if (!db) {
    db = await initializeDB();
  }
  return db;
}
```

### 10.2 Query Patterns

```typescript
// Fetch all expenses
const allExpenses = await db.getAll(EXPENSES_STORE);

// Query by date index
const dateIndex = db.transaction(EXPENSES_STORE).store.index('date');
const expensesInRange = await dateIndex.getAll(
  IDBKeyRange.bound(startDate, endDate)
);

// Query by category
const categoryIndex = db.transaction(EXPENSES_STORE).store.index('category');
const foodExpenses = await categoryIndex.getAll('Comida');
```

---

## 11. Error Handling Strategy

### 11.1 Error Types

```typescript
// src/domains/expenses/errors.ts

export class ExpenseNotFoundError extends Error {
  constructor(id: string) {
    super(`Expense with ID ${id} not found`);
    this.name = 'ExpenseNotFoundError';
  }
}

export class ExpenseValidationError extends Error {
  constructor(message: string, public details?: Record<string, string[]>) {
    super(message);
    this.name = 'ExpenseValidationError';
  }
}

export class IndexedDBError extends Error {
  constructor(message: string) {
    super(`Database error: ${message}`);
    this.name = 'IndexedDBError';
  }
}
```

### 11.2 Error Handling in Hooks

```typescript
// In useExpenses hook:
try {
  const data = await getExpenses(filters);
  setExpenses(data);
} catch (err) {
  if (err instanceof ExpenseValidationError) {
    setError({ type: 'validation', message: err.message });
  } else if (err instanceof IndexedDBError) {
    setError({ type: 'database', message: 'Failed to access data. Check browser storage.' });
  } else {
    setError({ type: 'unknown', message: 'An unexpected error occurred' });
  }
}
```

---

## 12. Business Rules Validation

### 12.1 Validation Rules

| Field | Rule | Implementation |
|-------|------|-----------------|
| **description** | Min 3 chars, max 200 | Zod schema |
| **amount** | Positive, max 2 decimals | Zod `.multipleOf(0.01)` |
| **category** | One of 7 predefined | Zod `.enum()` |
| **date** | Not in future | Zod `.max(new Date())` |
| **createdAt** | Auto-generated | Generated in action |
| **updatedAt** | Auto-updated | Updated on PUT |

### 12.2 Business Logic Rules

1. **Month Boundaries**:
   - Dashboard metrics scoped to calendar month (1st to last day)
   - Average daily = total ÷ day of month (handles 1st correctly)

2. **Filtering**:
   - Category filter: OR logic (match ANY selected)
   - Date range: Inclusive
   - Search: Case-insensitive substring match

3. **Chart Data**:
   - Day grouping: Aggregates by date
   - Category grouping: Sums by category, sorted descending

4. **Pagination**:
   - Default: 20 items per page
   - Metadata: total, page, pageSize, hasMore

---

## 13. Files to Create

### 13.1 Core Domain Files

**src/domains/expenses/**:
- ✅ `types.ts` - Expense, ExpenseCategory, DTOs, filters
- ✅ `schema.ts` - Zod schemas for validation
- ✅ `actions.ts` - CRUD functions (IndexedDB)
- ✅ `queries.ts` - Read-only functions (optional wrapper)
- ✅ `errors.ts` - Custom error types
- ✅ `hooks/use-expenses.ts` - Query hook
- ✅ `hooks/use-create-expense.ts` - Create mutation hook
- ✅ `hooks/use-update-expense.ts` - Update mutation hook
- ✅ `hooks/use-delete-expense.ts` - Delete mutation hook
- ✅ `hooks/use-expense-filters.ts` - Filter logic hook
- ✅ `stores/expense-filters-store.ts` - Zustand store for UI filters
- ✅ `expenses.text-map.ts` - Externalized text strings

**src/domains/dashboard/**:
- ✅ `types.ts` - DashboardMetrics, ChartData, aggregation types
- ✅ `hooks/use-dashboard-metrics.ts` - Metrics calculation hook
- ✅ `hooks/use-expense-chart.ts` - Chart data hook
- ✅ `hooks/use-recent-expenses.ts` - Recent items hook
- ✅ `utils/metrics.ts` - Metric calculation functions
- ✅ `utils/chart-data.ts` - Chart aggregation functions
- ✅ `utils/filters.ts` - Shared filter utilities (if needed)
- ✅ `dashboard.text-map.ts` - Externalized text strings

**src/domains/ai-chat/**:
- ✅ `types.ts` - ChatMessage, LayoutSuggestion, agent response types
- ✅ `schema.ts` - Chat message validation (optional)
- ✅ `agents/layout-intelligence-agent.ts` - Rule-based parser, future LLM integration
- ✅ `hooks/use-chat.ts` - Chat interaction logic
- ✅ `hooks/use-layout-agent.ts` - Layout agent integration
- ✅ `stores/chat-store.ts` - Zustand store for chat state
- ✅ `ai-chat.text-map.ts` - Externalized text strings

### 13.2 Infrastructure Files

**src/lib/**:
- ✅ `db.ts` - IndexedDB initialization and helpers
- ✅ `db-provider.tsx` - DB initialization provider (optional, if needed)

### 13.3 Component Files

**Expense Components** (Atomic Design):
- `src/domains/expenses/components/atoms/expense-amount.tsx`
- `src/domains/expenses/components/atoms/expense-date.tsx`
- `src/domains/expenses/components/atoms/category-badge.tsx`
- `src/domains/expenses/components/molecules/expense-card.tsx`
- `src/domains/expenses/components/organisms/expense-form.tsx`
- `src/domains/expenses/components/organisms/expense-list.tsx`
- `src/domains/expenses/components/organisms/expense-filters.tsx`

**Dashboard Components**:
- `src/domains/dashboard/components/atoms/metric-value.tsx`
- `src/domains/dashboard/components/molecules/metric-card.tsx`
- `src/domains/dashboard/components/organisms/dashboard-metrics.tsx`
- `src/domains/dashboard/components/organisms/expense-chart.tsx`
- `src/domains/dashboard/components/organisms/recent-expenses.tsx`

**AI Chat Components**:
- `src/domains/ai-chat/components/atoms/message-bubble.tsx`
- `src/domains/ai-chat/components/molecules/chat-input.tsx`
- `src/domains/ai-chat/components/organisms/chat-window.tsx`
- `src/domains/ai-chat/components/organisms/chat-bubble.tsx`

---

## 14. Integration Points

### 14.1 Coordination with Other Agents

**UX/UI Designer** → Provides:
- Layout specifications (modal vs drawer, responsive breakpoints)
- Color and typography system
- Component composition patterns
- Text maps requirements

**Next.js Builder** → Provides:
- App Router structure (`/`, `/expenses`)
- Server vs Client component strategy
- Suspense boundary placement
- Metadata configuration

**shadcn Builder** → Provides:
- Selected components list
- Installation commands
- Component composition examples

### 14.2 Data Flow Example: Adding Expense

```
User clicks "Add Expense"
  ↓
ExpenseForm (Client Component)
  ↓
useForm (React Hook Form)
  ↓
useCreateExpense() hook
  ↓
createExpense() action
  ↓
VALIDATION: createExpenseSchema.parse()
  ↓
BUSINESS LOGIC: Generate ID, timestamps
  ↓
IndexedDB transaction: add()
  ↓
Return to hook
  ↓
useDashboardMetrics().refetch()
  ↓
useExpenses().refetch()
  ↓
useChatStore.addMessage() (for AI)
  ↓
UI updates via React state
```

---

## 15. Testing Considerations

### 15.1 Unit Tests

- **Schema validation**: Test `createExpenseSchema` with valid/invalid inputs
- **Metric calculation**: Test edge cases (month boundaries, averages)
- **Filter logic**: Test category OR, date range, search combinations
- **Chart aggregation**: Test day/category grouping, sorting

### 15.2 Integration Tests

- **CRUD operations**: Create → Read → Update → Delete flows
- **IndexedDB transactions**: Verify data persistence and rollback
- **Hook interactions**: Test refetch patterns after mutations
- **Zustand store**: Test concurrent updates, reset

### 15.3 Edge Cases to Test

- Empty state: No expenses, no metrics
- Month boundaries: 1st of month average daily
- Floating point: Amount precision (0.01 increments)
- Date filters: Open ranges, invalid dates
- Large datasets: Performance with 1000+ expenses

---

## 16. Migration Strategy (Offline-First)

### 16.1 Constraint: No Server Actions

Traditional Server Actions pattern does NOT apply. Instead:

```typescript
// ❌ NOT ALLOWED
'use server';
export async function createExpense(input) { ... }

// ✅ CORRECT (Client-side IndexedDB)
export async function createExpense(input) {
  const db = await getDB();
  // IndexedDB operations
}
```

### 16.2 Client-Only Architecture

- All CRUD functions are async functions, not Server Actions
- Hooks are marked `'use client'` (IndexedDB is browser-only)
- No session validation needed (single user, offline)
- Error handling: Try/catch with custom error types

---

## 17. Implementation Checklist

### Phase 1: Foundation
- [ ] Create `src/domains/expenses/types.ts`
- [ ] Create `src/domains/expenses/schema.ts`
- [ ] Create `src/lib/db.ts` (IndexedDB client)
- [ ] Create `src/domains/expenses/actions.ts` (CRUD)

### Phase 2: Expense Hooks
- [ ] Create `src/domains/expenses/hooks/use-expenses.ts`
- [ ] Create `src/domains/expenses/hooks/use-create-expense.ts`
- [ ] Create `src/domains/expenses/hooks/use-update-expense.ts`
- [ ] Create `src/domains/expenses/hooks/use-delete-expense.ts`
- [ ] Create `src/domains/expenses/stores/expense-filters-store.ts`

### Phase 3: Dashboard
- [ ] Create `src/domains/dashboard/types.ts`
- [ ] Create `src/domains/dashboard/utils/metrics.ts`
- [ ] Create `src/domains/dashboard/utils/chart-data.ts`
- [ ] Create `src/domains/dashboard/hooks/use-dashboard-metrics.ts`
- [ ] Create `src/domains/dashboard/hooks/use-expense-chart.ts`

### Phase 4: AI Chat
- [ ] Create `src/domains/ai-chat/types.ts`
- [ ] Create `src/domains/ai-chat/agents/layout-intelligence-agent.ts`
- [ ] Create `src/domains/ai-chat/hooks/use-chat.ts`
- [ ] Create `src/domains/ai-chat/stores/chat-store.ts`

### Phase 5: Text Maps
- [ ] Create `src/domains/expenses/expenses.text-map.ts`
- [ ] Create `src/domains/dashboard/dashboard.text-map.ts`
- [ ] Create `src/domains/ai-chat/ai-chat.text-map.ts`

---

## 18. Key Design Decisions

### Decision 1: Client-Side IndexedDB vs Server
**Decision**: Client-side IndexedDB (offline-first requirement)
**Rationale**: No server backend, full offline capability required
**Trade-offs**: No cross-device sync, local storage limits

### Decision 2: Custom Hooks vs React Query
**Decision**: Custom hooks with `useState` (lightweight for offline-first MVP)
**Future**: Can migrate to React Query if complex caching needed
**Rationale**: Simpler for offline-first, avoids additional dependencies

### Decision 3: Rule-Based Agent vs LLM API
**Decision**: Rule-based parser (Stage 1-2), LLM API in Stage 3
**Rationale**: MVP speed, future extensibility, no external API cost
**Trade-offs**: Limited natural language understanding initially

### Decision 4: Zustand for Chat + Filters
**Decision**: Zustand stores for UI state ONLY (filters, chat open/close)
**Rationale**: Simple, persistent across navigation, lightweight
**Constraint**: Never use for server data (expenses, metrics)

---

## 19. Documentation Map

Related documentation:
- `.claude/plans/ux-ui-design-plan.md` - Layout specifications
- `.claude/plans/nextjs-architecture-plan.md` - App Router structure
- `.claude/plans/shadcn-component-plan.md` - Component selections
- `.claude/plans/business-analysis-plan.md` - User stories and requirements

---

## 20. Success Criteria for Domain Architecture

- [ ] All Zod schemas validate correctly with edge cases
- [ ] CRUD operations persist and retrieve data correctly
- [ ] Metrics calculate accurately (month boundaries, averages)
- [ ] Filters combine correctly (AND/OR logic)
- [ ] Chart aggregation works for both day and category grouping
- [ ] Hooks manage state and side effects cleanly
- [ ] Zustand stores don't mix server/UI state
- [ ] IndexedDB transactions complete reliably
- [ ] Error handling provides meaningful feedback
- [ ] All business rules are enforced at validation layer

---

**Plan Status**: Ready for Implementation
**Next Steps**:
1. Create core files in order (types → schema → actions → hooks)
2. Test each layer independently
3. Integrate with UI components (developed by Next.js Builder and UX Designer)
4. Validate against business rules and edge cases
