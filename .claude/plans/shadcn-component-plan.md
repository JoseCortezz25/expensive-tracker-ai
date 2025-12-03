# Expense Tracker AI - shadcn/ui Component Selection Plan

**Created**: 2025-12-02
**Session**: session_expense_tracker_20251202
**Type**: shadcn Component Selection & Composition Strategy

---

## 1. shadcn/ui Components Required

### Existing Components (Already Installed)

Components currently available in `@/components/ui/`:
- `button` - Button with variants (default, destructive, outline, primary, secondary, ghost, link)
- `input` - Text input with error states
- `select` - Dropdown select with Radix UI Select primitive

### New Components to Install

**Installation Commands**:
```bash
pnpm dlx shadcn@latest add form label textarea calendar popover badge card separator skeleton alert-dialog dialog drawer toast sonner checkbox
```

**Components Breakdown**:

#### `form` + `label`
- **Purpose**: Form wrapper and field labels for expense form
- **Radix Primitive**: None (React Hook Form integration)
- **Key Props**: Form context provider, field validation
- **Accessibility**: Automatic label-input association, error announcements
- **Usage**: Expense form validation with React Hook Form + Zod

#### `textarea`
- **Purpose**: Multi-line description input (if needed for longer descriptions)
- **Radix Primitive**: None (native textarea)
- **Key Props**: rows, placeholder, aria-invalid
- **Accessibility**: Resizable, supports ARIA attributes
- **Usage**: Alternative to input for expense descriptions (optional)

#### `calendar`
- **Purpose**: Date picker for expense date selection
- **Radix Primitive**: None (uses date-fns)
- **Key Props**: selected, onSelect, mode, disabled
- **Accessibility**: Keyboard navigation, screen reader support
- **Usage**: Date selection in expense form

#### `popover`
- **Purpose**: Container for calendar date picker
- **Radix Primitive**: @radix-ui/react-popover
- **Key Props**: open, onOpenChange, trigger, content
- **Accessibility**: Focus trap, keyboard navigation, ESC to close
- **Usage**: Wraps calendar component for date picker dropdown

#### `badge`
- **Purpose**: Category indicators with color coding
- **Radix Primitive**: None (styled div)
- **Key Props**: variant (default, secondary, destructive, outline)
- **Accessibility**: Readable labels, sufficient contrast
- **Usage**: Expense category badges in cards and lists

#### `card`
- **Purpose**: Expense card container, metric cards, recent expenses
- **Radix Primitive**: None (semantic HTML with styling)
- **Key Props**: Card, CardHeader, CardTitle, CardContent, CardFooter
- **Accessibility**: Semantic structure, focusable if interactive
- **Usage**: Primary container for expenses, dashboard metrics

#### `separator`
- **Purpose**: Visual dividers between sections
- **Radix Primitive**: @radix-ui/react-separator
- **Key Props**: orientation (horizontal, vertical), decorative
- **Accessibility**: ARIA separator role
- **Usage**: Dashboard section dividers, form field groups

#### `skeleton`
- **Purpose**: Loading placeholders for async content
- **Radix Primitive**: None (animated div)
- **Key Props**: className (for sizing)
- **Accessibility**: aria-busy on parent, aria-live regions
- **Usage**: Loading states for expenses list, dashboard metrics, chart

#### `alert-dialog`
- **Purpose**: Confirmation dialogs for destructive actions
- **Radix Primitive**: @radix-ui/react-alert-dialog
- **Key Props**: AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction
- **Accessibility**: Focus trap, ESC to cancel, keyboard navigation
- **Usage**: Delete expense confirmation, unsaved changes warning

#### `dialog`
- **Purpose**: Expense form modal (desktop view)
- **Radix Primitive**: @radix-ui/react-dialog
- **Key Props**: Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle
- **Accessibility**: Focus trap, ESC to close, keyboard navigation, scroll lock
- **Usage**: Expense form on desktop screens

#### `drawer`
- **Purpose**: Expense form drawer (mobile view)
- **Radix Primitive**: vaul (Drawer primitive)
- **Key Props**: Drawer, DrawerTrigger, DrawerContent, DrawerHeader
- **Accessibility**: Touch gestures, focus management
- **Usage**: Expense form on mobile screens (bottom sheet)

#### `toast` or `sonner`
- **Purpose**: Feedback notifications for CRUD operations
- **Radix Primitive**: Sonner uses toast notifications API
- **Key Props**: toast(), toast.success(), toast.error(), toast.loading()
- **Accessibility**: ARIA live regions, auto-dismiss, keyboard dismissible
- **Recommendation**: Use `sonner` (better DX, styled by default)
- **Usage**: Success/error messages after create/update/delete operations

#### `checkbox` (Optional - for future multi-select filters)
- **Purpose**: Multi-select category filter
- **Radix Primitive**: @radix-ui/react-checkbox
- **Key Props**: checked, onCheckedChange
- **Accessibility**: Keyboard toggle, screen reader support
- **Usage**: Category filter with multiple selection (future enhancement)

---

## 2. Component Composition Strategy (Atomic Design)

### Atoms (shadcn/ui primitives + minimal custom components)

