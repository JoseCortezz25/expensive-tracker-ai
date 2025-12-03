/**
 * Expense CRUD Actions (Client-Side)
 *
 * Provides all Create, Read, Update, Delete operations for expenses.
 * These are CLIENT-SIDE functions that interact with IndexedDB.
 * NOT Server Actions - this is offline-first with no backend.
 *
 * @module domains/expenses/actions
 */

'use client';

import { openExpenseDB, STORE_NAME } from '@/lib/db';
import type {
  Expense,
  CreateExpenseInput,
  UpdateExpenseInput,
  ExpenseFilters,
  ExpenseQueryResult,
} from './types';
import {
  validateCreateExpense,
  validateUpdateExpense,
  type CreateExpenseSchemaType,
} from './schema';
import {
  ExpenseNotFoundError,
  ExpenseValidationError,
  IndexedDBError,
  fromZodError,
} from './errors';

/**
 * Generate a UUID v4
 * Simple implementation for client-side ID generation
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Get current ISO 8601 timestamp
 */
function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Create a new expense
 *
 * Validates input, generates ID and timestamps, saves to IndexedDB.
 *
 * @param input - Expense data (without ID and timestamps)
 * @returns Created expense with generated fields
 * @throws {ExpenseValidationError} If input validation fails
 * @throws {IndexedDBError} If database operation fails
 *
 * @example
 * ```typescript
 * const expense = await createExpense({
 *   description: 'Almuerzo',
 *   amount: 25.50,
 *   category: 'Comida',
 *   date: '2025-12-03'
 * });
 * ```
 */
export async function createExpense(
  input: CreateExpenseInput
): Promise<Expense> {
  try {
    // Validate input with Zod schema
    const validated = validateCreateExpense(input);

    // Generate ID and timestamps
    const now = getCurrentTimestamp();
    const expense: Expense = {
      id: generateId(),
      ...validated,
      createdAt: now,
      updatedAt: now,
    };

    // Save to IndexedDB
    const db = await openExpenseDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    await store.add(expense);
    await tx.done;

    return expense;
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      throw fromZodError(error as any);
    }
    if (error instanceof ExpenseValidationError) {
      throw error;
    }
    throw new IndexedDBError(
      'Failed to create expense',
      'write',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Get all expenses with optional filters
 *
 * Supports category filtering, date range, search, sorting, and pagination.
 * Default: Current year, sorted by date descending, first 20 items.
 *
 * @param filters - Optional filter criteria
 * @returns Query result with expenses and pagination metadata
 * @throws {IndexedDBError} If database operation fails
 *
 * @example
 * ```typescript
 * // Get current year expenses (default)
 * const result = await getExpenses();
 *
 * // Get expenses with filters
 * const result = await getExpenses({
 *   categories: ['Comida', 'Transporte'],
 *   dateFrom: '2025-01-01',
 *   dateTo: '2025-12-31',
 *   searchQuery: 'coffee',
 *   sortBy: 'amount',
 *   sortOrder: 'desc',
 *   limit: 20,
 *   offset: 0
 * });
 * ```
 */
export async function getExpenses(
  filters: ExpenseFilters = {}
): Promise<ExpenseQueryResult> {
  try {
    const db = await openExpenseDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    // Get all expenses from IndexedDB
    let expenses = await store.getAll();

    // Apply default date filter: current year
    if (!filters.dateFrom && !filters.dateTo) {
      const currentYear = new Date().getFullYear();
      filters.dateFrom = `${currentYear}-01-01T00:00:00.000Z`;
      filters.dateTo = `${currentYear}-12-31T23:59:59.999Z`;
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      expenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        if (filters.dateFrom && expenseDate < new Date(filters.dateFrom)) {
          return false;
        }
        if (filters.dateTo && expenseDate > new Date(filters.dateTo)) {
          return false;
        }
        return true;
      });
    }

    // Filter by categories (OR logic)
    if (filters.categories && filters.categories.length > 0) {
      expenses = expenses.filter((expense) =>
        filters.categories!.includes(expense.category)
      );
    }

    // Filter by search query (case-insensitive description search)
    if (filters.searchQuery && filters.searchQuery.trim().length > 0) {
      const query = filters.searchQuery.toLowerCase().trim();
      expenses = expenses.filter((expense) =>
        expense.description.toLowerCase().includes(query)
      );
    }

    // Sort
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';

    expenses.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortBy) {
        case 'amount':
          aVal = a.amount;
          bVal = b.amount;
          break;
        case 'createdAt':
          aVal = a.createdAt;
          bVal = b.createdAt;
          break;
        case 'date':
        default:
          aVal = a.date;
          bVal = b.date;
          break;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });

    // Pagination
    const totalCount = expenses.length;
    const limit = filters.limit || 20;
    const offset = filters.offset || 0;

    const paginatedExpenses = expenses.slice(offset, offset + limit);
    const hasMore = offset + limit < totalCount;

    return {
      expenses: paginatedExpenses,
      totalCount,
      hasMore,
      offset,
      limit,
    };
  } catch (error) {
    throw new IndexedDBError(
      'Failed to get expenses',
      'read',
      error instanceof Error ? error : undefined
    );
  }
}

