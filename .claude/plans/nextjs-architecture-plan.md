# Next.js 15 App Router Architecture Plan - Expense Tracker AI

**Created**: 2025-12-02
**Session**: session_expense_tracker_20251202
**Type**: Next.js Architecture
**Complexity**: High

## 1. Executive Summary

This plan defines the complete Next.js 15 App Router architecture for an **offline-first** expense tracking application with AI-driven layout customization. The critical architectural challenge is balancing Next.js RSC-first approach with the reality that IndexedDB (browser-only API) requires client-side execution.

**Key Architectural Decisions**:
- Pages are Server Components for SEO/metadata benefits
- Data-fetching logic isolated in Client Components (IndexedDB constraint)
- Strategic use of Suspense for client-side async operations
- Root layout includes persistent chat bubble (Client Component)
- All routes are static (no dynamic segments needed)

---

## 2. Critical Constraint: Offline-First Architecture

### The IndexedDB Challenge

**Problem**: IndexedDB is a browser-only API that cannot run in Server Components or during SSR.

**Solution**: Hybrid architecture that maximizes Server Components while isolating client-side data access.

**Pattern**:
```typescript
// ✅ Page is Server Component (for SEO, metadata)
// app/page.tsx
import { Suspense } from 'react';
import { DashboardContent } from '@/domains/dashboard/components/organisms/dashboard-content';
import { DashboardSkeleton } from '@/domains/dashboard/components/atoms/dashboard-skeleton';

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Client component handles IndexedDB access */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

// ✅ Client Component handles data fetching
// domains/dashboard/components/organisms/dashboard-content.tsx
'use client';

import { useDashboardMetrics } from '@/domains/dashboard/hooks/use-dashboard-metrics';

export function DashboardContent() {
  const { metrics, isLoading, error } = useDashboardMetrics();

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <ErrorState error={error} />;

  return <div>{/* Render metrics */}</div>;
}
```

---

## 3. Complete App Router Structure

### File Tree

```
src/app/
├── layout.tsx                    # Root layout (Server Component + Client providers)
├── page.tsx                      # Dashboard page (Server Component)
├── expenses/
│   └── page.tsx                  # Expenses list page (Server Component)
├── loading.tsx                   # Global loading state
├── error.tsx                     # Global error boundary (Client Component)
├── not-found.tsx                 # 404 page (Server Component)
└── globals.css                   # Global styles
```

**Route Mapping**:
- `/` → Dashboard page (home)
- `/expenses` → Expenses list page with filters

**No Dynamic Routes Needed**: All routes are static since this is single-user, offline-first application.

---

## 4. Root Layout Architecture

### File: `src/app/layout.tsx`

**Component Type**: ✅ Server Component (root layout)

**Purpose**:
- Define global HTML structure
- Configure metadata for SEO
- Load fonts (Geist Sans, Geist Mono)
- Render persistent chat bubble (Client Component)
- Provide global error boundaries

**Implementation Plan**:

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ChatBubble } from '@/domains/ai-chat/components/organisms/chat-bubble';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Expense Tracker AI',
  description: 'Personal expense management with AI-driven layout customization',
  keywords: ['expense tracker', 'personal finance', 'budgeting', 'AI'],
  authors: [{ name: 'josecortezz16' }],
  openGraph: {
    title: 'Expense Tracker AI',
    description: 'Manage your expenses offline with intelligent layout customization',
    type: 'website',
  },
  manifest: '/manifest.json', // Future PWA support
  themeColor: '#ffffff',
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Main content */}
        {children}

        {/* ✅ Persistent chat bubble (Client Component) */}
        <ChatBubble />
      </body>
    </html>
  );
}
```

**Why Server Component**:
- No interactivity at layout level
- Metadata configuration requires Server Component
- Font optimization via next/font

**Children Strategy**:
- `{children}` renders either Dashboard or Expenses page
- `<ChatBubble />` is a Client Component that floats above all pages

---

## 5. Dashboard Page Architecture

### File: `src/app/page.tsx`

**Component Type**: ✅ Server Component (page component)
**Route**: `/` (home)

**Purpose**:
- Render Dashboard template
- Provide SEO metadata
- Compose dashboard sections with Suspense boundaries

**Implementation Plan**:

```typescript
// src/app/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { DashboardMetrics } from '@/domains/dashboard/components/organisms/dashboard-metrics';
import { ExpenseChart } from '@/domains/dashboard/components/organisms/expense-chart';
import { RecentExpenses } from '@/domains/dashboard/components/organisms/recent-expenses';
import { MetricsSkeleton } from '@/domains/dashboard/components/atoms/metrics-skeleton';
import { ChartSkeleton } from '@/domains/dashboard/components/atoms/chart-skeleton';
import { RecentExpensesSkeleton } from '@/domains/dashboard/components/atoms/recent-expenses-skeleton';

