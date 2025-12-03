# PROJECT.md: Personal Expense Tracker with AI-Driven Layout Intelligence

## Product Overview

**Expense Tracker AI** is a personal expense management web application that combines traditional expense tracking with AI-driven UI customization capabilities. The application operates entirely offline-first using IndexedDB as the persistence layer and features an intelligent layout adaptation system powered by a specialized AI agent.

The core concept is simple: users manage their personal finances through an intuitive dashboard, expenses list, and form interface, while having the ability to customize their dashboard layout dynamically through conversational AI commands.

### Key Differentiators

- **Offline-First Architecture**: Full functionality without internet connectivity using IndexedDB
- **AI-Driven UI Customization**: Users can modify dashboard layouts through natural language commands
- **Mobile-First Design**: Responsive design optimized for mobile and desktop experiences
- **Zero Authentication**: Single-user application focused on personal use
- **Real-Time Layout Adaptation**: Future capability for AI to directly modify UI structure based on user preferences

---

## Features and Functionality

### 1. Dashboard Page (Homepage)

**Purpose**: Provide at-a-glance financial insights and quick access to recent activity.

**Core Components**:

1. **Dynamic Metrics Panel** (4 key metrics)
   - Total spent this month (sum of all expenses in current calendar month)
   - Average daily spending for the month (total ÷ days elapsed in month)
   - Top spending category (category with highest total amount)
   - Transaction count for the month (number of expense records)

2. **Expense Visualization Chart**
   - Displays expenses grouped by day OR by category
   - Visual representation (bar chart, line chart, or pie chart)
   - Interactive and responsive

3. **Recent Expenses List**
   - Shows the 5-10 most recent expense entries
   - Displays: description, amount, category, date
   - Quick preview without navigating to full list

4. **Navigation Controls**
   - Clear call-to-action to view full Expenses page
   - Add new expense button (opens form modal/drawer)

**AI Customization Capabilities** (Stage 1 & 2):
- Users can request layout modifications via floating chat
- AI agent provides suggestions for layout changes
- Examples: "Move metrics to the left", "Make chart larger", "Create two-column layout", "Highlight top category"

**Future Enhancement** (Stage 3):
- AI agent can directly modify dashboard layout based on user context
- Dynamic section rearrangement
- Personalized widget organization based on spending patterns

---

### 2. Expenses Page

**Purpose**: Comprehensive view of all expense records with robust filtering, searching, and pagination.

**Core Features**:

1. **Data Loading**
   - Loads from IndexedDB on page mount
   - Initial display: First 20 records
   - Loading state during data fetch
   - Error state if IndexedDB access fails

2. **Default Filters** (Applied on Load)
   - Date range: Current calendar year only (January 1 - December 31)
   - Sort order: Date descending (newest first)

3. **Filtering Options**
   - **Category Filter**: Dropdown/multi-select to filter by category
     - Options: Comida, Transporte, Entretenimiento, Salud, Compras, Servicios, Otros
     - Supports "All Categories" option
   - **Date Range Filter**: Date picker for custom start/end dates
   - **Description Search**: Text input with real-time search across description field

4. **Expense Card Display**
   - Each card shows:
     - Description (string)
     - Amount (formatted currency)
     - Category (badge/chip with visual distinction)
     - Date (formatted date string)
   - Cards are clickable for edit functionality

5. **Pagination**
   - Initial load: 20 records
   - Load more functionality (infinite scroll or "Load More" button)
   - Performance optimization for large datasets

6. **Actions**
   - Click expense card to edit (opens Expense Form in edit mode)
   - Delete expense (with confirmation dialog)

**UI States**:
- Loading: Skeleton cards or spinner
- Empty state: No expenses match filters
- Error state: IndexedDB access failure

---

### 3. Expense Form (Modal/Drawer)

**Purpose**: Create new expenses or edit existing ones with comprehensive validation.

**Form Fields**:

1. **Description** (required)
   - Type: Text input
   - Validation: Non-empty string, min 3 characters
   - Max length: 200 characters
   - Error: "Description is required and must be at least 3 characters"

2. **Amount** (required)
   - Type: Number input
   - Validation: Positive numeric value, greater than 0
   - Format: Decimal up to 2 places
   - Error: "Amount must be a positive number"