**From shadcn/ui (no composition needed)**:
- `Button` - Already installed
- `Input` - Already installed
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` - Already installed
- `Label` - To install
- `Badge` - To install
- `Skeleton` - To install
- `Separator` - To install

**Custom Atoms** (domain-specific, minimal logic):
- `ExpenseAmount` - `src/domains/expenses/components/atoms/expense-amount.tsx`
  - **Purpose**: Formatted currency display
  - **Props**: `amount: number`, `className?: string`
  - **Implementation**: Uses Intl.NumberFormat for currency formatting
  - **Example**: `<ExpenseAmount amount={125.50} />` → "$125.50"

- `ExpenseDate` - `src/domains/expenses/components/atoms/expense-date.tsx`
  - **Purpose**: Formatted date display
  - **Props**: `date: Date`, `format?: 'short' | 'long'`, `className?: string`
  - **Implementation**: Uses date-fns for formatting
  - **Example**: `<ExpenseDate date={new Date()} format="short" />` → "Dec 2, 2025"

- `CategoryBadge` - `src/domains/expenses/components/atoms/category-badge.tsx`
  - **Purpose**: Category-specific badge with color coding
  - **Composition**: Wraps shadcn `Badge` with category-specific variants
  - **Props**: `category: ExpenseCategory`
  - **Implementation**: Maps category to badge variant/color
  - **Example**: `<CategoryBadge category="Comida" />` → Green badge with "Comida"

---

### Molecules (composition of atoms + shadcn components)

#### `FormField` (from shadcn `form`)
- **Location**: Use shadcn's `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
- **Composition**: Pre-built by shadcn for React Hook Form integration
- **Usage**: Wraps Input, Select, Calendar with label + error display
- **Example**:
  ```tsx
  <FormField
    control={form.control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Input {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  ```

#### `MetricCard`
- **Location**: `src/domains/dashboard/components/molecules/metric-card.tsx`
- **Composition**: shadcn `Card` + `CardHeader` + `CardContent` + custom typography
- **Props**: `title: string`, `value: string | number`, `icon?: ReactNode`, `trend?: 'up' | 'down' | 'neutral'`
- **Purpose**: Display single dashboard metric
- **Example**: Total spent card, average daily spending card

#### `ExpenseCard`
- **Location**: `src/domains/expenses/components/molecules/expense-card.tsx`
- **Composition**: shadcn `Card` + `CategoryBadge` + `ExpenseAmount` + `ExpenseDate`
- **Props**: `expense: Expense`, `onClick?: () => void`, `onDelete?: () => void`
- **Purpose**: Display single expense with all fields
- **Accessibility**: Clickable (keyboard focusable), role="button" or semantic button
- **Structure**:
  ```tsx
  <Card className="cursor-pointer hover:shadow-md">
    <CardHeader>
      <div className="flex justify-between">
        <CardTitle>{expense.description}</CardTitle>
        <CategoryBadge category={expense.category} />
      </div>
    </CardHeader>
    <CardContent>
      <ExpenseAmount amount={expense.amount} />
      <ExpenseDate date={expense.date} />
    </CardContent>
  </Card>
  ```

#### `DatePicker`
- **Location**: `src/domains/expenses/components/molecules/date-picker.tsx`
- **Composition**: shadcn `Popover` + `Calendar` + `Button` (trigger)
- **Props**: `selected: Date | undefined`, `onSelect: (date: Date) => void`, `disabled?: boolean`
- **Purpose**: Reusable date picker for forms and filters
- **Structure**:
  ```tsx
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">
        <CalendarIcon />
        {selected ? format(selected, 'PPP') : 'Pick a date'}
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <Calendar mode="single" selected={selected} onSelect={onSelect} />
    </PopoverContent>
  </Popover>
  ```

#### `SearchBar`
- **Location**: `src/domains/expenses/components/molecules/search-bar.tsx`
- **Composition**: shadcn `Input` + search icon (lucide-react)
- **Props**: `value: string`, `onChange: (value: string) => void`, `placeholder?: string`
- **Purpose**: Debounced search input for expense list
- **Implementation**: Uses debounce hook (300ms)

#### `DateRangePicker`
- **Location**: `src/domains/expenses/components/molecules/date-range-picker.tsx`
- **Composition**: Two `DatePicker` components (start + end date)
- **Props**: `startDate: Date | null`, `endDate: Date | null`, `onStartDateChange: (date: Date) => void`, `onEndDateChange: (date: Date) => void`
- **Purpose**: Date range filter for expenses page
- **Validation**: End date must be after start date

---

### Organisms (composition of molecules + complex logic)

#### `ExpenseForm`
- **Location**: `src/domains/expenses/components/organisms/expense-form.tsx`
- **Composition**: shadcn `Form` wrapper + multiple `FormField` + `Dialog` (desktop) or `Drawer` (mobile)
- **Props**: `mode: 'create' | 'edit'`, `expense?: Expense`, `onSuccess: () => void`, `onCancel: () => void`
- **Form Fields**:
  - Description: `FormField` + `Input`
  - Amount: `FormField` + `Input` (type="number")
  - Category: `FormField` + `Select`
  - Date: `FormField` + `DatePicker`