export const metadata: Metadata = {
  title: 'Dashboard | Expense Tracker AI',
  description: 'View your expense insights, charts, and recent transactions',
};

export default function DashboardPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>

      {/* Metrics Panel - Independent Suspense boundary */}
      <section className="mb-8">
        <Suspense fallback={<MetricsSkeleton />}>
          <DashboardMetrics />
        </Suspense>
      </section>

      {/* Chart Panel - Independent Suspense boundary */}
      <section className="mb-8">
        <Suspense fallback={<ChartSkeleton />}>
          <ExpenseChart />
        </Suspense>
      </section>

      {/* Recent Expenses - Independent Suspense boundary */}
      <section>
        <Suspense fallback={<RecentExpensesSkeleton />}>
          <RecentExpenses />
        </Suspense>
      </section>
    </main>
  );
}
```

**Why Server Component**:
- No direct interactivity or state
- SEO benefits (metadata, static HTML)
- Composition of Client Components

**Suspense Strategy**:
- Each section has independent Suspense boundary
- Allows progressive rendering (metrics load first, then chart, then recent expenses)
- Better perceived performance

**Client Components** (nested inside):
- `<DashboardMetrics />` - Client Component (IndexedDB access)
- `<ExpenseChart />` - Client Component (interactivity + IndexedDB)
- `<RecentExpenses />` - Client Component (IndexedDB access)

---

## 6. Expenses Page Architecture

### File: `src/app/expenses/page.tsx`

**Component Type**: ✅ Server Component (page component)
**Route**: `/expenses`

**Purpose**:
- Render expense list with filters
- Provide SEO metadata
- Compose expense management UI

**Implementation Plan**:

```typescript
// src/app/expenses/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ExpenseList } from '@/domains/expenses/components/organisms/expense-list';
import { ExpenseListSkeleton } from '@/domains/expenses/components/atoms/expense-list-skeleton';

export const metadata: Metadata = {
  title: 'Expenses | Expense Tracker AI',
  description: 'View, filter, and manage your expense records',
};

export default function ExpensesPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Expenses</h1>

      {/* Expense list with filters - Single Suspense boundary */}
      <Suspense fallback={<ExpenseListSkeleton />}>
        <ExpenseList />
      </Suspense>
    </main>
  );
}
```

**Why Server Component**:
- No direct state or interactivity
- SEO benefits
- Composition layer only

**Client Component** (nested inside):
- `<ExpenseList />` - Client Component (IndexedDB access, filtering logic, state management)

**Why Single Suspense**:
- Expense list + filters are a cohesive unit
- No benefit to separate Suspense boundaries

---

## 7. Server vs Client Component Decision Matrix

### Decision Tree

```
┌─────────────────────────────────────────────┐
│ Does component access IndexedDB?           │
│ ├─ YES → Client Component                  │
│ └─ NO → Continue                            │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ Does component use browser APIs?           │
│ (localStorage, window, navigator)          │
│ ├─ YES → Client Component                  │
│ └─ NO → Continue                            │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ Does component need useState/useEffect?    │
│ ├─ YES → Client Component                  │
│ └─ NO → Continue                            │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ Does component need event handlers?        │
│ (onClick, onChange, onSubmit)              │
│ ├─ YES → Client Component                  │
│ └─ NO → Server Component                   │
└─────────────────────────────────────────────┘
```

### Component Classification

| Component | Type | Reason |
|-----------|------|--------|
| **Pages** | | |
| `app/layout.tsx` | Server | No state, metadata config |
| `app/page.tsx` | Server | Composition only, SEO |
| `app/expenses/page.tsx` | Server | Composition only, SEO |
| `app/loading.tsx` | Server | Static skeleton |
| `app/error.tsx` | ❌ Client | Must be Client (Next.js requirement) |
| `app/not-found.tsx` | Server | Static error page |
| **Dashboard Components** | | |
| `DashboardMetrics` | ❌ Client | IndexedDB access via hook |
| `ExpenseChart` | ❌ Client | IndexedDB + interactivity (chart) |
| `RecentExpenses` | ❌ Client | IndexedDB access |
| `MetricCard` | Server | Pure presentation (receives props) |
| `MetricsSkeleton` | Server | Static loading state |
| **Expense Components** | | |
| `ExpenseList` | ❌ Client | IndexedDB + filtering state |
| `ExpenseCard` | Server | Pure presentation (receives props) |
| `ExpenseForm` | ❌ Client | Form state (React Hook Form) |
| `ExpenseFilters` | ❌ Client | Filter state management |
| **AI Chat Components** | | |
| `ChatBubble` | ❌ Client | State (open/closed) + event handlers |
| `ChatWindow` | ❌ Client | Chat state, message input |
| `ChatMessage` | Server | Pure presentation (receives props) |
| **UI Components (shadcn)** | | |
| `Button` | Server | Pure presentation (unless needs onClick) |
| `Input` | Server | Pure presentation (form manages state) |
| `Select` | ❌ Client | Interactive (Radix UI) |
| `Dialog` | ❌ Client | Interactive (Radix UI) |
| `Card` | Server | Pure presentation |

---

## 8. Data Fetching Strategy (Offline-First)

### The Challenge

Traditional Next.js data fetching patterns don't apply:
- ❌ Cannot use `fetch()` in Server Components (no server to fetch from)
- ❌ Cannot use Server Actions for mutations (no server)
- ✅ Must use IndexedDB (browser-only)

### Solution: Custom Hooks Pattern

**Architecture**:

```typescript
// ✅ IndexedDB CRUD operations (client-side only)
// domains/expenses/actions.ts
// NOTE: NOT Server Actions - just functions that run client-side

