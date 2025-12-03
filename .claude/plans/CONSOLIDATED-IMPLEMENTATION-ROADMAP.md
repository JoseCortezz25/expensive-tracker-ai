# Consolidated Implementation Roadmap
# Expense Tracker AI - Complete Implementation Plan

**Session ID**: session_expense_tracker_20251202
**Created**: 2025-12-02
**Status**: Ready for Execution

---

## Executive Summary

All 5 specialized agents have completed their planning phase. This document consolidates their recommendations into a unified, actionable implementation roadmap.

**Agents Completed**:
- ✅ Business Analyst - Requirements refinement (18 user stories, edge cases, success metrics)
- ✅ Domain Architect - Domain structure (3 domains, 23 files, IndexedDB architecture)
- ✅ UX/UI Designer - Layout specifications (mobile-first, responsive strategy, design system)
- ✅ shadcn Builder - Component selection (14 shadcn components, Atomic Design hierarchy)
- ✅ Next.js Builder - App Router architecture (Server/Client strategy, routing, metadata)

---

## Implementation Priority: P0 → P1 → P2 → P3

### P0 - Critical MVP (3-4 weeks)
**Must-have features for functional application**:
1. IndexedDB setup and CRUD operations
2. Dashboard (4 metrics + chart + recent expenses)
3. Expenses page (list + category filter + pagination)
4. Expense form (create/edit with validation)
5. Delete with confirmation
6. Mobile responsiveness
7. Basic error handling

### P1 - High Priority UX (1-2 weeks)
**Important user experience enhancements**:
1. Date range filter + description search
2. Chat interface UI (bubble + window)
3. Enhanced error handling (retry logic, warnings)
4. Loading states and skeletons
5. Accessibility (keyboard nav, ARIA)

### P2 - Medium Priority (2-3 weeks)
**Nice-to-have features**:
1. AI Layout Intelligence Agent (suggestions)
2. Enhanced chart visualizations
3. Advanced sorting options
4. Toast notifications and feedback

### P3 - Low Priority / Future (Stage 3)
**Future enhancements**:
1. AI layout execution (not just suggestions)
2. Export/import functionality
3. Advanced analytics
4. Dark mode / themes

---

## Phase 1: Foundation Setup (Days 1-2)

### 1.1 Install shadcn/ui Components

**Commands to run**:
```bash
# Phase 1 - Core Forms (required)
pnpm dlx shadcn@latest add form label calendar popover

# Phase 2 - Display (required)
pnpm dlx shadcn@latest add card badge separator skeleton

# Phase 3 - Modals (required)
pnpm dlx shadcn@latest add dialog drawer alert-dialog

# Phase 4 - Feedback (required)
pnpm dlx shadcn@latest add sonner
```

**External dependencies**:
```bash
pnpm add recharts date-fns react-hook-form @hookform/resolvers zod idb
```

**Verification**:
- [ ] All components exist in `@/components/ui/`
- [ ] Dependencies installed in package.json
- [ ] No TypeScript errors

---

### 1.2 Create IndexedDB Client

**File**: `src/lib/db.ts`

**Requirements**:
- Database name: `expense-tracker-db`
- Version: 1
- Object store: `expenses` (keyPath: `id`)
- Indexes: `date`, `category`, `createdAt`
- Export: `openDB()` function using `idb` library

**Critical**: This is browser-only, must be used in Client Components only.

---

### 1.3 Create Text Maps

**Files to create** (before any UI components):
1. `src/domains/expenses/expenses.text-map.ts` (50+ keys)
2. `src/domains/dashboard/dashboard.text-map.ts` (20+ keys)
3. `src/domains/ai-chat/ai-chat.text-map.ts` (15+ keys)

**Pattern**:
```typescript
export const expensesTextMap = {
  heading: 'Expenses',
  addButton: 'Add Expense',
  // ... all text externalized
} as const;
```

---

## Phase 2: Domain Layer - Expenses (Days 3-5)

### 2.1 Expenses Domain Structure

**Create files in order**:

1. **`src/domains/expenses/types.ts`**
   - `Expense` interface (id, description, amount, category, date, createdAt, updatedAt)
   - `ExpenseCategory` type (7 categories)
   - `ExpenseFilters` interface
   - `CreateExpenseInput`, `UpdateExpenseInput` types