3. **Category** (required)
   - Type: Select dropdown
   - Options:
     - Comida (Food)
     - Transporte (Transportation)
     - Entretenimiento (Entertainment)
     - Salud (Health)
     - Compras (Shopping)
     - Servicios (Services)
     - Otros (Other)
   - Validation: Must be one of predefined categories
   - Error: "Please select a valid category"

4. **Date** (required)
   - Type: Date picker
   - Validation: Valid date, not in the future
   - Default: Today's date
   - Error: "Please select a valid date"

**Form Technology**:
- Implemented using **React Hook Form**
- Validation managed through **Zod schema**
- Real-time validation on blur
- Submit validation before persistence

**Form Modes**:
1. **Create Mode**: Empty form, all fields blank except date (default to today)
2. **Edit Mode**: Pre-filled with existing expense data

**Form Actions**:
- **Save**: Validate → Persist to IndexedDB → Close form → Update UI
- **Cancel**: Close form without saving (with unsaved changes warning)
- **Delete** (Edit mode only): Delete expense → Close form → Update UI

**UI Behavior**:
- Opens as modal (desktop) or drawer (mobile)
- Accessible via keyboard navigation
- Focus management on open/close
- Loading state during save operation
- Error state if save fails

---

### 4. AI-Driven Layout Intelligence System

**Purpose**: Enable dynamic UI customization through natural language interaction.

#### 4.1 Floating Chat Interface

**Visual Design**:
- **Chat Bubble**: Fixed position, bottom-right corner (z-index high)
  - Icon: Chat/message icon with notification badge (if AI has suggestions)
  - Size: 60x60px (mobile), 70x70px (desktop)
  - Animation: Subtle pulse effect
  - Color: Accent color from design system

- **Chat Window**: Opens on bubble click
  - Position: Bottom-right, above bubble
  - Size: 350x500px (desktop), 100vw x 60vh (mobile)
  - Header: "Layout Assistant" with minimize/close buttons
  - Body: Scrollable message history
  - Footer: Message input with send button

**Behavior**:
- Persistent across all views (Dashboard, Expenses page)
- Maintains conversation state during session
- Auto-scrolls to latest message
- Typing indicators when AI is processing
- Error handling for failed AI requests

**User Interaction Flow**:
1. User clicks chat bubble → Chat window opens
2. User types layout modification request
3. AI agent processes request and responds with suggestions
4. User can apply suggestions (future) or continue conversation

#### 4.2 Layout Intelligence Agent

**Role**: Specialized AI agent responsible for understanding layout modification requests and generating structured change instructions.

**Capabilities** (Stage 1 & 2 - Current):
- Parse natural language layout requests
- Understand dashboard structure and components
- Generate suggested layout modifications
- Return structured configuration outputs (JSON/object format)
- Examples of understood commands:
  - "Move the metrics panel to the left side"
  - "Make the expense chart bigger"
  - "Create a two-column layout with metrics on the left"
  - "Highlight categories with higher spending"
  - "Show only the top 3 categories in the chart"
  - "Resize the recent expenses list to show 10 items"

**Constraints** (Current Stage):
- Agent provides suggestions only (does not execute changes)
- No direct modification of IndexedDB data
- No access to underlying business logic or expense data
- Focused solely on UI/layout configuration

**Response Format**:
```json
{
  "suggestion": "I can help you create a two-column layout with metrics on the left and the chart on the right.",
  "layoutConfig": {
    "dashboardLayout": "two-column",
    "metricsPanel": {
      "position": "left",
      "width": "40%"
    },
    "chartPanel": {
      "position": "right",
      "width": "60%"
    }
  },
  "previewAvailable": false
}
```

**Future Enhancement** (Stage 3):
- Direct access to application data context (read-only)
- Ability to execute layout changes automatically
- Context-aware suggestions based on spending patterns
- Persistent layout configurations per user preferences
- Theme-level modifications (colors, spacing, typography)
- Organizational changes (add/remove/rearrange dashboard sections)

**Integration Architecture**:
```
User Input (Chat)
  → Layout Intelligence Agent (AI Processing)
    → Structured Output (JSON Config)
      → UI Layer (Renders suggestion)
        → [Future] Layout Engine (Applies changes)
```

---

## User Roles and Permissions

### Single User Model

**User Type**: Offline-First Personal User