import { openDB } from '@/lib/db';
import type { Expense } from './types';

export async function createExpense(expense: Expense): Promise<Expense> {
  const db = await openDB();
  const tx = db.transaction('expenses', 'readwrite');
  await tx.store.add(expense);
  await tx.done;
  return expense;
}

export async function getExpenses(): Promise<Expense[]> {
  const db = await openDB();
  return await db.getAll('expenses');
}

export async function updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
  const db = await openDB();
  const tx = db.transaction('expenses', 'readwrite');
  const expense = await tx.store.get(id);
  const updated = { ...expense, ...updates, updatedAt: new Date() };
  await tx.store.put(updated);
  await tx.done;
  return updated;
}

export async function deleteExpense(id: string): Promise<void> {
  const db = await openDB();
  const tx = db.transaction('expenses', 'readwrite');
  await tx.store.delete(id);
  await tx.done;
}
```

**Custom Hook Pattern**:

```typescript
// ✅ Custom hook wraps IndexedDB access
// domains/expenses/hooks/use-expenses.ts
'use client'; // Hook file itself doesn't need directive, but components using it do

import { useState, useEffect } from 'react';
import { getExpenses } from '../actions';
import type { Expense } from '../types';

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadExpenses() {
      try {
        setIsLoading(true);
        const data = await getExpenses();
        setExpenses(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load expenses'));
      } finally {
        setIsLoading(false);
      }
    }

    loadExpenses();
  }, []);

  return { expenses, isLoading, error };
}
```

**Component Usage**:

```typescript
// ✅ Client Component uses hook
// domains/expenses/components/organisms/expense-list.tsx
'use client';

import { useExpenses } from '@/domains/expenses/hooks/use-expenses';
import { ExpenseCard } from '@/domains/expenses/components/molecules/expense-card';
import { Spinner } from '@/components/atoms/spinner';
import { ErrorState } from '@/components/molecules/error-state';

export function ExpenseList() {
  const { expenses, isLoading, error } = useExpenses();

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
    </div>
  );
}
```

### Why Not React Query?

**Option 1: React Query** (Recommended for complex state)
- Pros: Cache management, optimistic updates, automatic refetching
- Cons: Additional dependency, learning curve
- Use case: If application grows beyond basic CRUD

**Option 2: Custom Hooks** (Recommended for MVP)
- Pros: Simpler, no extra dependencies, full control
- Cons: Manual cache invalidation, more boilerplate
- Use case: Current project (offline-first, simple state)

**Decision**: Start with custom hooks. Migrate to React Query if needed in Phase 6 (optimization).

---

## 9. Loading and Error States

### Global Loading State

**File**: `src/app/loading.tsx`

**Component Type**: ✅ Server Component

**Purpose**: Fallback UI while page is loading (streaming)

```typescript
// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-10 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mt-8 space-y-4">
        <div className="h-32 animate-pulse rounded bg-gray-200" />
        <div className="h-32 animate-pulse rounded bg-gray-200" />
        <div className="h-32 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  );
}
```

**When Shown**:
- During initial page load
- During navigation between routes
- Automatic with Next.js streaming

### Global Error Boundary

**File**: `src/app/error.tsx`

**Component Type**: ❌ Client Component (REQUIRED by Next.js)

**Purpose**: Catch and handle errors in page components

```typescript
// src/app/error.tsx
'use client'; // ❌ MUST be Client Component

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (future)
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
      <p className="mb-4 text-gray-600">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