- **Actions**:
  - Save button: Primary `Button`, disabled while submitting
  - Cancel button: Secondary `Button`
  - Delete button (edit mode only): Destructive `Button` → triggers `AlertDialog`
- **Validation**: React Hook Form + Zod schema from `domains/expenses/schema.ts`
- **Structure**:
  ```tsx
  <Dialog> {/* or <Drawer> on mobile */}
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{mode === 'create' ? 'Add Expense' : 'Edit Expense'}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField name="description" ... />
          <FormField name="amount" ... />
          <FormField name="category" ... />
          <FormField name="date" ... />
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            {mode === 'edit' && (
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            )}
          </div>
        </form>
      </Form>
    </DialogContent>
  </Dialog>
  ```

#### `ExpenseList`
- **Location**: `src/domains/expenses/components/organisms/expense-list.tsx`
- **Composition**: Multiple `ExpenseCard` + `Skeleton` (loading) + empty state
- **Props**: `expenses: Expense[]`, `isLoading: boolean`, `onExpenseClick: (expense: Expense) => void`
- **Features**:
  - Renders grid of `ExpenseCard` components
  - Loading state: Shows 20 `Skeleton` cards
  - Empty state: Custom message with `Badge` or `Alert` component
  - Pagination: "Load More" `Button` or infinite scroll (future)
- **Structure**:
  ```tsx
  {isLoading ? (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array(20).fill(null).map((_, i) => <Skeleton key={i} className="h-32" />)}
    </div>
  ) : expenses.length === 0 ? (
    <EmptyState message="No expenses found" />
  ) : (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {expenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} onClick={() => onExpenseClick(expense)} />
      ))}
    </div>
  )}
  ```

#### `DashboardMetrics`
- **Location**: `src/domains/dashboard/components/organisms/dashboard-metrics.tsx`
- **Composition**: 4 `MetricCard` components in responsive grid
- **Props**: `metrics: DashboardMetrics`, `isLoading: boolean`
- **Metrics**:
  1. Total Spent This Month
  2. Average Daily Spending
  3. Top Category
  4. Transaction Count
- **Structure**:
  ```tsx
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <MetricCard title="Total Spent" value={metrics.totalSpentThisMonth} icon={<DollarIcon />} />
    <MetricCard title="Daily Average" value={metrics.averageDailySpending} icon={<TrendingIcon />} />
    <MetricCard title="Top Category" value={metrics.topCategory.name} icon={<TagIcon />} />
    <MetricCard title="Transactions" value={metrics.transactionCount} icon={<ListIcon />} />
  </div>
  ```

#### `ExpenseChart`
- **Location**: `src/domains/dashboard/components/organisms/expense-chart.tsx`
- **Composition**: shadcn `Card` + Recharts library (recommended) + controls
- **Props**: `expenses: Expense[]`, `groupBy: 'day' | 'category'`, `onGroupByChange: (groupBy) => void`
- **Chart Library**: Recharts (recommended over Chart.js for React integration)
- **Features**:
  - Toggle between "Group by Day" and "Group by Category"
  - Responsive chart sizing
  - Loading state with `Skeleton`
- **Structure**:
  ```tsx
  <Card>
    <CardHeader>
      <CardTitle>Expense Trends</CardTitle>
      <Select value={groupBy} onValueChange={onGroupByChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">By Day</SelectItem>
          <SelectItem value="category">By Category</SelectItem>
        </SelectContent>
      </Select>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-64" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <Bar dataKey="amount" fill="#8884d8" />
            {/* ... Recharts configuration */}
          </BarChart>
        </ResponsiveContainer>
      )}
    </CardContent>
  </Card>
  ```

#### `ExpenseFilters`
- **Location**: `src/domains/expenses/components/organisms/expense-filters.tsx`
- **Composition**: `SearchBar` + `Select` (category) + `DateRangePicker` + reset `Button`
- **Props**: `filters: ExpenseFilters`, `onFiltersChange: (filters: ExpenseFilters) => void`
- **Features**:
  - Category multi-select (using `Select` or future `Checkbox` group)
  - Date range picker
  - Search input (debounced)
  - Reset filters button
- **Structure**:
  ```tsx
  <Card>
    <CardContent className="flex flex-col gap-4 md:flex-row">
      <SearchBar value={filters.searchQuery} onChange={handleSearchChange} />
      <Select value={filters.category} onValueChange={handleCategoryChange}>
        {/* Category options */}
      </Select>
      <DateRangePicker
        startDate={filters.dateRange.start}
        endDate={filters.dateRange.end}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
      />
      <Button variant="outline" onClick={handleResetFilters}>Reset</Button>
    </CardContent>
  </Card>
  ```

#### `ChatWindow`
- **Location**: `src/domains/ai-chat/components/organisms/chat-window.tsx`
- **Composition**: shadcn `Card` (or `Dialog`/`Drawer`) + message list + input + send `Button`
- **Props**: `messages: ChatMessage[]`, `onSendMessage: (message: string) => void`, `isTyping: boolean`
- **Features**:
  - Scrollable message history
  - User messages (right-aligned)
  - AI messages (left-aligned) with suggested layout configs
  - Input field with send button
  - Typing indicator