**Capabilities**:
- ✅ Create expenses (unlimited)
- ✅ Read all expense records
- ✅ Update any expense
- ✅ Delete any expense
- ✅ View dashboard metrics and charts
- ✅ Filter, search, and sort expenses
- ✅ Interact with AI chat interface
- ✅ Request layout suggestions from AI agent
- ✅ [Future] Apply AI-generated layout changes

**Restrictions**:
- ❌ No authentication required
- ❌ No multi-user support
- ❌ No user accounts or login system
- ❌ No data sharing between devices (offline-first, local storage only)
- ❌ No cloud sync or backup

**Data Ownership**:
- All data stored locally in browser's IndexedDB
- User has full control over their data
- No external data transmission
- Data persists until manually cleared or browser storage is wiped

---

## Data Models

### 1. Expense Entity

**Primary Data Structure**

```typescript
interface Expense {
  id: string;                    // UUID v4, auto-generated
  description: string;           // Min 3 chars, max 200 chars
  amount: number;                // Positive decimal, 2 decimal places
  category: ExpenseCategory;     // Enum from predefined categories
  date: Date;                    // ISO 8601 date string
  createdAt: Date;               // Timestamp, auto-generated
  updatedAt: Date;               // Timestamp, auto-updated
}

type ExpenseCategory =
  | 'Comida'
  | 'Transporte'
  | 'Entretenimiento'
  | 'Salud'
  | 'Compras'
  | 'Servicios'
  | 'Otros';
```

**IndexedDB Schema**:
```javascript
const expenseStore = {
  name: 'expenses',
  keyPath: 'id',
  indexes: [
    { name: 'date', keyPath: 'date', unique: false },
    { name: 'category', keyPath: 'category', unique: false },
    { name: 'amount', keyPath: 'amount', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false }
  ]
};
```

**Validation Rules** (Zod Schema):
```typescript
const expenseSchema = z.object({
  description: z.string()
    .min(3, 'Description must be at least 3 characters')
    .max(200, 'Description cannot exceed 200 characters'),
  amount: z.number()
    .positive('Amount must be greater than 0')
    .multipleOf(0.01, 'Amount must have at most 2 decimal places'),
  category: z.enum([
    'Comida',
    'Transporte',
    'Entretenimiento',
    'Salud',
    'Compras',
    'Servicios',
    'Otros'
  ]),
  date: z.date()
    .max(new Date(), 'Date cannot be in the future')
});
```

---

### 2. Dashboard Metrics (Derived Data)

**Not stored in IndexedDB - calculated on-the-fly from expenses**

```typescript
interface DashboardMetrics {
  totalSpentThisMonth: number;       // Sum of all expenses in current month
  averageDailySpending: number;      // totalSpent ÷ days elapsed in month
  topCategory: {
    name: ExpenseCategory;
    amount: number;
  };
  transactionCount: number;          // Count of expenses in current month
}
```

**Calculation Logic**:
- Query expenses where `date >= firstDayOfCurrentMonth AND date <= lastDayOfCurrentMonth`
- Aggregate by category to find top spender
- Calculate totals and averages

---

### 3. Layout Configuration (Future Stage 3)

**Persistent layout preferences**

```typescript
interface LayoutConfig {
  id: string;                        // Always 'default' for single user
  dashboardLayout: 'single-column' | 'two-column' | 'grid';
  metricsPanel: {
    position: 'top' | 'left' | 'right';
    width: string;                   // CSS width value
    order: number;                   // Flex order
  };
  chartPanel: {
    position: 'top' | 'left' | 'right';
    width: string;
    height: string;
    chartType: 'bar' | 'line' | 'pie';
    groupBy: 'day' | 'category';
  };
  recentExpensesPanel: {
    visible: boolean;
    itemCount: number;               // Number of recent items to show
    order: number;
  };
  updatedAt: Date;
}
```

**Note**: This entity is for future Stage 3 implementation. Currently not used.

---

### 4. Chat Message (Session Storage - Not Persisted)

