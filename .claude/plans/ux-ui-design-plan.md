# Expense Tracker AI - UX/UI Design Plan

**Created**: 2025-12-02
**Session**: session_expense_tracker_20251202
**Complexity**: High
**User Impact**: Critical

## 1. User Context

### User Goals
- **Primary Goal**: Track personal expenses effortlessly and gain insights into spending habits
- **Secondary Goals**:
  - Quickly add new expenses on-the-go (mobile-first)
  - Filter and search past expenses easily
  - Customize dashboard layout to personal preferences via AI chat
- **Success Criteria**:
  - User can add an expense in under 30 seconds
  - Dashboard provides instant financial overview (current month)
  - Filtering/searching feels instantaneous
  - AI chat provides helpful layout suggestions

### User Personas
- **Primary**: Individual managing personal finances
- **Context**: Daily expense tracking on mobile device, weekly review on desktop
- **Pain Points**:
  - Forgetting to log expenses (needs quick access)
  - Difficulty understanding spending patterns (needs visual insights)
  - Generic dashboards that don't match personal priorities (needs customization)

### User Journey

**Daily Expense Logging (Mobile)**:
1. Open app → Dashboard loads with current month metrics
2. Tap floating "Add Expense" button → Form opens (drawer on mobile)
3. Fill: "Lunch at cafe" → $12.50 → Category: Comida → Date: Today (default)
4. Tap Save → Form closes → Dashboard updates with new expense
5. See updated total spent and avg daily spending

**Weekly Review (Desktop)**:
1. Navigate to Dashboard → See month overview with chart and metrics
2. Click "View All Expenses" → Expenses page with filters
3. Select date range (last 7 days) → Filter by category (Comida)
4. Review expense cards → Click card to edit if needed
5. Return to Dashboard → Open AI chat → "Can you make the chart bigger?"
6. AI provides layout suggestion → User considers customization

**AI Layout Customization**:
1. Click floating chat bubble (bottom-right) → Chat window opens
2. Type: "Move metrics to the left side and make chart bigger"
3. AI responds with layout suggestion and structured config
4. User reviews suggestion → [Future] Apply changes

## 2. Interface Architecture

### Information Hierarchy

**Dashboard Page**:
1. **Primary**: Dashboard Metrics Panel (4 metrics - most important insights)
2. **Secondary**: Expense Chart (visual spending pattern)
3. **Tertiary**: Recent Expenses List (quick glance at latest activity)
4. **Actions**: Add Expense button (primary CTA), View All Expenses (secondary CTA)

**Expenses Page**:
1. **Primary**: Expense Cards (the data users came to see)
2. **Secondary**: Filter Controls (category, date range, search)
3. **Tertiary**: Pagination/Load More (utility)
4. **Actions**: Add Expense button (always accessible)

**Expense Form**:
1. **Primary**: Form Fields (description, amount, category, date)
2. **Secondary**: Validation Errors (feedback)
3. **Actions**: Save (primary), Cancel (secondary), Delete (destructive, edit mode only)

### Layout Strategy

**Dashboard Page**:
- **Structure**: Full page with persistent header, main content area, floating chat
- **Grid**:
  - Mobile: Single column, stacked sections
  - Tablet: 2-column grid (metrics + chart, recent expenses full-width)
  - Desktop: Flexible grid (default: metrics top, chart/recent expenses side-by-side)
- **Spacing**: Comfortable (24px gaps between sections)
- **Breakpoints**:
  - Mobile (< 640px): Vertical stack, full-width cards, 16px padding
  - Tablet (640px - 1024px): 2-column, 24px padding
  - Desktop (> 1024px): 3-column option, 32px padding, max-width 1440px

**Expenses Page**:
- **Structure**: Header with filters, scrollable card grid, pagination footer
- **Grid**:
  - Mobile: Single column cards
  - Tablet: 2-column card grid
  - Desktop: 3-column card grid
- **Spacing**: Compact (16px gaps in filter bar, 20px gaps in card grid)
- **Breakpoints**:
  - Mobile (< 640px): Stacked filters (accordion or expandable), single-column cards
  - Tablet (640px - 1024px): Inline filters, 2-column cards
  - Desktop (> 1024px): Inline filters with search, 3-column cards

**Expense Form**:
- **Structure**: Modal (desktop 600px width) / Drawer (mobile full-screen)
- **Grid**: Single column form layout
- **Spacing**: Normal (20px between fields)

### Visual Hierarchy

**Dashboard Metrics Panel**:
- **Focal Point**: Total Spent This Month (largest number, bold, primary color)
- **Visual Flow**: Left-to-right (desktop), top-to-bottom (mobile)
- **Grouping**: 4 metric cards in grid (2x2 mobile, 4x1 or 2x2 desktop)
- **Contrast**: Numbers are large and bold, labels are small and muted

**Expense Chart**:
- **Focal Point**: Chart visualization (bar/line/pie)
- **Visual Flow**: Title → Chart → Legend (if needed)
- **Grouping**: Chart wrapper with title and controls (group by toggle)
- **Contrast**: Chart uses semantic colors from design system

**Expense Card**:
- **Focal Point**: Amount (right-aligned, bold, large)
- **Visual Flow**: Description (left) → Category badge → Amount (right) → Date (bottom)
- **Grouping**: All info in single card with subtle border
- **Contrast**: Category badge uses color coding, amount emphasized with size/weight

## 3. Interaction Design

### Primary Actions