- **Structure**:
  ```tsx
  <Card className="h-[500px] flex flex-col">
    <CardHeader>
      <CardTitle>Layout Assistant</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 overflow-y-auto">
      {messages.map(msg => (
        <div key={msg.id} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
          <Card className="inline-block max-w-[80%]">
            <CardContent>{msg.content}</CardContent>
          </Card>
        </div>
      ))}
      {isTyping && <Skeleton className="h-12 w-24" />}
    </CardContent>
    <CardFooter>
      <Input placeholder="Ask about layout..." />
      <Button>Send</Button>
    </CardFooter>
  </Card>
  ```

#### `ChatBubble`
- **Location**: `src/domains/ai-chat/components/organisms/chat-bubble.tsx`
- **Composition**: Floating `Button` (fixed position) + `Badge` (notification count)
- **Props**: `onClick: () => void`, `notificationCount?: number`
- **Purpose**: Persistent chat trigger across all views
- **Position**: Fixed bottom-right corner
- **Structure**:
  ```tsx
  <Button
    className="fixed bottom-4 right-4 size-16 rounded-full shadow-lg z-50"
    variant="primary"
    onClick={onClick}
  >
    <MessageCircleIcon className="size-6" />
    {notificationCount > 0 && (
      <Badge className="absolute -top-2 -right-2">{notificationCount}</Badge>
    )}
  </Button>
  ```

---

### Templates (layout composition)

#### `DashboardTemplate`
- **Location**: `src/domains/dashboard/components/templates/dashboard-template.tsx`
- **Composition**: `DashboardMetrics` + `ExpenseChart` + recent expenses section + `ChatBubble`
- **Props**: None (fetches data via hooks)
- **Layout**: Responsive grid with sections
- **Structure**:
  ```tsx
  <div className="container mx-auto p-4 space-y-6">
    <Suspense fallback={<Skeleton className="h-32" />}>
      <DashboardMetrics />
    </Suspense>
    <Separator />
    <Suspense fallback={<Skeleton className="h-64" />}>
      <ExpenseChart />
    </Suspense>
    <Separator />
    <section>
      <h2>Recent Expenses</h2>
      <Suspense fallback={<Skeleton className="h-48" />}>
        <ExpenseList limit={5} />
      </Suspense>
    </section>
    <ChatBubble onClick={handleChatOpen} />
  </div>
  ```

#### `ExpensesTemplate`
- **Location**: `src/domains/expenses/components/templates/expenses-template.tsx`
- **Composition**: `ExpenseFilters` + `ExpenseList` + "Add Expense" `Button` + `ChatBubble`
- **Props**: None (fetches data via hooks)
- **Structure**:
  ```tsx
  <div className="container mx-auto p-4 space-y-6">
    <div className="flex justify-between items-center">
      <h1>All Expenses</h1>
      <Button onClick={handleAddExpense}>Add Expense</Button>
    </div>
    <ExpenseFilters />
    <Suspense fallback={<Skeleton className="h-96" />}>
      <ExpenseList />
    </Suspense>
    <ChatBubble onClick={handleChatOpen} />
  </div>
  ```

---

### Pages (Next.js App Router)

#### `app/page.tsx` (Dashboard Page)
- **Composition**: `DashboardTemplate`
- **Server Component**: Yes (default)
- **Data Fetching**: IndexedDB via client-side hooks (requires 'use client' for template)
- **Metadata**: Page title, description

#### `app/expenses/page.tsx` (Expenses Page)
- **Composition**: `ExpensesTemplate`
- **Server Component**: No (needs 'use client' for IndexedDB)
- **Data Fetching**: IndexedDB via client-side hooks
- **Metadata**: Page title, description

---

## 3. Missing Custom Components (Not in shadcn/ui)

### Chart Integration (Recharts)

**Why not in shadcn/ui**: Charts are domain-specific and require external libraries

**Recommendation**: Recharts
- **Installation**: `pnpm add recharts`
- **Reason**: Better React integration than Chart.js, declarative API, responsive by default
- **Components**: BarChart, LineChart, PieChart, ResponsiveContainer
- **Usage**: Inside `ExpenseChart` organism

**Alternative**: shadcn/ui has a charts component (experimental), but Recharts offers more flexibility

### Infinite Scroll / Pagination

**Why not in shadcn/ui**: Pagination logic is app-specific

**Recommendation**: "Load More" button pattern initially
- **Implementation**: Simple `Button` that loads next 20 records
- **Future Enhancement**: Use `react-infinite-scroll-component` for infinite scroll

### Chat Message Bubbles

**Why not in shadcn/ui**: Chat UIs are domain-specific

**Custom Component**: `MessageBubble`
- **Location**: `src/domains/ai-chat/components/molecules/message-bubble.tsx`
- **Composition**: shadcn `Card` + role-based styling
- **Props**: `message: ChatMessage`
- **Styling**: Different background colors for user vs AI messages