**AI chat conversation history**

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  layoutConfig?: object;             // Attached config if AI provides suggestion
}
```

**Storage**: Session-only (React state), not persisted to IndexedDB

---

## Business Rules

### Expense Management Rules

1. **Creation**
   - All fields (description, amount, category, date) are mandatory
   - Description must be at least 3 characters
   - Amount must be positive (> 0)
   - Category must be one of 7 predefined values
   - Date cannot be in the future
   - ID is auto-generated (UUID v4)
   - createdAt and updatedAt are auto-generated timestamps

2. **Update**
   - Only description, amount, category, and date can be modified
   - ID, createdAt cannot be changed
   - updatedAt is automatically updated to current timestamp
   - Same validation rules as creation apply

3. **Deletion**
   - Soft delete not required (hard delete from IndexedDB)
   - Requires user confirmation via dialog
   - UI updates immediately after successful deletion
   - Error handling if deletion fails

4. **Read/Query**
   - Default filter: Current year only
   - Default sort: Date descending (newest first)
   - Pagination: Initial 20 records
   - Subsequent loads: 20 records per page
   - Search is case-insensitive on description field
   - Multiple filters can be combined (AND logic)

---

### Dashboard Metrics Rules

1. **Time Window**
   - All metrics calculated for current calendar month only
   - Month starts on the 1st, ends on last day of month
   - Metrics update in real-time when expenses change

2. **Total Spent This Month**
   - Sum of `amount` field for all expenses in current month
   - Formatted as currency with 2 decimal places
   - Shows $0.00 if no expenses this month

3. **Average Daily Spending**
   - Formula: `totalSpentThisMonth ÷ daysElapsedInMonth`
   - Days elapsed = current day of month (e.g., if today is 15th, days = 15)
   - Formatted as currency with 2 decimal places
   - Shows $0.00 on the 1st of the month

4. **Top Category**
   - Group expenses by category, sum amounts
   - Category with highest total wins
   - If tie, pick first alphabetically
   - Shows "None" if no expenses this month

5. **Transaction Count**
   - Count of expense records in current month
   - Displayed as integer (e.g., "23 transactions")

---

### Filtering and Sorting Rules

1. **Category Filter**
   - Multi-select supported (show expenses matching ANY selected category)
   - "All Categories" = no filter applied
   - Applied in addition to date filter

2. **Date Range Filter**
   - Inclusive of start and end dates
   - If only start date provided, filter >= start date
   - If only end date provided, filter <= end date
   - If neither, default to current year

3. **Description Search**
   - Case-insensitive substring match
   - Searches entire description field
   - Debounced to avoid excessive re-renders (300ms)
   - Applied in addition to other filters

4. **Sort Order**
   - Default: Date descending (newest first)
   - Additional options (future):
     - Date ascending
     - Amount descending
     - Amount ascending
     - Description alphabetical

---

### Validation Rules (Comprehensive)

**Description Field**:
- ✅ Required
- ✅ Min length: 3 characters
- ✅ Max length: 200 characters
- ✅ Cannot be only whitespace
- ❌ Cannot be empty
- ❌ Cannot contain only numbers (suggested, not enforced)

**Amount Field**:
- ✅ Required
- ✅ Must be numeric
- ✅ Must be positive (> 0)
- ✅ Max 2 decimal places
- ✅ Max value: 999,999,999.99 (to prevent overflow)
- ❌ Cannot be 0
- ❌ Cannot be negative
- ❌ Cannot be NaN or Infinity

**Category Field**:
- ✅ Required
- ✅ Must be one of: Comida, Transporte, Entretenimiento, Salud, Compras, Servicios, Otros
- ❌ Cannot be custom/arbitrary string
- ❌ Cannot be empty

**Date Field**:
- ✅ Required
- ✅ Must be valid ISO 8601 date
- ✅ Must be today or earlier
- ❌ Cannot be in the future
- ❌ Cannot be before year 1900 (reasonable constraint)

---

### Data Persistence Rules

1. **CRUD Operations**
   - All operations persist immediately to IndexedDB
   - No server-side sync
   - No undo/redo (consider for future)

2. **UI Update Flow**
   - Create: Add to IndexedDB → Update UI with new record
   - Read: Query IndexedDB → Render to UI
   - Update: Modify in IndexedDB → Update UI with changed record
   - Delete: Remove from IndexedDB → Remove from UI

3. **Error Handling**
   - If IndexedDB write fails, show error toast
   - If IndexedDB read fails, show error state in UI
   - Retry logic for transient failures (up to 3 retries)
   - Graceful degradation if IndexedDB not available

4. **Loading States**
   - Show skeleton/spinner during data fetch
   - Disable form submit button while saving
   - Show loading overlay during delete operation

---

### AI Agent Rules (Current Stage)

1. **Chat Interaction**
   - AI can only provide suggestions, not execute changes
   - Responses are informational and educational
   - No access to actual expense data
   - No modification of IndexedDB

2. **Layout Suggestions**
   - Must return structured JSON configuration
   - Suggestions must be feasible within UI framework
   - Cannot suggest impossible layouts
   - Must respect mobile responsiveness

3. **Context Awareness** (Future Stage 3)
   - Will have read-only access to dashboard metrics
   - Can suggest layouts based on spending patterns
   - Can personalize based on user behavior
   - Still cannot modify expense data directly

---

## Technical Architecture

### Technology Stack

**Frontend Framework**:
- Next.js 15 (App Router)
- React 19
- TypeScript (strict mode)

**UI Libraries**:
- shadcn/ui (component library foundation)
- TailwindCSS v4 (styling)
- Radix UI (accessible primitives)

**Form Management**:
- React Hook Form
- Zod (schema validation)
- @hookform/resolvers/zod

**State Management**:
- Zustand (UI state, chat state)
- React Query / TanStack Query (future consideration for complex state)

**Data Persistence**:
- IndexedDB (via idb library or native API)
- No backend/server required

**AI Integration**:
- Layout Intelligence Agent (custom implementation)
- Chat interface (custom component)
- Future: LLM API integration for natural language processing

**Component Architecture**:
- Atomic Design methodology
  - Atoms: Button, Input, Badge, Icon
  - Molecules: FormField, ExpenseCard, MetricCard
  - Organisms: ExpenseForm, ExpenseList, DashboardMetrics
  - Templates: DashboardTemplate, ExpensesTemplate
  - Pages: Dashboard (page.tsx), Expenses (page.tsx)

---

### File Structure (High-Level)

```
src/
├── app/                           # Next.js App Router
│   ├── page.tsx                  # Dashboard page
│   ├── expenses/
│   │   └── page.tsx              # Expenses list page
│   └── layout.tsx                # Root layout
│
├── domains/                       # Business logic by domain
│   ├── expenses/
│   │   ├── components/           # Expense-specific components
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   └── organisms/
│   │   ├── hooks/                # useExpenses, useExpenseForm
│   │   ├── stores/               # Zustand stores (if needed)
│   │   ├── actions.ts            # CRUD operations (IndexedDB)
│   │   ├── schema.ts             # Zod validation schemas
│   │   └── types.ts              # TypeScript types
│   │
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/                # useDashboardMetrics
│   │   ├── utils/                # Metric calculation functions
│   │   └── types.ts
│   │
│   └── ai-chat/
│       ├── components/           # Chat bubble, chat window
│       ├── agents/               # Layout Intelligence Agent
│       ├── hooks/                # useChat, useLayoutAgent
│       ├── stores/               # Chat state (Zustand)
│       └── types.ts
│
├── components/                    # Reusable UI components
│   ├── ui/                       # shadcn/ui components
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   └── layout/
│
├── lib/                           # Infrastructure
│   ├── db.ts                     # IndexedDB client
│   └── utils.ts
│
├── config/
│   ├── site.ts                   # App metadata
│   └── categories.ts             # Expense categories constant
│
└── styles/
    └── main.css                  # Global styles, Tailwind imports