**Why Client Component**: Next.js requires error.tsx to be Client Component for error state management.

### Not Found Page

**File**: `src/app/not-found.tsx`

**Component Type**: ✅ Server Component

**Purpose**: Custom 404 page

```typescript
// src/app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl">Page Not Found</h2>
      <p className="mb-4 text-gray-600">The page you're looking for doesn't exist.</p>
      <Button asChild>
        <Link href="/">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
```

### Component-Level Loading States

**Pattern**: Each Client Component that fetches data manages its own loading state.

```typescript
// domains/dashboard/components/organisms/dashboard-metrics.tsx
'use client';

import { useDashboardMetrics } from '@/domains/dashboard/hooks/use-dashboard-metrics';
import { MetricsSkeleton } from '@/domains/dashboard/components/atoms/metrics-skeleton';

export function DashboardMetrics() {
  const { metrics, isLoading, error } = useDashboardMetrics();

  // ✅ Component-level loading state
  if (isLoading) return <MetricsSkeleton />;
  if (error) return <ErrorState error={error} />;

  return <div>{/* Render metrics */}</div>;
}
```

---

## 10. Suspense Boundaries Strategy

### Why Suspense Matters for Offline-First

Even though data is local (IndexedDB), async operations still exist:
- Opening database connection
- Querying indexes
- Filtering/aggregating data

**Benefits**:
- Progressive rendering (show UI as data loads)
- Better perceived performance
- Graceful handling of slow operations

### Suspense Placement

**Rule**: Wrap each independent async component in Suspense.

**Example - Dashboard Page**:

```typescript
// app/page.tsx
<Suspense fallback={<MetricsSkeleton />}>
  <DashboardMetrics /> {/* Async: queries current month expenses */}
</Suspense>

<Suspense fallback={<ChartSkeleton />}>
  <ExpenseChart /> {/* Async: queries and aggregates expenses */}
</Suspense>

<Suspense fallback={<RecentExpensesSkeleton />}>
  <RecentExpenses /> {/* Async: queries recent 5-10 expenses */}
</Suspense>
```

**Why Separate Boundaries**:
- Metrics can render while chart is still loading
- Better UX (progressive disclosure)
- Error in one section doesn't block others

### Suspense with Client Components

**Important**: Suspense works with Client Components if they use async data fetching patterns.

**Pattern**:

```typescript
// ✅ Client Component wrapped in Suspense (in parent Server Component)
export default function Page() {
  return (
    <Suspense fallback={<Skeleton />}>
      <AsyncClientComponent />
    </Suspense>
  );
}

// Client Component
'use client';
export function AsyncClientComponent() {
  const { data, isLoading } = useData();
  if (isLoading) return <Skeleton />; // Fallback inside component
  return <div>{data}</div>;
}
```

---

## 11. Metadata and SEO

### Root Layout Metadata

**File**: `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: 'Expense Tracker AI',
  description: 'Personal expense management with AI-driven layout customization',
  keywords: ['expense tracker', 'personal finance', 'budgeting', 'AI', 'offline-first'],
  authors: [{ name: 'josecortezz16' }],
  creator: 'josecortezz16',
  publisher: 'josecortezz16',
  openGraph: {
    title: 'Expense Tracker AI',
    description: 'Manage your expenses offline with intelligent layout customization',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Expense Tracker AI',
    description: 'Manage your expenses offline with intelligent layout customization',
  },
  manifest: '/manifest.json', // Future PWA support
  themeColor: '#ffffff',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};
```

### Page-Specific Metadata

**Dashboard Page** (`app/page.tsx`):