2. **`src/domains/expenses/schema.ts`**
   - `expenseSchema` (Zod) - full validation
   - `createExpenseSchema` - omits ID and timestamps
   - `updateExpenseSchema` - all fields optional
   - Export types: `z.infer<typeof expenseSchema>`

3. **`src/domains/expenses/errors.ts`**
   - `ExpenseNotFoundError`
   - `ExpenseValidationError`
   - `IndexedDBError`

4. **`src/domains/expenses/actions.ts`** (Client-side, NOT Server Actions)
   - `'use client'` directive at top
   - `createExpense(input: CreateExpenseInput): Promise<Expense>`
   - `getExpenses(filters?: ExpenseFilters): Promise<Expense[]>`
   - `getExpenseById(id: string): Promise<Expense>`
   - `updateExpense(id: string, input: UpdateExpenseInput): Promise<Expense>`
   - `deleteExpense(id: string): Promise<void>`

5. **`src/domains/expenses/hooks/use-expenses.ts`**
   - Custom hook wrapping `getExpenses()`
   - Returns: `{ data, isLoading, error, refetch }`
   - Uses `useEffect` for data fetching

6. **`src/domains/expenses/hooks/use-create-expense.ts`**
   - Custom hook wrapping `createExpense()`
   - Returns: `{ mutate, isLoading, error }`
   - Manual refetch pattern

7. **`src/domains/expenses/hooks/use-update-expense.ts`**
   - Custom hook wrapping `updateExpense()`
   - Returns: `{ mutate, isLoading, error }`

8. **`src/domains/expenses/hooks/use-delete-expense.ts`**
   - Custom hook wrapping `deleteExpense()`
   - Returns: `{ mutate, isLoading, error }`

9. **`src/domains/expenses/hooks/use-expense-filters.ts`**
   - Wrapper around Zustand store
   - Simplified API for filter management

10. **`src/domains/expenses/stores/expense-filters-store.ts`**
    - Zustand store for UI filter state
    - `categoryFilter`, `dateRange`, `searchQuery`
    - Actions: `setCategoryFilter`, `setDateRange`, `setSearchQuery`, `resetFilters`

---

### 2.2 Test Expenses Domain

**Manual testing checklist**:
- [ ] Create expense via IndexedDB DevTools
- [ ] Query expenses with `useExpenses()` hook
- [ ] Update expense
- [ ] Delete expense
- [ ] Verify IndexedDB persistence
- [ ] Test validation errors (invalid amount, missing category)

---

## Phase 3: Domain Layer - Dashboard (Days 6-7)

### 3.1 Dashboard Domain Structure

**Create files**:

1. **`src/domains/dashboard/types.ts`**
   - `DashboardMetrics` interface (totalSpentThisMonth, avgDailySpending, topCategory, transactionCount)
   - `ChartData` interface (for Recharts)
   - `ChartGroupBy` type ('day' | 'category')

2. **`src/domains/dashboard/utils/metrics.ts`**
   - `calculateDashboardMetrics(expenses: Expense[]): DashboardMetrics`
   - Handle edge cases: empty array, 1st of month, etc.
   - Pure function (no side effects)

3. **`src/domains/dashboard/utils/chart-data.ts`**
   - `aggregateExpensesByDay(expenses: Expense[]): ChartData[]`
   - `aggregateExpensesByCategory(expenses: Expense[]): ChartData[]`
   - `buildChartData(expenses: Expense[], groupBy: ChartGroupBy): ChartData[]`

4. **`src/domains/dashboard/hooks/use-dashboard-metrics.ts`**
   - Fetches current month expenses
   - Calculates metrics using utility
   - Returns: `{ metrics, isLoading, error }`

5. **`src/domains/dashboard/hooks/use-expense-chart.ts`**
   - Fetches current month expenses
   - Aggregates chart data
   - Supports groupBy toggle
   - Returns: `{ chartData, groupBy, setGroupBy, isLoading, error }`

6. **`src/domains/dashboard/hooks/use-recent-expenses.ts`**
   - Fetches 10 most recent expenses
   - Returns: `{ expenses, isLoading, error }`

---

## Phase 4: Domain Layer - AI Chat (Day 8)

### 4.1 AI Chat Domain Structure

**Create files**:

1. **`src/domains/ai-chat/types.ts`**
   - `ChatMessage` interface (id, role, content, timestamp, layoutConfig)
   - `LayoutSuggestion` interface
   - `ChatRole` type ('user' | 'assistant')