**Add Expense Button (Floating Action Button)**:
- **Type**: Primary
- **Location**: Fixed bottom-right (mobile: bottom-center), z-index above content
- **State**:
  - Default: Accent color (primary), "+" icon or "Add" text
  - Hover: Slightly darker, subtle scale (1.05x)
  - Active: Pressed state, scale (0.95x)
  - Disabled: N/A (always enabled)
- **Feedback**: Opens Expense Form modal/drawer with slide-in animation

**Save Button (Expense Form)**:
- **Type**: Primary
- **Location**: Modal footer (right side), drawer footer (full-width)
- **State**:
  - Default: Primary color, "Save" text
  - Hover: Slightly darker
  - Active: Pressed state
  - Loading: Disabled with spinner icon, "Saving..." text
  - Disabled: Gray, not clickable (when form invalid)
- **Feedback**: Form closes, toast notification "Expense saved successfully", dashboard updates

### Secondary Actions

**View All Expenses (Dashboard)**:
- **Type**: Secondary (text link or ghost button)
- **Location**: Below Recent Expenses section
- **State**: Default → Hover (underline or subtle background)
- **Feedback**: Navigate to /expenses page

**Cancel Button (Expense Form)**:
- **Type**: Tertiary (ghost or outline)
- **Location**: Modal footer (left side), drawer footer (above Save)
- **State**: Default → Hover → Active
- **Feedback**: Close form, show unsaved changes warning if form is dirty

**Delete Button (Expense Form - Edit Mode)**:
- **Type**: Destructive (red accent)
- **Location**: Modal footer (far left), drawer footer (separate from Save/Cancel)
- **State**: Default → Hover → Active
- **Feedback**: Confirmation dialog → Delete → Close form → Toast "Expense deleted"

**Filter Controls (Expenses Page)**:
- **Type**: Secondary (dropdowns, date pickers, search input)
- **Location**: Top of Expenses page, horizontal bar (desktop) or stacked (mobile)
- **State**: Default → Focus → Active (selected)
- **Feedback**: Real-time filtering of expense list, loading state during filter

### Micro-interactions

**Hover Effects**:
- Expense cards: Subtle shadow elevation (2px → 6px), border color change
- Buttons: Background darkens 10%, scale 1.02x (optional)
- Links: Underline appears with fade-in animation
- Chat bubble: Pulse animation on new message/suggestion

**Focus States**:
- Inputs: Ring (2px solid, accent color), border color change
- Buttons: Ring (2px solid, accent color offset)
- Cards: Ring (2px solid) when keyboard-focused
- Skip to main content link for accessibility

**Loading States**:
- Dashboard metrics: Skeleton cards (animated pulse)
- Expense chart: Skeleton chart placeholder
- Expense list: Skeleton cards (3-5 placeholder cards)
- Form submit: Button disabled with spinner icon
- AI chat: Typing indicator (3 bouncing dots)

**Transitions**:
- Page navigation: Fade (200ms ease-in-out)
- Modal open/close: Fade + scale (300ms ease-out)
- Drawer open/close: Slide from bottom (300ms ease-out)
- Chat window: Slide from bottom-right (250ms ease-out)
- Filter results: Fade-in (150ms)
- Toast notifications: Slide-in from top (300ms), auto-dismiss after 5s

**Success/Error Feedback**:
- Success: Toast notification (green accent), checkmark icon, auto-dismiss
- Error: Toast notification (red accent), error icon, manual dismiss
- Form validation error: Inline error message below field (red text), icon
- System error: Error state component (full-page or section)

### User Input

**Description Field (Expense Form)**:
- **Input Type**: Text input (single line)
- **Validation**: Real-time on blur
- **Error Messages**:
  - "Description is required"
  - "Description must be at least 3 characters"
  - "Description cannot exceed 200 characters"
- **Placeholder**: "e.g., Lunch at cafe"
- **Helper**: Character count (bottom-right, muted) "0/200"

**Amount Field (Expense Form)**:
- **Input Type**: Number input with currency formatting
- **Validation**: Real-time on blur
- **Error Messages**:
  - "Amount is required"
  - "Amount must be greater than 0"
  - "Amount must be a valid number"
- **Placeholder**: "0.00"
- **Helper**: Currency symbol prefix "$" (localized)

**Category Field (Expense Form)**:
- **Input Type**: Select dropdown (native or custom)
- **Validation**: On change
- **Error Messages**: "Please select a category"
- **Placeholder**: "Select a category"
- **Helper**: None (options are self-explanatory)

**Date Field (Expense Form)**:
- **Input Type**: Date picker (calendar UI)
- **Validation**: On change
- **Error Messages**:
  - "Please select a valid date"
  - "Date cannot be in the future"
- **Placeholder**: "MM/DD/YYYY"
- **Helper**: Defaults to today's date

**Search Input (Expenses Page)**:
- **Input Type**: Text input with search icon
- **Validation**: None (debounced search, 300ms)
- **Error Messages**: None
- **Placeholder**: "Search expenses..."
- **Helper**: Search icon (left), clear button (right, appears when input has value)

## 4. Component Selection

### shadcn/ui Components Needed

- **Button**: Primary action button, secondary buttons, ghost buttons (Add Expense, Save, Cancel, Delete)
- **Input**: Text input for description, number input for amount, search input (Expense Form, Expenses Page)
- **Select**: Category dropdown with predefined options (Expense Form, Expenses Page filter)
- **Calendar / Date Picker**: Date selection for expense date and date range filter (Expense Form, Expenses Page)
- **Card**: Metric cards, expense cards, chart container (Dashboard, Expenses Page)
- **Dialog**: Expense Form modal (desktop), confirmation dialogs (Edit/Delete)
- **Drawer**: Expense Form drawer (mobile alternative to modal)
- **Badge**: Category badges for visual distinction (Expense Cards)
- **Skeleton**: Loading placeholders for async data (Dashboard, Expenses Page)
- **Toast / Sonner**: Success/error notifications (global feedback)
- **Tooltip**: Additional context on hover (optional, for icons or labels)
- **Form Components** (from shadcn): FormField, FormItem, FormLabel, FormControl, FormMessage (Expense Form)
- **ScrollArea**: Scrollable content areas (Chat window message history)
- **Separator**: Visual dividers (Dashboard sections, form sections)