```typescript
export const metadata: Metadata = {
  title: 'Dashboard | Expense Tracker AI',
  description: 'View your expense insights, charts, and recent transactions at a glance',
  openGraph: {
    title: 'Dashboard | Expense Tracker AI',
    description: 'View your expense insights, charts, and recent transactions',
  },
};
```

**Expenses Page** (`app/expenses/page.tsx`):

```typescript
export const metadata: Metadata = {
  title: 'Expenses | Expense Tracker AI',
  description: 'View, filter, and manage all your expense records',
  openGraph: {
    title: 'Expenses | Expense Tracker AI',
    description: 'View, filter, and manage all your expense records',
  },
};
```

### Future: PWA Manifest

**File**: `public/manifest.json` (Future Phase)

```json
{
  "name": "Expense Tracker AI",
  "short_name": "ExpenseAI",
  "description": "Personal expense management with AI customization",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 12. Layout Composition and Providers

### Root Layout Provider Pattern

Since this is offline-first with no authentication, minimal providers are needed.

**Potential Providers** (Future):
1. **Zustand Stores**: No provider needed (global singleton)
2. **React Query**: If implemented, needs QueryClientProvider
3. **Theme Provider**: If dark mode added

**Current Phase**: No providers needed.

**Future Phase** (if React Query added):

```typescript
// src/app/layout.tsx
import { QueryProvider } from '@/lib/query-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
          <ChatBubble />
        </QueryProvider>
      </body>
    </html>
  );
}

// src/lib/query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false, // Offline-first, no refetch needed
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### Persistent Chat Bubble

**Challenge**: Chat bubble must be visible on all pages.

**Solution**: Place in root layout after `{children}`.

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children} {/* Dashboard or Expenses page */}
        <ChatBubble /> {/* ✅ Always visible */}
      </body>
    </html>
  );
}
```

**ChatBubble Component**:
- Fixed position (bottom-right)
- High z-index (above all content)
- Client Component (manages open/closed state)

---

## 13. Performance Optimizations

### Code Splitting Strategy

**Automatic Code Splitting**:
- Next.js automatically code-splits at page boundaries
- Each route (`/`, `/expenses`) is a separate chunk

**Manual Code Splitting** (for heavy components):

```typescript
// Dynamic import for chart library (if heavy)
import dynamic from 'next/dynamic';

const ExpenseChart = dynamic(
  () => import('@/domains/dashboard/components/organisms/expense-chart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false, // ❌ Don't SSR chart (IndexedDB dependency)
  }
);

export default function DashboardPage() {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <ExpenseChart />
    </Suspense>
  );
}
```

**When to Use Dynamic Imports**:
- Chart libraries (Chart.js, Recharts - heavy dependencies)
- Rich text editors (if added for expense descriptions)
- AI chat components (if LLM integration is heavy)

### Image Optimization

**Use Case**: If expense attachments or receipt images added in future.

**Pattern**:

```typescript
import Image from 'next/image';

<Image
  src="/receipt.jpg"
  alt="Expense receipt"
  width={400}
  height={300}
  loading="lazy"
  placeholder="blur"
/>
```

**Current Phase**: No images needed (text-only expenses).

### Font Optimization

**Already Implemented**: Using `next/font/google` for Geist Sans and Geist Mono.

```typescript
// src/app/layout.tsx
import { Geist, Geist_Mono } from 'next/font/google';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // ✅ Font display swap for performance
});
```

**Benefits**:
- Self-hosted fonts (no external requests)
- Automatic subsetting
- Font display swap (prevents layout shift)

### IndexedDB Performance

**Optimization Strategies**:

1. **Index Usage**: Use indexes for filtering (category, date)
2. **Batch Operations**: Batch multiple reads/writes
3. **Lazy Loading**: Paginate expense list (20 items at a time)
4. **Caching**: Store calculated metrics in memory (useMemo)

**Example**:

```typescript
// domains/dashboard/hooks/use-dashboard-metrics.ts
import { useMemo } from 'react';
import { useExpenses } from '@/domains/expenses/hooks/use-expenses';
import { calculateMetrics } from '../utils/calculate-metrics';

export function useDashboardMetrics() {
  const { expenses, isLoading, error } = useExpenses();

  // ✅ Memoize expensive calculation
  const metrics = useMemo(() => {
    if (!expenses) return null;
    return calculateMetrics(expenses);
  }, [expenses]);

  return { metrics, isLoading, error };
}
```

---

## 14. Hydration Strategy (Critical for Offline-First)

### The Hydration Mismatch Problem

**Problem**: IndexedDB data is not available during SSR, causing hydration mismatches.

**Symptom**:
```
Warning: Text content did not match. Server: "0 expenses" Client: "23 expenses"
```

**Solution 1: Suppress Hydration Warning** (Simple)

```typescript
'use client';