2. **`src/domains/ai-chat/agents/layout-intelligence-agent.ts`**
   - `parseLayoutRequest(message: string): LayoutSuggestion | null`
   - Rule-based pattern matching (Stage 1-2)
   - Returns structured layout config

3. **`src/domains/ai-chat/hooks/use-chat.ts`**
   - Wrapper around chat Zustand store
   - `{ messages, sendMessage, isTyping }`

4. **`src/domains/ai-chat/hooks/use-layout-agent.ts`**
   - Calls layout intelligence agent
   - `{ getLayoutSuggestion }`

5. **`src/domains/ai-chat/stores/chat-store.ts`**
   - Zustand store for chat state
   - `messages`, `isOpen`, `isTyping`
   - Actions: `addMessage`, `toggleChat`, `setTyping`

---

## Phase 5: UI Components - Atoms (Day 9)

### 5.1 Expense Atoms

**Create in `src/domains/expenses/components/atoms/`**:

1. **`expense-amount.tsx`**
   - Displays formatted currency
   - Props: `amount: number`
   - Uses `Intl.NumberFormat` for locale formatting

2. **`expense-date.tsx`**
   - Displays formatted date
   - Props: `date: Date`
   - Uses `date-fns` for formatting

3. **`category-badge.tsx`**
   - Wraps shadcn Badge
   - Props: `category: ExpenseCategory`
   - Color coding per category

---

## Phase 6: UI Components - Molecules (Days 10-11)

### 6.1 Dashboard Molecules

**Create in `src/domains/dashboard/components/molecules/`**:

1. **`metric-card.tsx`**
   - Wraps shadcn Card
   - Props: `label: string`, `value: string | number`, `icon?: ReactNode`
   - Displays single metric

### 6.2 Expenses Molecules

**Create in `src/domains/expenses/components/molecules/`**:

1. **`expense-card.tsx`**
   - Wraps shadcn Card
   - Props: `expense: Expense`, `onClick: () => void`
   - Displays description, amount, category badge, date
   - Clickable for edit

2. **`date-picker.tsx`**
   - Combines Calendar + Popover + Button
   - Props: `value: Date`, `onChange: (date: Date) => void`
   - Accessible date selection

3. **`search-bar.tsx`**
   - Wraps shadcn Input
   - Props: `value: string`, `onChange: (value: string) => void`
   - Debounced 300ms

4. **`date-range-picker.tsx`**
   - Two DatePicker components
   - Props: `startDate`, `endDate`, `onStartChange`, `onEndChange`

### 6.3 AI Chat Molecules

**Create in `src/domains/ai-chat/components/molecules/`**:

1. **`message-bubble.tsx`**
   - Props: `message: ChatMessage`
   - Different styling for user vs assistant

---

## Phase 7: UI Components - Organisms (Days 12-15)

### 7.1 Expenses Organisms

**Create in `src/domains/expenses/components/organisms/`**:

1. **`expense-form.tsx`** (Complex, 2-3 hours)
   - `'use client'`
   - React Hook Form + Zod resolver
   - All 4 fields: description, amount, category, date
   - Supports create and edit modes
   - Dialog (desktop) / Drawer (mobile) wrapper
   - Props: `expense?: Expense`, `onSuccess: () => void`, `onCancel: () => void`
   - Validation errors displayed inline
   - Submit button disabled while loading

2. **`expense-list.tsx`** (2 hours)
   - `'use client'`
   - Uses `useExpenses()` hook
   - Grid of ExpenseCard components
   - Loading skeleton
   - Empty state
   - Pagination (20 items, load more)
   - Props: `filters: ExpenseFilters`

3. **`expense-filters.tsx`** (1.5 hours)
   - Category multi-select (shadcn Select)
   - DateRangePicker
   - SearchBar
   - Clear filters button
   - Uses `useExpenseFilters()` hook

### 7.2 Dashboard Organisms

**Create in `src/domains/dashboard/components/organisms/`**:

1. **`dashboard-metrics.tsx`** (1 hour)
   - `'use client'`
   - Uses `useDashboardMetrics()` hook
   - Grid of 4 MetricCard components
   - Loading skeletons
   - Responsive grid (2x2 mobile, 4x1 desktop)

2. **`expense-chart.tsx`** (2-3 hours)
   - `'use client'`
   - Uses `useExpenseChart()` hook
   - Recharts Bar/Line chart
   - GroupBy toggle (day vs category)
   - Responsive sizing
   - Loading state