**Note**: Coordinate with shadcn-builder agent for exact component selection and installation commands.

### Custom Components Needed

- **ChatBubble**: Floating chat bubble (bottom-right, fixed position) - Custom because shadcn doesn't have chat UI
- **ChatWindow**: Expandable chat interface (message history + input) - Custom implementation
- **ExpenseChart**: Chart visualization using Recharts or Chart.js - Custom wrapper around charting library
- **MetricsPanel**: 4-card grid with metric displays - Custom organism composed of Card atoms
- **ExpenseCardList**: Grid of expense cards with filtering logic - Custom organism
- **EmptyState**: Friendly empty state UI (no expenses, no results) - Custom molecule
- **ErrorState**: Error display with retry action - Custom molecule

## 5. Content Strategy

### Text Requirements

**Text Map**: `domains/expenses/expenses.text-map.ts`

**Keys to Define**:

**Headings**:
- dashboard.title: "Dashboard"
- dashboard.metricsTitle: "This Month's Overview"
- dashboard.chartTitle: "Spending Breakdown"
- dashboard.recentExpensesTitle: "Recent Expenses"
- expenses.title: "All Expenses"
- expenseForm.createTitle: "Add New Expense"
- expenseForm.editTitle: "Edit Expense"

**Body**:
- dashboard.emptyState: "No expenses yet this month. Start tracking your spending!"
- expenses.emptyState: "No expenses found. Try adjusting your filters or add your first expense."
- expenses.noResults: "No expenses match your search. Try different filters."

**Actions**:
- common.add: "Add Expense"
- common.save: "Save"
- common.cancel: "Cancel"
- common.delete: "Delete"
- common.edit: "Edit"
- expenses.viewAll: "View All Expenses"
- expenses.loadMore: "Load More"
- expenses.filter: "Filter"
- expenses.search: "Search expenses..."

**Feedback**:
- success.expenseCreated: "Expense saved successfully!"
- success.expenseUpdated: "Expense updated successfully!"
- success.expenseDeleted: "Expense deleted successfully!"
- error.expenseCreateFailed: "Failed to save expense. Please try again."
- error.expenseLoadFailed: "Failed to load expenses. Please refresh the page."
- warning.unsavedChanges: "You have unsaved changes. Are you sure you want to close?"
- confirm.deleteExpense: "Are you sure you want to delete this expense? This action cannot be undone."

**Placeholders**:
- expenseForm.descriptionPlaceholder: "e.g., Lunch at cafe"
- expenseForm.amountPlaceholder: "0.00"
- expenseForm.categoryPlaceholder: "Select a category"
- expenseForm.datePlaceholder: "MM/DD/YYYY"
- expenses.searchPlaceholder: "Search by description..."

**Help Text**:
- expenseForm.descriptionHelp: "Brief description of the expense"
- expenseForm.amountHelp: "Amount in dollars"
- expenseForm.categoryHelp: "Select the category that best fits this expense"
- dashboard.metrics.totalSpent: "Total Spent This Month"
- dashboard.metrics.avgDaily: "Average Daily Spending"
- dashboard.metrics.topCategory: "Top Spending Category"
- dashboard.metrics.transactionCount: "Total Transactions"

**AI Chat Text Map**: `domains/ai-chat/ai-chat.text-map.ts`

**Keys to Define**:
- chat.title: "Layout Assistant"
- chat.welcomeMessage: "Hi! I can help you customize your dashboard layout. Try asking me to move sections around or resize components."
- chat.inputPlaceholder: "Ask me to customize your layout..."
- chat.sendButton: "Send"
- chat.typingIndicator: "AI is thinking..."
- chat.errorMessage: "Sorry, I couldn't process your request. Please try again."
- chat.emptyState: "Start a conversation to customize your dashboard layout."

**Tone**: Friendly, clear, encouraging
**Voice**: Active voice, 2nd person ("your expenses", "you can"), conversational for AI chat

### Microcopy

**Empty States**:
- Dashboard (no expenses this month): "Ready to start tracking? Add your first expense to see insights here."
- Expenses page (no expenses ever): "Your expense history will appear here. Add your first expense to get started!"
- Expenses page (no results from filters): "No expenses match your filters. Try adjusting your date range or category selection."
- Recent expenses (no recent items): "No recent activity. Add an expense to see it here."

**Error States**:
- IndexedDB access failed: "We're having trouble accessing your data. Please refresh the page or check your browser settings."
- Form submission failed: "Oops! We couldn't save your expense. Please try again."
- Chart failed to load: "Unable to load chart. Your data is safe, but the visualization isn't available right now."

**Success States**:
- Expense created: "Great! Your expense has been saved."
- Expense updated: "Changes saved successfully!"
- Expense deleted: "Expense removed from your records."

**Loading States**:
- Dashboard loading: "Loading your financial overview..."
- Expenses loading: "Fetching your expenses..."
- Chart loading: "Preparing your spending chart..."
- Form saving: "Saving..."

## 6. Accessibility Design

### Semantic Structure