/**
 * Get a single expense by ID
 *
 * @param id - Expense UUID
 * @returns Expense if found
 * @throws {ExpenseNotFoundError} If expense doesn't exist
 * @throws {IndexedDBError} If database operation fails
 *
 * @example
 * ```typescript
 * const expense = await getExpenseById('123e4567-e89b-12d3-a456-426614174000');
 * ```
 */
export async function getExpenseById(id: string): Promise<Expense> {
  try {
    const db = await openExpenseDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    const expense = await store.get(id);

    if (!expense) {
      throw new ExpenseNotFoundError(id);
    }

    return expense;
  } catch (error) {
    if (error instanceof ExpenseNotFoundError) {
      throw error;
    }
    throw new IndexedDBError(
      'Failed to get expense by ID',
      'read',
      error instanceof Error ? error : undefined,
      { expenseId: id }
    );
  }
}

/**
 * Update an existing expense
 *
 * Validates input, updates specified fields, auto-updates `updatedAt` timestamp.
 * Fetches current expense, merges changes, validates, then saves.
 *
 * @param id - Expense UUID
 * @param input - Partial expense data to update
 * @returns Updated expense
 * @throws {ExpenseNotFoundError} If expense doesn't exist
 * @throws {ExpenseValidationError} If input validation fails
 * @throws {IndexedDBError} If database operation fails
 *
 * @example
 * ```typescript
 * const updated = await updateExpense('123e4567-e89b-12d3-a456-426614174000', {
 *   amount: 30.00
 * });
 * ```
 */
export async function updateExpense(
  id: string,
  input: UpdateExpenseInput
): Promise<Expense> {
  try {
    // Validate input
    const validated = validateUpdateExpense(input);

    // Get existing expense
    const existing = await getExpenseById(id);

    // Merge changes and update timestamp
    const updated: Expense = {
      ...existing,
      ...validated,
      updatedAt: getCurrentTimestamp(),
    };

    // Save to IndexedDB
    const db = await openExpenseDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    await store.put(updated);
    await tx.done;

    return updated;
  } catch (error) {
    if (error instanceof ExpenseNotFoundError) {
      throw error;
    }
    if (error instanceof Error && error.name === 'ZodError') {
      throw fromZodError(error as any);
    }
    if (error instanceof ExpenseValidationError) {
      throw error;
    }
    throw new IndexedDBError(
      'Failed to update expense',
      'write',
      error instanceof Error ? error : undefined,
      { expenseId: id }
    );
  }
}

/**
 * Delete an expense
 *
 * Hard delete - permanently removes from IndexedDB.
 *
 * @param id - Expense UUID
 * @returns void
 * @throws {ExpenseNotFoundError} If expense doesn't exist
 * @throws {IndexedDBError} If database operation fails
 *
 * @example
 * ```typescript
 * await deleteExpense('123e4567-e89b-12d3-a456-426614174000');
 * ```
 */
export async function deleteExpense(id: string): Promise<void> {
  try {
    // Check if expense exists first
    await getExpenseById(id);

    // Delete from IndexedDB
    const db = await openExpenseDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    await store.delete(id);
    await tx.done;
  } catch (error) {
    if (error instanceof ExpenseNotFoundError) {
      throw error;
    }
    throw new IndexedDBError(
      'Failed to delete expense',
      'delete',
      error instanceof Error ? error : undefined,
      { expenseId: id }
    );
  }
}

/**
 * Get count of expenses matching filters
 *
 * Useful for pagination and displaying totals without fetching all data.
 *
 * @param filters - Optional filter criteria
 * @returns Count of matching expenses
 * @throws {IndexedDBError} If database operation fails
 *
 * @example
 * ```typescript
 * const count = await getExpenseCount({ categories: ['Comida'] });
 * ```
 */
export async function getExpenseCount(
  filters: ExpenseFilters = {}
): Promise<number> {
  const result = await getExpenses({ ...filters, limit: undefined, offset: 0 });
  return result.totalCount;
}

/**
 * Get all expenses without pagination (use with caution)
 *
 * Returns all expenses matching filters. May be slow for large datasets.
 * Use `getExpenses` with pagination for better performance.
 *
 * @param filters - Optional filter criteria (pagination ignored)
 * @returns Array of all matching expenses
 * @throws {IndexedDBError} If database operation fails
 */
export async function getAllExpenses(
  filters: Omit<ExpenseFilters, 'limit' | 'offset'> = {}
): Promise<Expense[]> {
  const result = await getExpenses({ ...filters, limit: undefined, offset: 0 });
  return result.expenses;
}