### Empty State Component

**Why not in shadcn/ui**: Empty states are contextual

**Custom Component**: `EmptyState`
- **Location**: `src/components/organisms/empty-state.tsx` (shared across domains)
- **Composition**: Icon + heading + description + optional action `Button`
- **Props**: `icon?: ReactNode`, `title: string`, `description?: string`, `action?: ReactNode`
- **Usage**: Expenses list when no results, dashboard when no data

### Category Color Coding System

**Why not in shadcn/ui**: Domain-specific business logic

**Implementation**: Category-to-color mapping
- **Location**: `src/domains/expenses/config/category-colors.ts`
- **Structure**:
  ```tsx
  export const categoryColors: Record<ExpenseCategory, string> = {
    Comida: 'bg-green-500',
    Transporte: 'bg-blue-500',
    Entretenimiento: 'bg-purple-500',
    Salud: 'bg-red-500',
    Compras: 'bg-yellow-500',
    Servicios: 'bg-indigo-500',
    Otros: 'bg-gray-500',
  };
  ```
- **Usage**: Applied to `CategoryBadge` atom

---

## 4. shadcn/ui Component Variants Needed

### Button Variants

**Already Available** (from existing button.tsx):
- `default` - Primary button (bg-primary)
- `destructive` - Delete actions (bg-destructive)
- `outline` - Secondary actions (border + bg-transparent)
- `primary` - Custom primary variant
- `secondary` - Custom secondary variant
- `ghost` - Minimal button (hover:bg-accent)
- `link` - Text link style

**Usage Mapping**:
- Save/Submit forms: `variant="default"` or `variant="primary"`
- Cancel/Reset: `variant="outline"`
- Delete: `variant="destructive"`
- Chat send: `variant="default"`
- Load more: `variant="outline"`

### Input Variants

**Already Available** (from existing input.tsx):
- Default state: Standard input
- Error state: `aria-invalid` attribute triggers error styles

**No additional variants needed** - shadcn input handles error states via `aria-invalid`

### Card Variants

**Default shadcn Card** includes:
- `Card` - Container
- `CardHeader` - Top section
- `CardTitle` - Title text
- `CardDescription` - Subtitle text
- `CardContent` - Main content
- `CardFooter` - Bottom section

**Custom Variants Needed**:
- **Interactive Card** (for ExpenseCard):
  - Add: `cursor-pointer`, `hover:shadow-md`, `focus:ring-2`, `focus:ring-ring`
  - Implementation: Extend Card with `className` prop
- **Highlighted Card** (for top category metric):
  - Add: `border-2`, `border-primary`, `bg-primary/5`
  - Implementation: Conditional className based on metric

**Implementation Strategy**: Use `className` prop on shadcn `Card`, don't modify source

### Badge Variants

**Default shadcn Badge** includes:
- `default` - Primary badge
- `secondary` - Muted badge
- `destructive` - Error/warning badge
- `outline` - Bordered badge

**Custom Category Variants**:
- Map each ExpenseCategory to a specific color
- Implementation: Create `CategoryBadge` atom that wraps `Badge` with category-specific `className`
- Example:
  ```tsx
  export function CategoryBadge({ category }: { category: ExpenseCategory }) {
    const colorClass = categoryColors[category];
    return (
      <Badge className={cn('text-white', colorClass)}>
        {category}
      </Badge>
    );
  }
  ```

### Select Variants

**Already Available** (from existing select.tsx):
- `size="default"` - Standard select
- `size="sm"` - Small select

**No additional variants needed** - Use `size` prop for responsive sizing

### Calendar Variants

**Default shadcn Calendar** supports:
- Single date selection (`mode="single"`)
- Date range selection (`mode="range"`)
- Disabled dates (`disabled` prop)

**No custom variants needed** - Use props for configuration

---

## 5. Component Installation Plan

### Phase 1: Core Form Components
**Priority**: High (required for expense form)

```bash
pnpm dlx shadcn@latest add form label calendar popover
```

**Verification**:
- [ ] `form.tsx` exists in `@/components/ui/`
- [ ] `label.tsx` exists in `@/components/ui/`
- [ ] `calendar.tsx` exists in `@/components/ui/`
- [ ] `popover.tsx` exists in `@/components/ui/`
- [ ] Can import and use in ExpenseForm

### Phase 2: Display Components
**Priority**: High (required for dashboard and expenses list)

```bash
pnpm dlx shadcn@latest add card badge separator skeleton
```

**Verification**:
- [ ] `card.tsx` exists in `@/components/ui/`
- [ ] `badge.tsx` exists in `@/components/ui/`
- [ ] `separator.tsx` exists in `@/components/ui/`
- [ ] `skeleton.tsx` exists in `@/components/ui/`
- [ ] Can build MetricCard and ExpenseCard molecules

### Phase 3: Modal/Dialog Components
**Priority**: Medium (required for expense form display)

```bash
pnpm dlx shadcn@latest add dialog drawer alert-dialog
```