export function ExpenseCount() {
  const { expenses } = useExpenses();

  return (
    <div suppressHydrationWarning>
      {expenses.length} expenses
    </div>
  );
}
```

**Solution 2: Client-Only Rendering** (Recommended)

```typescript
'use client';

import { useEffect, useState } from 'react';

export function ExpenseCount() {
  const [isClient, setIsClient] = useState(false);
  const { expenses } = useExpenses();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Skeleton />;

  return <div>{expenses.length} expenses</div>;
}
```

**Solution 3: Dynamic Import with SSR Disabled** (Best Performance)

```typescript
// Use dynamic import to prevent SSR entirely
import dynamic from 'next/dynamic';

const ExpenseList = dynamic(
  () => import('@/domains/expenses/components/organisms/expense-list'),
  { ssr: false } // ❌ Skip SSR for IndexedDB components
);

export default function ExpensesPage() {
  return <ExpenseList />;
}
```

**Recommendation**: Use Solution 3 for all IndexedDB-dependent components.

---

## 15. Route Configuration

### Static Routes Only

**Current Routes**:
- `/` - Dashboard (static)
- `/expenses` - Expenses list (static)

**No Dynamic Routes Needed**:
- No user profiles (single user)
- No expense detail pages (edit in modal)
- No authentication routes (no auth)

### Route Groups (Not Needed)

**Route Groups** (`(group-name)`) are useful for:
- Organizing routes without affecting URLs
- Shared layouts for subset of routes

**Current Project**: Only 2 pages, no need for route groups.

**Future Consideration**: If adding settings page, reports page, etc., could organize as:

```
app/
├── (app)/          # Main application routes
│   ├── page.tsx    # Dashboard
│   ├── expenses/
│   └── reports/
└── (settings)/     # Settings routes
    └── page.tsx
```

### Parallel Routes (Not Needed)

**Use Case**: Showing multiple pages in same layout simultaneously (e.g., modal + page).

**Current Project**: Expense form is modal, but doesn't need parallel routes (use Dialog component).

### Intercepting Routes (Not Needed)

**Use Case**: Intercepting navigation to show modal (e.g., image gallery).

**Current Project**: Expense form modal doesn't require route interception (state-based modal).

---

## 16. Potential Challenges and Solutions

### Challenge 1: IndexedDB Initialization Timing

**Problem**: IndexedDB must be initialized before first query.

**Solution**: Initialize in root-level Client Component.

```typescript
// src/lib/db-provider.tsx
'use client';

import { useEffect } from 'react';
import { initDB } from '@/lib/db';

export function DBProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initDB(); // Initialize IndexedDB on mount
  }, []);

  return <>{children}</>;
}

// src/app/layout.tsx
import { DBProvider } from '@/lib/db-provider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DBProvider>
          {children}
          <ChatBubble />
        </DBProvider>
      </body>
    </html>
  );
}
```

### Challenge 2: Stale Data After Mutation

**Problem**: After creating/updating/deleting expense, UI doesn't reflect change.

**Solution**: Manual cache invalidation or optimistic updates.

**Pattern**:

```typescript
// domains/expenses/hooks/use-create-expense.ts
import { useState } from 'react';
import { createExpense } from '../actions';
import { useExpenses } from './use-expenses';

export function useCreateExpense() {
  const { refetch } = useExpenses(); // Assumes refetch method

  return async (expense: Expense) => {
    await createExpense(expense);
    refetch(); // ✅ Refresh expense list
  };
}
```

**Alternative**: Use React Query for automatic cache invalidation.

### Challenge 3: Chat State Persistence Across Pages

**Problem**: Chat window closes when navigating between pages.

**Solution**: Store chat state in Zustand (global store).

```typescript
// domains/ai-chat/stores/chat-store.ts
import { create } from 'zustand';

interface ChatStore {
  isOpen: boolean;
  messages: ChatMessage[];
  toggleChat: () => void;
  addMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  messages: [],
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}));
```

**Usage in ChatBubble**:

```typescript
'use client';

import { useChatStore } from '@/domains/ai-chat/stores/chat-store';