3. **`recent-expenses-list.tsx`** (1 hour)
   - `'use client'`
   - Uses `useRecentExpenses()` hook
   - List of 10 recent ExpenseCard components
   - "View All" link to /expenses

### 7.3 AI Chat Organisms

**Create in `src/domains/ai-chat/components/organisms/`**:

1. **`chat-bubble.tsx`** (1 hour)
   - `'use client'`
   - Fixed position bottom-right
   - Opens chat window on click
   - Uses `useChatStore()`

2. **`chat-window.tsx`** (2 hours)
   - `'use client'`
   - Message history (ScrollArea)
   - Input field + send button
   - Typing indicator
   - Uses `useChat()` and `useLayoutAgent()`

---

## Phase 8: Templates & Pages (Days 16-17)

### 8.1 Dashboard Template

**File**: `src/domains/dashboard/components/templates/dashboard-template.tsx`
- Layout composition: Metrics + Chart + Recent Expenses
- Suspense boundaries for each section
- Add expense button (opens form)

### 8.2 Expenses Template

**File**: `src/domains/expenses/components/templates/expenses-template.tsx`
- Layout composition: Filters + List + Add button
- Suspense boundary for list

### 8.3 App Pages

**Update/create**:

1. **`src/app/page.tsx`** (Dashboard)
   - Server Component
   - Metadata
   - Composes DashboardTemplate
   - Suspense for async components

2. **`src/app/expenses/page.tsx`** (Expenses)
   - Server Component
   - Metadata
   - Composes ExpensesTemplate
   - Suspense for list

3. **`src/app/layout.tsx`** (Root Layout)
   - Add ChatBubble (global, persistent)
   - Add Toaster from Sonner
   - Metadata configuration

4. **`src/app/loading.tsx`**
   - Global loading UI (spinner or skeleton)

5. **`src/app/error.tsx`**
   - Global error boundary
   - "Something went wrong" message
   - Retry button

6. **`src/app/not-found.tsx`**
   - 404 page
   - Link back to dashboard

---

## Phase 9: Integration & Testing (Days 18-20)

### 9.1 Integration Checklist

- [ ] All domains connected to IndexedDB
- [ ] Dashboard metrics update on CRUD
- [ ] Expense form creates/updates correctly
- [ ] Filters work (category, date, search)
- [ ] Pagination loads 20 items, then more
- [ ] Chat interface sends/receives messages
- [ ] AI agent returns layout suggestions
- [ ] Mobile responsive (test 375px width)
- [ ] Keyboard navigation works
- [ ] All text externalized to text maps
- [ ] No hardcoded strings in components

### 9.2 Manual Testing Plan

**Test Scenarios** (from Business Analyst plan):

1. **Create Expense**:
   - Dashboard → Add button → Form → Fill fields → Save
   - Expected: Expense saved to IndexedDB, toast shown, dashboard updates

2. **Edit Expense**:
   - Expenses page → Click card → Form opens with data → Modify → Save
   - Expected: Expense updated, list refreshes

3. **Delete Expense**:
   - Edit form → Delete button → Confirmation dialog → Confirm
   - Expected: Expense removed, list updates

4. **Filter Expenses**:
   - Select category "Comida" → List shows only food expenses
   - Date range: This month → List shows current month only
   - Search "coffee" → List shows matching descriptions

5. **Chat Interaction**:
   - Click chat bubble → Window opens → Type "move metrics to left" → Send
   - Expected: AI responds with layout suggestion

6. **Edge Cases**:
   - Empty state: No expenses → Dashboard shows $0, chart empty, "No expenses" message
   - Month transition: Jan 1 → Metrics reset to zero (not December data)
   - 1st of month: Average daily shows total ÷ 1 (not ÷ 0 error)
   - Validation errors: Invalid amount (negative) → Form shows error, submit disabled

---

## Phase 10: Polish & Accessibility (Days 21-23)

### 10.1 Accessibility Audit

**WCAG 2.1 AA Compliance**:
- [ ] Color contrast ≥ 4.5:1 for text
- [ ] Keyboard navigation works for all interactive elements
- [ ] Focus indicators visible
- [ ] ARIA labels on all form fields
- [ ] ARIA live regions for dynamic content (toasts, loading states)
- [ ] Heading hierarchy logical (h1 → h2 → h3)
- [ ] Images have alt text (if any)
- [ ] Touch targets ≥ 44x44px (mobile)