**Verification**:
- [ ] `dialog.tsx` exists in `@/components/ui/`
- [ ] `drawer.tsx` exists in `@/components/ui/`
- [ ] `alert-dialog.tsx` exists in `@/components/ui/`
- [ ] ExpenseForm can render in Dialog (desktop) and Drawer (mobile)

### Phase 4: Feedback Components
**Priority**: Medium (required for user feedback)

```bash
pnpm dlx shadcn@latest add sonner
```

**Verification**:
- [ ] `sonner.tsx` exists in `@/components/ui/`
- [ ] Toast notifications work for CRUD operations
- [ ] Can use `toast.success()`, `toast.error()`, `toast.loading()`

### Phase 5: Optional Components
**Priority**: Low (future enhancements)

```bash
pnpm dlx shadcn@latest add checkbox textarea
```

**Verification**:
- [ ] `checkbox.tsx` exists in `@/components/ui/`
- [ ] `textarea.tsx` exists in `@/components/ui/`
- [ ] Available for future multi-select category filter

---

## 6. Chart Library Recommendation

### Recharts (Recommended)

**Installation**:
```bash
pnpm add recharts
```

**Why Recharts**:
- Declarative React API (no imperative canvas manipulation)
- Responsive by default with `ResponsiveContainer`
- Built-in accessibility features
- TypeScript support
- Smaller bundle size than Chart.js for React apps
- Active maintenance and community support

**Alternative**: Chart.js + react-chartjs-2
- More chart types and plugins
- Larger ecosystem
- Higher learning curve for React integration

**Recommendation**: Start with Recharts for simplicity, migrate to Chart.js only if specific chart types are needed

**Example Usage**:
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Bar dataKey="amount" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>
```

---

## 7. Integration Notes

### Responsive Strategy (Mobile-First)

**Breakpoints** (Tailwind default):
- `sm`: 640px (small tablets)
- `md`: 768px (tablets)
- `lg`: 1024px (desktops)
- `xl`: 1280px (large desktops)

**Component Responsive Behavior**:

#### ExpenseForm
- Mobile (< 768px): `Drawer` component (bottom sheet)
- Desktop (>= 768px): `Dialog` component (centered modal)
- Implementation: Conditional rendering based on screen size
  ```tsx
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? <Drawer>...</Drawer> : <Dialog>...</Dialog>;
  ```

#### ExpenseList
- Mobile: 1 column grid
- Tablet: 2 column grid (`md:grid-cols-2`)
- Desktop: 3 column grid (`lg:grid-cols-3`)

#### DashboardMetrics
- Mobile: 1 column grid (stacked)
- Tablet: 2 column grid (`md:grid-cols-2`)
- Desktop: 4 column grid (`lg:grid-cols-4`)

#### ChatWindow
- Mobile: Full screen overlay (100vw x 60vh)
- Desktop: Fixed size (350x500px) in bottom-right corner

### Form Validation Integration

**React Hook Form + Zod**:

1. Install dependencies (if not already):
   ```bash
   pnpm add react-hook-form @hookform/resolvers zod
   ```

2. Create Zod schema in `domains/expenses/schema.ts`:
   ```tsx
   import { z } from 'zod';

   export const expenseSchema = z.object({
     description: z.string().min(3, 'Description must be at least 3 characters').max(200),
     amount: z.number().positive('Amount must be greater than 0').multipleOf(0.01),
     category: z.enum(['Comida', 'Transporte', 'Entretenimiento', 'Salud', 'Compras', 'Servicios', 'Otros']),
     date: z.date().max(new Date(), 'Date cannot be in the future'),
   });

   export type ExpenseFormData = z.infer<typeof expenseSchema>;
   ```

3. Use in ExpenseForm:
   ```tsx
   import { useForm } from 'react-hook-form';
   import { zodResolver } from '@hookform/resolvers/zod';
   import { expenseSchema, type ExpenseFormData } from '../schema';

   const form = useForm<ExpenseFormData>({
     resolver: zodResolver(expenseSchema),
     defaultValues: {
       description: expense?.description || '',
       amount: expense?.amount || 0,
       category: expense?.category || 'Otros',
       date: expense?.date || new Date(),
     },
   });
   ```

4. shadcn `Form` component provides automatic error display via `FormMessage`

### Toast Notification Pattern

**Using Sonner**:

1. Add `Toaster` to root layout:
   ```tsx
   // app/layout.tsx
   import { Toaster } from '@/components/ui/sonner';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Toaster />
         </body>
       </html>
     );
   }
   ```

2. Use in CRUD operations:
   ```tsx
   import { toast } from 'sonner';

   const handleCreateExpense = async (data: ExpenseFormData) => {
     try {
       toast.loading('Creating expense...');
       await createExpense(data);
       toast.success('Expense created successfully');
     } catch (error) {
       toast.error('Failed to create expense');
     }
   };
   ```

### Accessibility Checklist

**Forms**:
- [ ] All inputs have associated `Label` components
- [ ] Error messages use `FormMessage` (ARIA live regions)
- [ ] Required fields marked with `aria-required`
- [ ] Form submission disabled while loading
- [ ] Focus management on modal open/close

**Lists**:
- [ ] ExpenseCard clickable elements use semantic `button` or `role="button"`
- [ ] Keyboard navigation (Tab, Enter, Space)
- [ ] Focus indicators visible (outline)
- [ ] Loading states announce via `aria-busy` or `aria-live`

**Dialogs**:
- [ ] Focus trapped when open
- [ ] ESC key closes dialog
- [ ] Return focus to trigger on close
- [ ] Scrolling locked on body when open

**Charts**:
- [ ] Include `aria-label` describing chart content
- [ ] Provide table alternative for screen readers (data table below chart)
- [ ] Color contrast sufficient (WCAG AA)

---

## 8. Component Dependency Tree

```
Pages (Next.js App Router)
├── app/page.tsx (Dashboard)
│   └── DashboardTemplate
│       ├── DashboardMetrics (organism)
│       │   └── MetricCard (molecule) × 4
│       │       └── Card (shadcn)
│       ├── ExpenseChart (organism)
│       │   ├── Card (shadcn)
│       │   ├── Select (shadcn)
│       │   └── Recharts (BarChart/PieChart)
│       ├── Recent Expenses Section
│       │   └── ExpenseList (organism, limited to 5)
│       │       └── ExpenseCard (molecule) × 5
│       │           ├── Card (shadcn)
│       │           ├── CategoryBadge (atom)
│       │           │   └── Badge (shadcn)
│       │           ├── ExpenseAmount (atom)
│       │           └── ExpenseDate (atom)
│       └── ChatBubble (organism)
│           ├── Button (shadcn)
│           └── Badge (shadcn)
│
└── app/expenses/page.tsx (Expenses Page)
    └── ExpensesTemplate
        ├── ExpenseFilters (organism)
        │   ├── Card (shadcn)
        │   ├── SearchBar (molecule)
        │   │   └── Input (shadcn)
        │   ├── Select (shadcn) - Category filter
        │   ├── DateRangePicker (molecule)
        │   │   └── DatePicker (molecule) × 2
        │   │       ├── Popover (shadcn)
        │   │       ├── Calendar (shadcn)
        │   │       └── Button (shadcn)
        │   └── Button (shadcn) - Reset
        ├── ExpenseList (organism)
        │   ├── ExpenseCard (molecule) × N
        │   ├── Skeleton (shadcn) × 20 (loading state)
        │   └── EmptyState (custom)
        ├── ExpenseForm (organism) - Modal/Drawer
        │   ├── Dialog (shadcn) OR Drawer (shadcn)
        │   ├── Form (shadcn)
        │   ├── FormField (shadcn) × 4
        │   │   ├── FormLabel (shadcn)
        │   │   ├── FormControl (shadcn)
        │   │   │   ├── Input (shadcn) - description, amount
        │   │   │   ├── Select (shadcn) - category
        │   │   │   └── DatePicker (molecule) - date
        │   │   └── FormMessage (shadcn)
        │   ├── Button (shadcn) × 3 (Save, Cancel, Delete)
        │   └── AlertDialog (shadcn) - Delete confirmation
        └── ChatBubble (organism)