export function ChatBubble() {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <>
      <button onClick={toggleChat}>Chat</button>
      {isOpen && <ChatWindow />}
    </>
  );
}
```

### Challenge 4: Mobile Responsiveness with Fixed Chat Bubble

**Problem**: Chat bubble obstructs content on small screens.

**Solution**: Responsive positioning and full-screen chat on mobile.

```typescript
// Chat bubble positioning
<div className="fixed bottom-4 right-4 z-50 md:bottom-8 md:right-8">
  <button>Chat</button>
</div>

// Chat window responsive sizing
<div className="fixed inset-0 md:inset-auto md:bottom-24 md:right-8 md:h-[500px] md:w-[350px]">
  <ChatWindow />
</div>
```

---

## 17. Files to Create

### App Router Files

1. **`src/app/layout.tsx`** (Modify existing)
   - Update metadata
   - Add ChatBubble component
   - Add DBProvider (if needed)

2. **`src/app/page.tsx`** (Modify existing)
   - Replace placeholder with Dashboard template
   - Add Suspense boundaries
   - Add metadata

3. **`src/app/expenses/page.tsx`** (Create new)
   - Expenses page component
   - Suspense for ExpenseList
   - Add metadata

4. **`src/app/loading.tsx`** (Create new)
   - Global loading skeleton

5. **`src/app/error.tsx`** (Create new)
   - Global error boundary

6. **`src/app/not-found.tsx`** (Create new)
   - 404 page

7. **`src/app/globals.css`** (Verify exists)
   - Global styles, Tailwind imports

### Infrastructure Files

8. **`src/lib/db.ts`** (Create new)
   - IndexedDB initialization
   - Database connection utility
   - Schema definition

9. **`src/lib/db-provider.tsx`** (Create new)
   - Client Component to initialize DB
   - Used in root layout

### Domain Files (Created by Domain Architect)

Domain Architect will create:
- `domains/expenses/` - Expense CRUD, hooks, schemas
- `domains/dashboard/` - Metrics calculation, aggregation
- `domains/ai-chat/` - Chat state, agent integration

---

## 18. Files to Modify

### `src/app/layout.tsx`

**Changes**:
- Update metadata (title, description, OpenGraph)
- Add ChatBubble component import
- Wrap children in DBProvider (if needed)

### `src/app/page.tsx`

**Changes**:
- Remove placeholder content
- Add Dashboard template structure
- Add Suspense boundaries for each section
- Add page-specific metadata

---

## 19. Implementation Steps

1. ✅ Create `src/lib/db.ts` - IndexedDB client
2. ✅ Create `src/lib/db-provider.tsx` - DB initialization provider
3. ✅ Modify `src/app/layout.tsx` - Update metadata, add ChatBubble
4. ✅ Create `src/app/loading.tsx` - Global loading state
5. ✅ Create `src/app/error.tsx` - Global error boundary
6. ✅ Create `src/app/not-found.tsx` - 404 page
7. ✅ Modify `src/app/page.tsx` - Dashboard template with Suspense
8. ✅ Create `src/app/expenses/page.tsx` - Expenses page with Suspense
9. ⏸️ Wait for Domain Architect to create domain structure
10. ⏸️ Wait for UX Designer to finalize component layouts
11. ⏸️ Wait for shadcn Builder to select components
12. ✅ Integrate domain components into pages
13. ✅ Test Server vs Client component boundaries
14. ✅ Test hydration behavior
15. ✅ Test Suspense boundaries
16. ✅ Verify SEO metadata
17. ✅ Test mobile responsiveness

---

## 20. Component Placement Strategy

### Server Components

**Location**: Directly in domain component directories if reusable.

**Examples**:
- `domains/dashboard/components/atoms/metric-card.tsx` (pure presentation)
- `domains/expenses/components/molecules/expense-card.tsx` (pure presentation)
- `components/atoms/skeleton.tsx` (pure presentation)

### Client Components

**Location**:
- **Domain-specific**: `domains/{domain}/components/`
- **Reusable**: `components/` (atoms, molecules, organisms)

**Examples**:
- `domains/expenses/components/organisms/expense-list.tsx` (Client - IndexedDB)
- `domains/dashboard/components/organisms/dashboard-metrics.tsx` (Client - IndexedDB)
- `domains/ai-chat/components/organisms/chat-bubble.tsx` (Client - state)

### Rule of Thumb

**Server Components**:
- Static presentation components (receive data as props)
- Layout components (composition only)
- Skeleton/loading components

**Client Components**:
- IndexedDB access
- Event handlers (onClick, onChange)
- State management (useState, Zustand)
- Form components (React Hook Form)
- Interactive UI (charts, modals)

---

## 21. Performance Considerations (Summary)

### Code Splitting

✅ **Automatic**: Next.js code-splits at page boundaries
✅ **Manual**: Use `dynamic()` for heavy chart libraries

### Caching Strategy

✅ **IndexedDB**: Local cache (inherently cached)
✅ **React**: useMemo for expensive calculations
❌ **No server cache**: Offline-first, no server to cache

### Lazy Loading

✅ **Expenses**: Paginate (20 items per load)
✅ **Charts**: Dynamic import if library is heavy
✅ **Images**: Use next/image with lazy loading (future)

### Hydration Optimization

✅ **SSR Disabled**: Use `ssr: false` for IndexedDB components
✅ **Client-Only Rendering**: Use useEffect pattern for hydration safety

---

## 22. Coordination with Other Agents

### From Domain Architect

**Receives**:
- IndexedDB CRUD operations (actions.ts)
- Custom hooks (use-expenses.ts, use-dashboard-metrics.ts)
- Zod schemas (schema.ts)
- TypeScript types (types.ts)
- Business logic utilities (calculate-metrics.ts)

**Uses**:
- Import domain components into pages
- Wrap Client Components in Suspense
- Pass data between Server and Client boundaries

### From UX Designer

**Receives**:
- Component layout specifications
- Responsive breakpoint strategy
- Visual hierarchy guidelines
- Loading state designs

**Provides**:
- Route structure and page organization
- Server vs Client component architecture
- Data flow patterns

### From shadcn Builder

**Receives**:
- Component selection (Button, Input, Select, Dialog, Card)
- Composition patterns

**Uses**:
- shadcn components in pages and domain components
- Ensure components work in Server Component context (or add 'use client' if needed)

---

## 23. Important Notes

⚠️ **IndexedDB = Client Component**: Any component accessing IndexedDB MUST be Client Component.

⚠️ **Suspense is Mandatory**: Even for offline-first, async operations need Suspense.

⚠️ **No Server Actions**: This is offline-first, no server exists. Actions are client-side functions.

💡 **Maximize Server Components**: Keep pages and presentation components as Server Components for SEO and performance.

💡 **Hydration Awareness**: Use `ssr: false` or client-only patterns to avoid hydration mismatches.

💡 **Chat State Persistence**: Use Zustand to maintain chat state across page navigations.

🎯 **Progressive Enhancement**: Show loading states, then data. Don't block rendering.

📝 **Metadata for All Pages**: Add SEO metadata to every page for discoverability.

---

## 24. Next Steps for Parent Agent

1. **Execute this plan**: Create app router structure
2. **Wait for Domain Architect**: Domain structure, schemas, hooks
3. **Wait for UX Designer**: Layout specifications, component designs
4. **Wait for shadcn Builder**: Component selections
5. **Integrate domain components**: Import into pages
6. **Test architecture**:
   - Server vs Client boundaries
   - Suspense behavior
   - Hydration (no mismatches)
   - IndexedDB initialization
   - Chat state persistence
   - Mobile responsiveness
7. **Verify SEO**: Metadata, OpenGraph tags
8. **Document decisions**: Update session context

---

## 25. Success Criteria

✅ **Route Structure**:
- `/` → Dashboard page (Server Component)
- `/expenses` → Expenses page (Server Component)

✅ **Server Component Strategy**:
- Pages are Server Components
- Presentation components are Server Components
- Only IndexedDB/interactive components are Client

✅ **Loading States**:
- Global loading.tsx
- Suspense boundaries for each async section
- Component-level skeletons

✅ **Error Handling**:
- Global error.tsx
- 404 page
- Component-level error states

✅ **SEO**:
- Root metadata configured
- Page-specific metadata
- OpenGraph tags

✅ **Performance**:
- Code splitting at page boundaries
- Dynamic imports for heavy components
- Font optimization (next/font)

✅ **Offline-First**:
- IndexedDB initialization
- No server dependencies
- Client-side data fetching pattern

✅ **Mobile Responsive**:
- Chat bubble responsive positioning
- Mobile-first Tailwind classes
- Responsive Suspense skeletons

---

**Plan Complete**. Ready for parent agent execution.