**Landmarks**:
- `<header>`: App header with navigation (if present)
- `<nav>`: Navigation links (Dashboard, Expenses)
- `<main>`: Primary content area for each page
- `<aside>`: AI Chat interface (complementary content)
- `<footer>`: App footer with additional links (optional)

**Headings**:
- `<h1>`: Page title (Dashboard, All Expenses)
- `<h2>`: Section titles (This Month's Overview, Spending Breakdown, Recent Expenses)
- `<h3>`: Subsection titles (individual metric labels, chart legend title)
- Logical hierarchy, no skipping levels

**Lists**:
- `<ul>`: Expense card list, recent expenses list, filter options
- `<ol>`: Not used (no inherent order in expense display)
- Each expense card is a `<li>` within list

### Keyboard Navigation

**Tab Order**:
1. Skip to main content link (hidden until focused)
2. Navigation links (Dashboard, Expenses)
3. Primary actions (Add Expense button)
4. Interactive elements in order of appearance (filters, cards, pagination)
5. Floating chat bubble
6. Form fields (description → amount → category → date → save/cancel)

**Shortcuts** (Future Enhancement):
- `Ctrl/Cmd + K`: Quick add expense
- `Ctrl/Cmd + F`: Focus search on Expenses page
- `Esc`: Close modal/drawer/chat window

**Focus Management**:
- Modal opens: Focus moves to first form field (description)
- Modal closes: Focus returns to trigger button (Add Expense)
- Toast notification: Does not steal focus (aria-live)
- Chat window opens: Focus moves to input field

**Escape Hatch**:
- `Esc` key: Close modal, drawer, chat window, or dialog
- Backdrop click: Close modal (with unsaved changes warning)
- Cancel button: Always present and keyboard-accessible

### Screen Reader Experience

**ARIA Labels**:
- Add Expense button: `aria-label="Add new expense"`
- Edit expense button: `aria-label="Edit expense: {description}"`
- Delete expense button: `aria-label="Delete expense: {description}"`
- Chat bubble: `aria-label="Open layout assistant chat"`
- Filter controls: `aria-label="Filter expenses by category"`, etc.
- Close buttons: `aria-label="Close"`

**ARIA Descriptions**:
- Metric cards: `aria-describedby="metric-description"` linking to helper text
- Form fields: `aria-describedby="field-help field-error"` for help and error text
- Expense cards: `aria-label="{description}, {amount}, {category}, {date}"`

**Live Regions**:
- Toast notifications: `aria-live="polite"` (success) or `aria-live="assertive"` (error)
- Form validation errors: `aria-live="polite"` announced on blur
- Expense list updates: `aria-live="polite"` announces "X expenses found"
- Loading states: `aria-live="polite"` announces "Loading..."

**Hidden Content**:
- Visually hidden labels: `.sr-only` class for icon-only buttons
- Chart data table: Visually hidden table for screen readers (if chart is not accessible)
- Character count: `aria-label="Character count: 25 of 200"`

### Visual Accessibility

**Color Contrast**:
- Text on background: Minimum 4.5:1 (WCAG AA)
- Large text (24px+): Minimum 3:1
- Interactive elements: 3:1 contrast with surrounding
- Form error text: Red with sufficient contrast on background
- Category badges: High contrast text on colored background

**Color Independence**:
- Category distinction: Not relying solely on color (use icons or text labels)
- Chart data: Not relying solely on color (use patterns, labels, legends)
- Form validation: Error icon + text, not just red border
- Status indicators: Icon + text + color

**Text Size**:
- Body text: Minimum 16px (desktop and mobile)
- Small text (labels): Minimum 14px
- Touch targets: Minimum 44x44px (mobile)
- Buttons: Minimum 16px text, 40x40px size (mobile)

**Touch Targets**:
- Buttons: Minimum 44x44px (mobile), 40x40px (desktop)
- Cards (clickable): Full card is touch target
- Links: Minimum 44x44px including padding
- Form inputs: Minimum 44px height (mobile)

**Motion**:
- Respect `prefers-reduced-motion`: Disable animations if user preference is set
- Animations: Maximum 300ms duration
- No auto-playing animations or carousels
- Loading spinners: Slow, gentle rotation

## 7. Responsive Design

### Mobile (< 640px)

**Layout**:
- Single column, vertical stack
- Full-width cards and sections
- 16px horizontal padding
- 20px vertical spacing between sections

**Navigation**:
- Top navigation bar (sticky or static)
- Dashboard / Expenses links (horizontal tabs or buttons)
- No hamburger menu (only 2 pages)

**Actions**:
- Add Expense: Floating button (bottom-center or bottom-right)
- Full-width buttons in forms
- Large touch targets (minimum 44x44px)

**Content**:
- Metrics: 2x2 grid
- Chart: Full-width, reduced height (250px)
- Recent expenses: 5 items max, full-width cards
- Expense cards: Full-width, stacked vertically
- Filters: Accordion or expandable section (collapsed by default)

**Specific Adjustments**:
- Modal → Drawer (full-screen from bottom)
- Chat window: Full-screen overlay
- Font sizes: Slightly larger for readability
- Tables: Converted to card layout (if any tables exist)

### Tablet (640px - 1024px)

**Layout**:
- 2-column grid for most sections
- 24px padding
- 24px gaps between sections

**Navigation**:
- Horizontal navigation bar (persistent)
- Dashboard / Expenses links visible
- Add Expense button (top-right or floating)

**Actions**:
- Inline buttons (not full-width)
- Add Expense: Floating button (bottom-right) or header button

**Content**:
- Metrics: 4x1 grid (horizontal) or 2x2 grid
- Chart: 60% width, recent expenses 40% width (side-by-side)
- Expense cards: 2-column grid
- Filters: Inline, horizontal bar

**Specific Adjustments**:
- Modal: 600px width, centered
- Chat window: 350x500px, bottom-right
- Font sizes: Standard (16px body)

### Desktop (> 1024px)

**Layout**:
- Multi-column grid (flexible: 2-column, 3-column, custom)
- 32px padding
- 32px gaps between sections
- Max-width: 1440px (centered)

**Navigation**:
- Horizontal navigation bar (persistent)
- Dashboard / Expenses links visible
- Add Expense button (top-right and/or floating)

**Actions**:
- Inline buttons with hover effects
- Add Expense: Header button + optional floating button

**Content**:
- Metrics: 4x1 grid (horizontal) or 2x2 grid (customizable via AI)
- Chart: Large (60-70% width), recent expenses sidebar (30-40%)
- Expense cards: 3-column grid
- Filters: Inline, horizontal bar with search

**Additional Features**:
- Hover effects on all interactive elements
- Tooltips on metric cards (optional)
- Larger chart visualization (400-500px height)
- More recent expenses visible (10 items)

**Layout Variations for AI Customization**:
- **Single-column**: Metrics → Chart → Recent Expenses (vertical stack)
- **Two-column**: Metrics (left 40%) + Chart/Recent (right 60%)
- **Grid**: Metrics (2x2 grid top), Chart + Recent Expenses (side-by-side below)
- **Custom**: User-defined positions via AI chat (future Stage 3)

## 8. States & Feedback

### Loading States

**Initial Load (Dashboard)**:
- Skeleton for 4 metric cards (animated pulse)
- Skeleton for chart area (gray rectangle with pulse)
- Skeleton for recent expenses (5 card skeletons)
- Duration: 500ms - 2s (depends on IndexedDB query)

**Initial Load (Expenses Page)**:
- Skeleton for filter bar (gray placeholders)
- Skeleton for 20 expense cards (grid of card skeletons)
- Duration: 500ms - 2s

**Action Feedback (Form Save)**:
- Save button: Disabled state, spinner icon, "Saving..." text
- Form overlay: Semi-transparent overlay to prevent interaction
- Duration: 300ms - 1s (IndexedDB write)

**Optimistic Updates**:
- Create expense: Add to UI immediately, rollback if fails
- Update expense: Update UI immediately, rollback if fails
- Delete expense: Remove from UI immediately, rollback if fails

### Error States

**Validation Errors (Form)**:
- Inline error message below field (red text, error icon)
- Field border turns red
- Field aria-describedby points to error message
- Error is announced by screen reader
- Appears on blur or submit attempt

**System Errors (IndexedDB)**:
- Full-page error state (if critical, e.g., DB initialization fails)
- Section error state (if partial, e.g., chart fails to load)
- Error message: Clear explanation + suggested action
- Retry button: Allows user to attempt again
- Example: "We're having trouble loading your data. [Retry] or [Refresh page]"

**Network Errors (Future - if API integration)**:
- Toast notification (red accent, error icon)
- Error message: "Unable to connect. Please check your internet."
- Retry automatically or manual retry button

**Recovery**:
- Clear error explanation (no technical jargon)
- Actionable next steps ("Refresh page", "Try again", "Check browser settings")
- Contact support option (future enhancement)

### Empty States

**No Data (Dashboard - No Expenses This Month)**:
- Icon: Large illustration (empty wallet or piggy bank)
- Message: "No expenses yet this month"
- Description: "Start tracking your spending to see insights here."
- CTA: Large "Add Your First Expense" button
- Tone: Encouraging, friendly

**No Results (Expenses Page - Filters Return Nothing)**:
- Icon: Magnifying glass illustration
- Message: "No expenses match your filters"
- Description: "Try adjusting your date range or category selection."
- CTA: "Clear Filters" button
- Alternative: Show all expenses or reset to defaults

**First Use (Expenses Page - No Expenses Ever)**:
- Icon: Onboarding illustration (chart or expense icon)
- Message: "Welcome to Expense Tracker AI!"
- Description: "Your expense history will appear here. Let's add your first expense."
- CTA: "Add Expense" button
- Optional: Brief feature tour or tips

### Success States

**Confirmation (Expense Saved)**:
- Toast notification (green accent, checkmark icon)
- Message: "Expense saved successfully!"
- Duration: 5s auto-dismiss
- Position: Top-center or top-right
- Animation: Slide-in from top

**Next Steps (After Save)**:
- Form closes automatically
- Dashboard/Expenses page updates with new data
- Optional: Subtle highlight on newly added expense card (fade-out after 2s)

**Bulk Actions (Future - Multiple Deletes)**:
- Toast: "3 expenses deleted successfully!"
- Undo button (optional, 5s window)

## 9. User Flow Diagram

**Adding an Expense (Happy Path)**:
```
[Dashboard Page]
    ↓
[User clicks "Add Expense" button]
    ↓
[Expense Form opens (Modal/Drawer)]
    ↓
[User fills fields: Description, Amount, Category, Date]
    ↓
[Form validates on blur (real-time feedback)]
    ↓
[User clicks "Save"]
    ↓
[Validation passes] → [IndexedDB write] → [Success]
    ↓
[Form closes with fade-out animation]
    ↓
[Toast: "Expense saved successfully!"]
    ↓
[Dashboard updates with new expense]
    ↓
[User sees updated metrics and recent expenses]
```

**Filtering Expenses**:
```
[Expenses Page loads with default filters]
    ↓
[User selects Category: "Comida"]
    ↓
[List updates (150ms fade)] → [Loading skeleton] → [Filtered results]
    ↓
[User types in Search: "lunch"]
    ↓
[Debounced search (300ms)] → [List updates] → [Filtered results]
    ↓
[User selects Date Range: Last 7 days]
    ↓
[List updates] → [Filtered results]
    ↓
[User clicks "Clear Filters"]
    ↓
[All filters reset] → [List shows all expenses (current year)]
```

**AI Chat Interaction**:
```
[User clicks floating chat bubble]
    ↓
[Chat window opens (slide-in animation)]
    ↓
[User types: "Make the chart bigger"]
    ↓
[User clicks "Send"]
    ↓
[Typing indicator appears (AI is thinking...)]
    ↓
[AI responds with suggestion]
    ↓
[User reviews suggestion]
    ↓
[Option A: User closes chat (future: applies suggestion)]
    ↓
[Option B: User asks follow-up question] → [AI responds]
```

**Editing an Expense**:
```
[Expenses Page]
    ↓
[User clicks expense card]
    ↓
[Expense Form opens in EDIT mode (pre-filled)]
    ↓
[User modifies Amount field]
    ↓
[Form validates on blur]
    ↓
[User clicks "Save"]
    ↓
[IndexedDB update] → [Success]
    ↓
[Form closes]
    ↓
[Toast: "Expense updated successfully!"]
    ↓
[Expenses page updates with modified card]
```

**Deleting an Expense**:
```
[Expense Form (Edit mode)]
    ↓
[User clicks "Delete" button]
    ↓
[Confirmation dialog appears]
    ↓
[Dialog: "Are you sure? This cannot be undone."]
    ↓
[User clicks "Confirm"]
    ↓
[IndexedDB delete] → [Success]
    ↓
[Dialog closes]
    ↓
[Form closes]
    ↓
[Toast: "Expense deleted successfully!"]
    ↓
[Expenses page removes deleted card (fade-out)]
```

## 10. Design Specifications

### Spacing Scale

**Tight** (Use for compact UI, dense information):
- Gap: 8px
- Padding: 12px
- Use cases: Filter bar items, form field groups

**Normal** (Default spacing):
- Gap: 16px (mobile), 20px (desktop)
- Padding: 16px (mobile), 20px (desktop)
- Use cases: Card internal padding, form field spacing

**Relaxed** (Use for breathing room):
- Gap: 24px (mobile), 32px (desktop)
- Padding: 24px (mobile), 32px (desktop)
- Use cases: Section spacing, page padding

**Page Container Padding**:
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px, max-width 1440px centered

### Typography

**Headings**:
- `<h1>`: 32px (mobile), 40px (desktop), font-weight: 700 (bold), line-height: 1.2
- `<h2>`: 24px (mobile), 28px (desktop), font-weight: 600 (semibold), line-height: 1.3
- `<h3>`: 20px, font-weight: 600 (semibold), line-height: 1.4
- `<h4>`: 18px, font-weight: 600 (semibold), line-height: 1.4

**Body**:
- Body text: 16px, font-weight: 400 (normal), line-height: 1.5
- Small text: 14px, font-weight: 400, line-height: 1.4
- Tiny text (captions): 12px, font-weight: 400, line-height: 1.3

**Labels**:
- Form labels: 14px, font-weight: 500 (medium), line-height: 1.4
- Badge labels: 12px, font-weight: 500 (medium), uppercase, letter-spacing: 0.5px
- Metric labels: 14px, font-weight: 500 (medium), text-transform: uppercase

**Emphasis**:
- Metric values: 28px (mobile), 36px (desktop), font-weight: 700 (bold)
- Amount in expense card: 18px, font-weight: 600 (semibold)
- Chart title: 18px, font-weight: 600 (semibold)

**Font Family**:
- Primary: var(--font-geist-sans) (sans-serif from globals.css)
- Monospace (for amounts): var(--font-geist-mono) (optional, for tabular numbers)

### Color Usage

**Primary** (Used for main actions, brand identity):
- Variable: `--color-primary` (oklch values from globals.css)
- Use cases: Add Expense button, Save button, links, focus rings
- Contrast: `--color-primary-foreground` for text on primary background

**Secondary** (Used for less prominent actions):
- Variable: `--color-secondary`
- Use cases: Cancel button, secondary CTAs, subtle backgrounds

**Accent** (Used for highlights and calls-to-action):
- Variable: `--color-accent`
- Use cases: Chat bubble, important metrics, hover states
- Contrast: `--color-accent-foreground`

**Semantic Colors**:
- **Success**: Green (use chart-1 or define custom success color)
  - Use cases: Success toasts, positive metrics
- **Warning**: Yellow/Orange (use chart-4 or define custom warning color)
  - Use cases: Warning messages, unsaved changes
- **Error/Destructive**: `--color-destructive` (red)
  - Use cases: Delete button, error messages, validation errors
- **Info**: Blue (use chart-2 or define custom info color)
  - Use cases: Informational messages, tips

**Neutral Colors**:
- Background: `--color-background`
- Foreground (text): `--color-foreground`
- Muted background: `--color-muted`
- Muted foreground (secondary text): `--color-muted-foreground`
- Border: `--color-border`
- Input: `--color-input`

**Category Badge Colors** (For visual distinction):
- **Comida** (Food): chart-1 (orange/red tones)
- **Transporte** (Transportation): chart-2 (blue/cyan tones)
- **Entretenimiento** (Entertainment): chart-3 (purple tones)
- **Salud** (Health): chart-4 (green/lime tones)
- **Compras** (Shopping): chart-5 (pink/magenta tones)
- **Servicios** (Services): chart-1 variant (or assign additional chart color)
- **Otros** (Other): muted gray

**Note**: Use existing chart colors from globals.css for category badges to maintain consistency.

### Border Radius

- Small: `--radius-sm` (calc(var(--radius) - 4px)) ≈ 6px
- Medium: `--radius-md` (calc(var(--radius) - 2px)) ≈ 8px
- Large: `--radius-lg` (var(--radius)) = 10px (0.625rem)
- Extra Large: `--radius-xl` (calc(var(--radius) + 4px)) ≈ 14px

**Usage**:
- Buttons: `--radius-md`
- Input fields: `--radius-md`
- Cards: `--radius-lg`
- Modals: `--radius-xl`
- Chat bubble: `--radius-xl` (circular)
- Badges: `--radius-sm` or full rounded

## 11. Performance Considerations

**Critical Path**:
- Load IndexedDB connection first (essential for all data)
- Render Dashboard layout skeleton immediately
- Fetch and render metrics data (highest priority)
- Fetch and render chart data (secondary priority)
- Fetch and render recent expenses (tertiary priority)
- Chat interface loads last (non-critical)

**Lazy Loading**:
- Chart library: Load only when chart is in viewport (React.lazy or dynamic import)
- Expense Form: Load modal/drawer components only when needed (React.lazy)
- AI Chat: Load chat components only when chat bubble is clicked (React.lazy)
- Expenses page: Load only when navigating to /expenses route

**Image Optimization**:
- No images expected in MVP (text-based UI)
- If illustrations added: Use next/image, WebP format, responsive srcset

**Animation Budget**:
- Limit simultaneous animations to 2-3 max
- Use CSS transforms (GPU-accelerated) instead of layout properties
- Avoid animating width/height (use transform: scale instead)
- Keep animation duration under 300ms for responsiveness

**IndexedDB Query Optimization**:
- Use indexes for filtering (date, category)
- Limit initial query to 20 records (pagination)
- Cache results in React state to avoid redundant queries
- Debounce search input (300ms) to reduce query frequency

## 12. Implementation Coordination

### Agent Collaboration

**shadcn-builder Agent**:
- Provide list of required shadcn/ui components (Button, Input, Select, Calendar, Card, Dialog, Drawer, Badge, Skeleton, Toast, Form components, ScrollArea, Separator)
- Request component installation commands
- Specify any custom props or variants needed
- Coordinate on component composition patterns

**domain-architect Agent**:
- Data structure for expense display (ExpenseCard props)
- Dashboard metrics calculation output format
- Filter state structure (category, date range, search)
- AI chat message format and state management

**nextjs-builder Agent**:
- Page structure: / (Dashboard), /expenses (Expenses list)
- Server vs Client Component strategy (likely mostly Client for IndexedDB)
- Loading and error boundaries for async operations
- Metadata for SEO (page titles, descriptions)

**Parent Agent**:
- Implement components in Atomic Design order:
  1. Atoms: Button, Input, Badge (from shadcn)
  2. Molecules: ExpenseCard, MetricCard, FormField wrappers
  3. Organisms: ExpenseForm, ExpenseList, DashboardMetrics, ExpenseChart
  4. Templates: DashboardTemplate, ExpensesTemplate
  5. Pages: Dashboard page, Expenses page
  6. Features: AI Chat bubble and window
- Create text map files before implementing components
- Test responsive breakpoints throughout implementation

### Files Impacted

**Components**:
- `components/ui/*`: shadcn components (installed by shadcn-builder)
- `domains/expenses/components/atoms/expense-amount.tsx`
- `domains/expenses/components/atoms/expense-category-badge.tsx`
- `domains/expenses/components/atoms/expense-date.tsx`
- `domains/expenses/components/molecules/expense-card.tsx`
- `domains/expenses/components/molecules/metric-card.tsx`
- `domains/expenses/components/organisms/expense-form.tsx`
- `domains/expenses/components/organisms/expense-list.tsx`
- `domains/dashboard/components/organisms/dashboard-metrics.tsx`
- `domains/dashboard/components/organisms/expense-chart.tsx`
- `domains/dashboard/components/templates/dashboard-template.tsx`
- `domains/ai-chat/components/molecules/chat-bubble.tsx`
- `domains/ai-chat/components/organisms/chat-window.tsx`

**Text Maps**:
- `domains/expenses/expenses.text-map.ts`
- `domains/dashboard/dashboard.text-map.ts`
- `domains/ai-chat/ai-chat.text-map.ts`

**Styles**:
- `styles/components/atoms/expense-badge.css` (if custom styles needed beyond Tailwind)
- `styles/components/molecules/expense-card.css`
- `styles/components/organisms/chat-window.css`
- All styles should use BEM naming and @apply for repeated patterns

**Pages**:
- `app/page.tsx` (Dashboard)
- `app/expenses/page.tsx` (Expenses list)
- `app/layout.tsx` (Root layout with global styles)

## 13. Important Notes

**User testing recommended**: High-impact feature (expense tracking is core functionality)
**Accessibility is mandatory**: WCAG 2.1 AA minimum, keyboard navigation essential
**Mobile-first**: Design for smallest screen first, progressively enhance for larger screens
**Content before chrome**: Prioritize expense data and metrics over decorative elements
**Iterate**: Design will evolve based on user feedback and usage patterns
**Consistency**: Follow established patterns from existing button.css and input.css files

**Offline-First Consideration**:
- No loading spinners for network requests (IndexedDB is local)
- Loading states should be brief (< 1s typically)
- Error states focus on browser/storage issues, not network errors
- No "sync" or "online/offline" indicators needed (always offline)

**AI Chat UX**:
- Keep chat interface non-intrusive (floating bubble, easy to dismiss)
- Provide clear examples of what AI can help with (onboarding message)
- Set expectations: AI provides suggestions, doesn't execute changes (Stage 1-2)
- Future: Make it clear when AI can execute layout changes (Stage 3)

**Category Color Coding**:
- Use consistent colors across badges, chart, and any category visualizations
- Ensure sufficient contrast for text on colored backgrounds
- Consider colorblind-friendly palette (avoid red/green only distinctions)
- Provide text labels in addition to color coding

**Form UX Best Practices**:
- Auto-focus first field when form opens
- Clear validation errors when user starts typing
- Show validation errors only after blur or submit attempt (not while typing)
- Default date to today (common use case)
- Remember last-used category (future enhancement)

## 14. Success Metrics

**Usability**:
- Time to add expense: Target < 30 seconds
- Filter interaction: Target < 3 seconds to see results
- Form validation clarity: Users understand errors on first attempt
- Navigation: Users can find all features without help

**Efficiency**:
- Dashboard load time: Target < 1 second
- Expenses page load time: Target < 1.5 seconds (20 records)
- Form save time: Target < 500ms
- Filter/search response time: Target < 300ms (perceived instant)

**Satisfaction**:
- User feedback: Positive comments on ease of use
- Feature usage: Users engage with all sections (metrics, chart, filters)
- AI chat usage: Users try AI chat and find it helpful
- Return usage: Users continue to track expenses consistently

**Accessibility**:
- Screen reader testing: All content accessible via screen reader
- Keyboard-only navigation: All features accessible without mouse
- Color contrast testing: All text meets WCAG AA standards
- Mobile testing: All touch targets meet 44x44px minimum

**Performance**:
- Lighthouse score: 90+ on Performance, Accessibility, Best Practices
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- IndexedDB query time: < 100ms for typical queries
- Animation frame rate: 60fps for all animations

## 15. Layout Customization Points for AI Agent

**Dashboard Layout Variations** (For AI to suggest):

**Variation 1: Single Column (Mobile-like)**:
- Metrics panel (full-width, 2x2 grid)
- Chart (full-width, reduced height)
- Recent expenses (full-width list)
- Use case: Simplicity, minimal customization

**Variation 2: Two-Column (Sidebar Left)**:
- Metrics panel (left, 35% width, vertical stack)
- Chart + Recent expenses (right, 65% width, stacked vertically)
- Use case: Emphasize metrics, glanceable overview

**Variation 3: Two-Column (Sidebar Right)**:
- Chart + Recent expenses (left, 65% width, stacked vertically)
- Metrics panel (right, 35% width, vertical stack)
- Use case: Emphasize chart, visual-first approach

**Variation 4: Grid Layout (Default)**:
- Metrics panel (top, full-width, 4x1 grid)
- Chart (bottom-left, 60% width)
- Recent expenses (bottom-right, 40% width)
- Use case: Balanced, all sections equally accessible

**Variation 5: Chart-Focused**:
- Chart (top, full-width, large height)
- Metrics panel (bottom-left, 50% width, 2x2 grid)
- Recent expenses (bottom-right, 50% width)
- Use case: Data visualization priority

**Customizable Parameters** (For AI to modify):
- Section visibility (show/hide recent expenses, chart, individual metrics)
- Section order (flex order property)
- Section width (percentage or fixed width)
- Chart height (small, medium, large)
- Recent expenses item count (5, 10, 15)
- Metrics layout (horizontal 4x1, grid 2x2, vertical 4x1)
- Chart type (bar, line, pie)
- Chart grouping (by day, by category)

**AI Chat Example Commands**:
- "Move the metrics to the left side"
- "Make the chart bigger"
- "Hide the recent expenses section"
- "Show 10 recent expenses instead of 5"
- "Create a two-column layout"
- "Switch to a pie chart"
- "Group expenses by category in the chart"

**Implementation Notes**:
- Store layout config in Zustand store (client-side, session-only for Stage 1-2)
- Use CSS Grid or Flexbox with dynamic styles based on config
- Provide smooth transitions when layout changes (300ms ease-out)
- Ensure all variations are responsive and accessible
- Future (Stage 3): Persist layout config to IndexedDB for permanent customization

---

## Design Plan Complete

This comprehensive UX/UI design plan provides detailed specifications for all user-facing interfaces, interactions, and visual design elements of the Expense Tracker AI application. The plan prioritizes accessibility, mobile-first responsive design, and user-centered interaction patterns.

**Key Design Principles Applied**:
- Clarity: Self-explanatory interface with clear labels and feedback
- Efficiency: Minimal steps to complete tasks (add expense in < 30s)
- Feedback: Immediate response to all user actions
- Consistency: Repeated patterns across the application
- Accessibility: WCAG 2.1 AA compliance, keyboard navigation, screen reader support
- Mobile-First: Designed for smallest screens, progressively enhanced

**Next Implementation Steps**:
1. Parent reviews and approves design plan
2. shadcn-builder agent selects and installs required components
3. domain-architect agent defines data structures and state management
4. Parent implements components in Atomic Design order (atoms → molecules → organisms → templates → pages)
5. Create text map files before implementing each domain
6. Test responsive breakpoints and accessibility at each stage

**Design Assets Needed** (Future):
- Empty state illustrations (SVG or PNG)
- Error state illustrations
- Category icons (optional, for badges)
- Loading animations (use CSS animations, not images)

**Collaboration Required**:
- shadcn-builder: Component installation and customization
- domain-architect: Data structure alignment
- nextjs-builder: Page structure and routing
- code-reviewer: Accessibility and design pattern validation