```

---

### IndexedDB Architecture

**Database Name**: `expense-tracker-db`

**Version**: 1

**Object Stores**:

1. **expenses**
   - Key path: `id`
   - Indexes:
     - `date` (for date range queries)
     - `category` (for category filtering)
     - `createdAt` (for sorting)
   - Auto-increment: No (UUIDs)

**CRUD Operations**:

```typescript
// Create
async function createExpense(expense: Expense): Promise<Expense> {
  const db = await openDB('expense-tracker-db', 1);
  const tx = db.transaction('expenses', 'readwrite');
  await tx.store.add(expense);
  await tx.done;
  return expense;
}

// Read All (with filters)
async function getExpenses(filters: ExpenseFilters): Promise<Expense[]> {
  const db = await openDB('expense-tracker-db', 1);
  let expenses = await db.getAll('expenses');
  // Apply filters (date range, category, description search)
  return applyFilters(expenses, filters);
}

// Update
async function updateExpense(id: string, updates: Partial<Expense>): Promise<Expense> {
  const db = await openDB('expense-tracker-db', 1);
  const tx = db.transaction('expenses', 'readwrite');
  const expense = await tx.store.get(id);
  const updated = { ...expense, ...updates, updatedAt: new Date() };
  await tx.store.put(updated);
  await tx.done;
  return updated;
}