### 10.2 Performance Optimization

- [ ] Dynamic import for Recharts (`ssr: false`)
- [ ] Lazy load chat window (only when opened)
- [ ] useMemo for expensive calculations (metrics, chart data)
- [ ] Debounced search (300ms)
- [ ] Pagination (20 items per page)
- [ ] Code splitting at page boundaries

### 10.3 Error Handling

- [ ] Global error boundary (app/error.tsx)
- [ ] IndexedDB failures show error state
- [ ] Validation errors show inline
- [ ] Toast notifications for CRUD feedback
- [ ] Retry logic for transient failures

---

## Critical Decisions Summary

### Architecture
- **Offline-First**: IndexedDB only, no backend
- **Client Components**: All data-fetching uses `'use client'` (IndexedDB browser-only)
- **Custom Hooks**: Lightweight pattern for business logic (not React Query for MVP)
- **Zustand**: UI state only (filters, chat), NEVER for server data

### Design
- **Mobile-First**: Design smallest screen first
- **Responsive Breakpoints**: 640px (tablet), 1024px (desktop)
- **Forms**: Modal (desktop), Drawer (mobile)
- **Colors**: Category badges use chart-1 through chart-5 from globals.css

### Components
- **shadcn/ui**: 14 components total (Button, Input, Select, Calendar, Card, Dialog, Drawer, Badge, Skeleton, Sonner, Form components)
- **Chart Library**: Recharts (React-friendly, accessible)
- **Atomic Design**: Strict hierarchy (atoms → molecules → organisms → templates → pages)

### Validation
- **React Hook Form + Zod**: All forms use this pattern
- **Inline Errors**: Show validation errors immediately on blur
- **Server-Side Validation**: N/A (offline-first, no server)

### AI Agent
- **Stage 1-2**: Rule-based pattern matching (simple)
- **Stage 3** (future): LLM API integration for natural language

---

## Files to Create: Complete Checklist

**Total Files**: 55+

### Infrastructure (3)
- [ ] `src/lib/db.ts` - IndexedDB client
- [ ] `src/lib/db-provider.tsx` - DB initialization
- [ ] `src/config/categories.ts` - Category constants

### Text Maps (3)
- [ ] `src/domains/expenses/expenses.text-map.ts`
- [ ] `src/domains/dashboard/dashboard.text-map.ts`
- [ ] `src/domains/ai-chat/ai-chat.text-map.ts`

### Expenses Domain (13)
- [ ] `src/domains/expenses/types.ts`
- [ ] `src/domains/expenses/schema.ts`
- [ ] `src/domains/expenses/errors.ts`
- [ ] `src/domains/expenses/actions.ts`
- [ ] `src/domains/expenses/hooks/use-expenses.ts`
- [ ] `src/domains/expenses/hooks/use-create-expense.ts`
- [ ] `src/domains/expenses/hooks/use-update-expense.ts`
- [ ] `src/domains/expenses/hooks/use-delete-expense.ts`
- [ ] `src/domains/expenses/hooks/use-expense-filters.ts`
- [ ] `src/domains/expenses/stores/expense-filters-store.ts`
- [ ] `src/domains/expenses/components/atoms/expense-amount.tsx`
- [ ] `src/domains/expenses/components/atoms/expense-date.tsx`
- [ ] `src/domains/expenses/components/atoms/category-badge.tsx`

### Expenses Molecules & Organisms (6)
- [ ] `src/domains/expenses/components/molecules/expense-card.tsx`
- [ ] `src/domains/expenses/components/molecules/date-picker.tsx`
- [ ] `src/domains/expenses/components/molecules/search-bar.tsx`
- [ ] `src/domains/expenses/components/organisms/expense-form.tsx`
- [ ] `src/domains/expenses/components/organisms/expense-list.tsx`
- [ ] `src/domains/expenses/components/organisms/expense-filters.tsx`

### Dashboard Domain (9)
- [ ] `src/domains/dashboard/types.ts`
- [ ] `src/domains/dashboard/utils/metrics.ts`
- [ ] `src/domains/dashboard/utils/chart-data.ts`
- [ ] `src/domains/dashboard/hooks/use-dashboard-metrics.ts`
- [ ] `src/domains/dashboard/hooks/use-expense-chart.ts`
- [ ] `src/domains/dashboard/hooks/use-recent-expenses.ts`
- [ ] `src/domains/dashboard/components/molecules/metric-card.tsx`
- [ ] `src/domains/dashboard/components/organisms/dashboard-metrics.tsx`
- [ ] `src/domains/dashboard/components/organisms/expense-chart.tsx`
- [ ] `src/domains/dashboard/components/organisms/recent-expenses-list.tsx`