Shared Across Pages
├── ChatWindow (organism) - Opened by ChatBubble
│   ├── Card (shadcn) OR Dialog (shadcn)
│   ├── MessageBubble (molecule) × N
│   │   └── Card (shadcn)
│   ├── Input (shadcn)
│   └── Button (shadcn)
└── Toaster (sonner) - Global toast notifications
```

---

## 9. Installation Verification Checklist

After running all installation commands, verify:

### shadcn/ui Components Installed
- [ ] `form.tsx`
- [ ] `label.tsx`
- [ ] `calendar.tsx`
- [ ] `popover.tsx`
- [ ] `card.tsx`
- [ ] `badge.tsx`
- [ ] `separator.tsx`
- [ ] `skeleton.tsx`
- [ ] `dialog.tsx`
- [ ] `drawer.tsx`
- [ ] `alert-dialog.tsx`
- [ ] `sonner.tsx`
- [ ] `checkbox.tsx` (optional)
- [ ] `textarea.tsx` (optional)

### Dependencies Installed
- [ ] `react-hook-form`
- [ ] `@hookform/resolvers`
- [ ] `zod`
- [ ] `recharts`
- [ ] `date-fns` (usually installed with calendar)
- [ ] `lucide-react` (icons, usually installed with shadcn)

### TypeScript Types Available
- [ ] Can import shadcn components without type errors
- [ ] Form types from React Hook Form work
- [ ] Zod schema types infer correctly

### Imports Work
```tsx
// Test imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader } from '@/components/ui/drawer';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
```

---

## 10. Important Notes for Parent Agent

### NEVER Modify shadcn Source Files
- All components in `@/components/ui/` are immutable
- Extend through composition, not modification
- Use `className` prop for additional styling
- Create wrapper components in domain folders if needed

### Composition Strategy
- Build custom atoms/molecules/organisms in domain folders
- Wrap shadcn components, don't edit them
- Use CVA (class-variance-authority) for custom variants in parent components
- Example: `CategoryBadge` wraps `Badge`, doesn't modify badge.tsx

### Coordinate with UX Designer
- This plan covers component selection only
- UX designer will handle:
  - Full component architecture
  - Text maps and i18n
  - Accessibility audit
  - Visual design tokens
  - Layout specifications

### Testing Strategy (Not in This Plan)
- Parent agent handles test planning
- Ensure shadcn components are accessible (they are by default)
- Test form validation with React Hook Form
- Test responsive breakpoints
- Test keyboard navigation

### Offline-First Consideration
- shadcn components work fully client-side
- No server-side dependencies
- All components compatible with IndexedDB architecture
- Use 'use client' directive where needed (forms, dialogs, interactive components)

---

## 11. Next Steps for Parent Agent

### Step 1: Install shadcn Components
Run installation commands in order (Phase 1 → Phase 5)

### Step 2: Install External Dependencies
```bash
pnpm add recharts date-fns react-hook-form @hookform/resolvers zod
```

### Step 3: Verify Installation
Check all components exist in `@/components/ui/`

### Step 4: Create Custom Atoms
Build domain-specific atoms:
- `ExpenseAmount`
- `ExpenseDate`
- `CategoryBadge`
- Category color mapping config

### Step 5: Build Molecules
Compose atoms with shadcn components:
- `MetricCard`
- `ExpenseCard`
- `DatePicker`
- `SearchBar`
- `DateRangePicker`
- `MessageBubble`

### Step 6: Build Organisms
Compose molecules into complex components:
- `ExpenseForm`
- `ExpenseList`
- `DashboardMetrics`
- `ExpenseChart`
- `ExpenseFilters`
- `ChatWindow`
- `ChatBubble`

### Step 7: Build Templates
Compose organisms into page layouts:
- `DashboardTemplate`
- `ExpensesTemplate`

### Step 8: Implement Pages
Use templates in Next.js App Router pages:
- `app/page.tsx` (Dashboard)
- `app/expenses/page.tsx` (Expenses)

### Step 9: Add Global Components
- Add `Toaster` to root layout
- Set up global toast configuration

### Step 10: Test Responsive Behavior
- Test all breakpoints
- Verify Dialog/Drawer switching
- Check grid layouts

---

## 12. Component Props Reference

### ExpenseCard
```tsx
interface ExpenseCardProps {
  expense: Expense;
  onClick?: () => void;
  onDelete?: () => void;
  className?: string;
}
```

### MetricCard
```tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}
```

### DatePicker
```tsx
interface DatePickerProps {
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}
```

### ExpenseForm
```tsx
interface ExpenseFormProps {
  mode: 'create' | 'edit';
  expense?: Expense;
  onSuccess: () => void;
  onCancel: () => void;
  trigger?: ReactNode; // Dialog/Drawer trigger
}
```

### ExpenseFilters
```tsx
interface ExpenseFiltersProps {
  filters: ExpenseFilters;
  onFiltersChange: (filters: ExpenseFilters) => void;
}