// Delete
async function deleteExpense(id: string): Promise<void> {
  const db = await openDB('expense-tracker-db', 1);
  const tx = db.transaction('expenses', 'readwrite');
  await tx.store.delete(id);
  await tx.done;
}
```

---

### Atomic Design Implementation

**Atoms** (domains/expenses/components/atoms/):
- `expense-amount.tsx` - Formatted currency display
- `expense-category-badge.tsx` - Category chip/badge
- `expense-date.tsx` - Formatted date display

**Molecules** (domains/expenses/components/molecules/):
- `expense-card.tsx` - Single expense display card
- `expense-form-field.tsx` - Form input with label + error
- `metric-card.tsx` - Dashboard metric display

**Organisms** (domains/expenses/components/organisms/):
- `expense-form.tsx` - Complete form (modal/drawer)
- `expense-list.tsx` - List of expense cards with filters
- `dashboard-metrics.tsx` - All 4 metrics panel
- `expense-chart.tsx` - Chart visualization

**Templates** (domains/dashboard/components/templates/):
- `dashboard-template.tsx` - Dashboard page layout structure

**Pages** (app/):
- `app/page.tsx` - Dashboard page (composes template)
- `app/expenses/page.tsx` - Expenses list page

---

### State Management Strategy

**Zustand Stores** (Client/UI State):

1. **Expense Filters Store** (`domains/expenses/stores/expense-filters-store.ts`)
   ```typescript
   interface ExpenseFiltersStore {
     categoryFilter: ExpenseCategory[];
     dateRange: { start: Date | null; end: Date | null };
     searchQuery: string;
     setCategoryFilter: (categories: ExpenseCategory[]) => void;
     setDateRange: (range: { start: Date | null; end: Date | null }) => void;
     setSearchQuery: (query: string) => void;
     resetFilters: () => void;
   }
   ```

2. **Chat Store** (`domains/ai-chat/stores/chat-store.ts`)
   ```typescript
   interface ChatStore {
     messages: ChatMessage[];
     isOpen: boolean;
     isTyping: boolean;
     addMessage: (message: ChatMessage) => void;
     toggleChat: () => void;
     setTyping: (typing: boolean) => void;
   }
   ```

**Custom Hooks** (Business Logic):

1. `useExpenses()` - Fetch and manage expense data from IndexedDB
2. `useDashboardMetrics()` - Calculate dashboard metrics
3. `useExpenseForm()` - Form submission logic
4. `useLayoutAgent()` - AI agent interaction

---

## Development Phases

### Phase 1: Core Foundation (Current - Stage 1)
- ✅ Set up Next.js 15 + React 19 + TypeScript project
- ✅ Configure TailwindCSS v4 + shadcn/ui
- ✅ Create base file structure (Atomic Design + Screaming Architecture)
- ✅ Set up IndexedDB schema and CRUD utilities
- ✅ Implement Expense entity with Zod schema

### Phase 2: Expense Management (Current - Stage 1)
- ⏳ Create Expense Form (modal/drawer)
  - Form fields with React Hook Form
  - Zod validation integration
  - Create/Edit modes
  - IndexedDB persistence
- ⏳ Build Expenses List page
  - Expense cards display
  - Category filtering
  - Date range filtering
  - Description search
  - Pagination (20 items)
  - Loading and error states

### Phase 3: Dashboard (Current - Stage 1)
- ⏳ Implement Dashboard Metrics
  - Total spent calculation
  - Average daily spending
  - Top category logic
  - Transaction count
- ⏳ Build Expense Chart
  - Visualization library integration (Chart.js or Recharts)
  - Group by day/category toggle
- ⏳ Create Recent Expenses component
- ⏳ Dashboard layout composition

### Phase 4: AI Chat Interface (Current - Stage 2)
- ⏳ Build floating chat bubble component
- ⏳ Create chat window UI
  - Message history
  - Input field
  - Send functionality
- ⏳ Implement chat state management (Zustand)
- ⏳ Session-based message persistence (React state only)

### Phase 5: Layout Intelligence Agent (Current - Stage 2)
- ⏳ Design agent prompt templates
- ⏳ Implement natural language parsing for layout commands
- ⏳ Create structured output format (JSON config)
- ⏳ Build agent response generation logic
- ⏳ Integrate agent with chat interface
- ⏳ Display layout suggestions in chat

### Phase 6: Polish and Optimization (Stage 2 Completion)
- ⏳ Mobile responsiveness refinement
- ⏳ Accessibility improvements (ARIA labels, keyboard nav)
- ⏳ Error handling edge cases
- ⏳ Performance optimization (lazy loading, code splitting)
- ⏳ User feedback mechanisms (toasts, confirmations)

### Phase 7: AI-Driven Layout Execution (Future - Stage 3)
- ❌ Layout configuration persistence in IndexedDB
- ❌ AI agent read access to expense data context
- ❌ Automatic layout modification engine
- ❌ Layout preview system
- ❌ Theme customization capabilities
- ❌ Persistent user preferences

---

## Success Criteria

**Functional Requirements**:
- ✅ Users can create, read, update, delete expenses
- ✅ Dashboard displays accurate metrics for current month
- ✅ Expenses page filters and searches work correctly
- ✅ Expense form validates all fields per Zod schema
- ✅ All data persists to IndexedDB offline
- ✅ Floating chat interface is accessible and functional
- ✅ AI agent responds with layout suggestions

**Non-Functional Requirements**:
- ✅ Application works offline (no network required)
- ✅ Mobile-first responsive design
- ✅ Loading states shown during async operations
- ✅ Error states handled gracefully
- ✅ Accessible to keyboard navigation and screen readers
- ✅ Fast performance (< 100ms UI updates)

**User Experience Goals**:
- ✅ Intuitive expense entry flow (< 30 seconds to add expense)
- ✅ Clear visual hierarchy on dashboard
- ✅ Effortless filtering and searching
- ✅ Conversational AI interaction feels natural
- ✅ Layout suggestions are relevant and helpful

---

## Related Documentation

- `.claude/knowledge/critical-constraints.md` - Non-negotiable architectural rules
- `.claude/knowledge/architecture-patterns.md` - Architecture and layer definitions
- `.claude/knowledge/file-structure.md` - File naming and organization conventions
- `.claude/agents/domain-architect.md` - Domain business logic planning agent
- `.claude/agents/ux-ui-designer.md` - UX/UI design and architecture agent
- `.claude/agents/shadcn-builder.md` - shadcn/ui component selection agent
- `.claude/agents/nextjs-builder.md` - Next.js 15 architecture planning agent

---

## AI Agent Invocation Guide

When building this project, the following agents should be invoked:

1. **Business Analyst Agent** (`.claude/agents/business-analyst.md`)
   - Refine user stories for each feature
   - Clarify edge cases and business rules
   - Define acceptance criteria

2. **Domain Architect Agent** (`.claude/agents/domain-architect.md`)
   - Plan expense management domain structure
   - Design dashboard domain logic
   - Structure AI chat domain
   - Define data models and schemas

3. **UX/UI Designer Agent** (`.claude/agents/ux-ui-designer.md`)
   - Design dashboard layout
   - Plan expense card visual hierarchy
   - Design chat interface UX
   - Create responsive breakpoints strategy

4. **shadcn Builder Agent** (`.claude/agents/shadcn-builder.md`)
   - Select appropriate shadcn/ui components
   - Plan component composition
   - Identify missing custom components

5. **Next.js Builder Agent** (`.claude/agents/nextjs-builder.md`)
   - Architect App Router structure
   - Plan Server vs Client Component strategy
   - Design page layouts and nested routes

6. **Code Reviewer Agent** (`.claude/agents/code-reviewer.md`)
   - Review implementation against critical constraints
   - Validate Atomic Design adherence
   - Check IndexedDB usage patterns
   - Verify Zod schema correctness

---

## Changelog

### Version 1.0 (Current - Stage 1 & 2)
- Initial PROJECT.md creation
- Defined core expense management features
- Documented AI chat interface requirements
- Specified Layout Intelligence Agent (suggestion-only mode)
- Outlined IndexedDB architecture
- Established business rules and validation

### Future Version 2.0 (Stage 3 - Planned)
- AI agent execution capabilities (layout modifications)
- Layout configuration persistence
- Context-aware AI suggestions
- Theme customization system
- Enhanced dashboard modularity

---

**Last Updated**: 2025-12-02
**Project Status**: Stage 1 & 2 (Development)
**Target Completion**: Stage 2 - TBD