### Dashboard Template (1)
- [ ] `src/domains/dashboard/components/templates/dashboard-template.tsx`

### AI Chat Domain (7)
- [ ] `src/domains/ai-chat/types.ts`
- [ ] `src/domains/ai-chat/agents/layout-intelligence-agent.ts`
- [ ] `src/domains/ai-chat/hooks/use-chat.ts`
- [ ] `src/domains/ai-chat/hooks/use-layout-agent.ts`
- [ ] `src/domains/ai-chat/stores/chat-store.ts`
- [ ] `src/domains/ai-chat/components/molecules/message-bubble.tsx`
- [ ] `src/domains/ai-chat/components/organisms/chat-bubble.tsx`
- [ ] `src/domains/ai-chat/components/organisms/chat-window.tsx`

### App Pages & Layouts (6)
- [ ] `src/app/page.tsx` (update)
- [ ] `src/app/layout.tsx` (update)
- [ ] `src/app/expenses/page.tsx` (new)
- [ ] `src/app/loading.tsx` (new)
- [ ] `src/app/error.tsx` (new)
- [ ] `src/app/not-found.tsx` (new)

---

## Risks & Mitigation

### Risk 1: IndexedDB Browser Compatibility
**Mitigation**: Check for IndexedDB support, show error if unavailable
**Fallback**: Display message: "Your browser doesn't support offline storage"

### Risk 2: Hydration Mismatches
**Mitigation**: Use `ssr: false` for dynamic imports, suppressHydrationWarning
**Testing**: Verify no console errors in development

### Risk 3: Chart Library Bundle Size
**Mitigation**: Dynamic import Recharts with `ssr: false`, lazy load
**Alternative**: Use simpler chart library if Recharts too heavy

### Risk 4: Mobile Form UX
**Mitigation**: Test on real devices (not just DevTools)
**Priority**: Drawer vs Modal must work correctly at 768px breakpoint

### Risk 5: AI Agent Complexity
**Mitigation**: Start with simple rule-based parser (Stage 1-2)
**Defer**: LLM integration to Stage 3 (future)

---

## Success Metrics (From Business Analyst)

### Functional Validation
- **Target**: 100% of P0 features implemented and tested
- **Measure**: All 8 P0 features working (dashboard, form, list, delete, filters, mobile, errors)

### User Experience
- **Target**: Add expense < 30 seconds from dashboard
- **Target**: Filter by category < 5 seconds
- **Target**: Clear visual hierarchy (users understand metrics < 10 seconds)

### Performance
- **Target**: Page load < 1 second (FCP)
- **Target**: IndexedDB query < 500ms for 100 records
- **Target**: UI updates < 100ms feedback

### Accessibility
- **Target**: WCAG 2.1 Level AA compliance
- **Measure**: Keyboard navigation, screen reader support, color contrast ≥ 4.5:1

### Error Handling
- **Target**: 100% of identified error scenarios handled
- **Measure**: 8 error scenarios have recovery actions

---

## Next Steps for Parent Agent

1. **Review this consolidated roadmap** - Validate approach and priorities
2. **Begin Phase 1** - Install shadcn components and dependencies
3. **Execute sequentially** - Follow phases 1-10 in order
4. **Update session context** - Append progress after each phase
5. **Use todo list** - Track completion of each major task

---

## Agent Plan Locations

For detailed information, refer to individual agent plans:

- **Business Analysis**: `.claude/plans/business-analysis-plan.md`
- **Domain Architecture**: `.claude/plans/domain-architecture-plan.md`
- **UX/UI Design**: `.claude/plans/ux-ui-design-plan.md`
- **shadcn Components**: `.claude/plans/shadcn-component-plan.md`
- **Next.js Architecture**: `.claude/plans/nextjs-architecture-plan.md`
- **Session Context**: `.claude/tasks/context_session_expense_tracker_20251202.md`

---

**Status**: Ready for implementation
**Estimated Timeline**: 23 days (single developer, full-time)
**MVP Completion**: Phase 8 (17 days for core features)
**Full Completion**: Phase 10 (23 days with polish)