interface ExpenseFilters {
  categoryFilter: ExpenseCategory[];
  dateRange: { start: Date | null; end: Date | null };
  searchQuery: string;
}
```

### ChatWindow
```tsx
interface ChatWindowProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  isOpen: boolean;
  onClose: () => void;
}
```

---

## 13. shadcn/ui Accessibility Features (Built-in)

### Automatic Features from Radix Primitives
- **Dialog/Drawer**: Focus trap, ESC to close, scroll lock, return focus on close
- **Select**: Keyboard navigation (Arrow keys, Enter, ESC), screen reader announcements
- **Popover**: Focus management, ESC to close, click outside to close
- **Calendar**: Keyboard navigation (Arrow keys, Page Up/Down), date announcements
- **AlertDialog**: Focus trap, requires explicit action, keyboard navigation
- **Form**: ARIA live regions for errors, aria-invalid on inputs, label association

### What Parent Agent Needs to Add
- Descriptive labels for all form fields
- Helper text for complex inputs
- Error messages (automatic via FormMessage)
- Loading states (use Skeleton + aria-busy)
- Focus indicators (automatic via Tailwind focus-visible)
- Keyboard shortcuts for common actions (optional)

---

## Summary

This plan provides a complete shadcn/ui component selection and composition strategy for the Expense Tracker AI application. All components are selected from the shadcn/ui registry or composed from shadcn primitives, following Atomic Design principles and the project's Screaming Architecture.

**Key Takeaways**:
1. Install 14 shadcn components (9 required, 5 optional)
2. Use Recharts for chart visualization
3. Build 3 custom atoms (ExpenseAmount, ExpenseDate, CategoryBadge)
4. Compose 6 molecules from atoms + shadcn components
5. Build 7 organisms from molecules
6. Create 2 templates for pages
7. All components are accessible by default (Radix UI primitives)
8. NEVER modify shadcn source files - extend through composition
9. Coordinate with UX designer for full component architecture

**Installation Priority**:
1. Core form components (form, label, calendar, popover)
2. Display components (card, badge, separator, skeleton)
3. Modal components (dialog, drawer, alert-dialog)
4. Feedback components (sonner)
5. Optional components (checkbox, textarea)

Parent agent should proceed with installation, then coordinate with UX designer for full implementation.
