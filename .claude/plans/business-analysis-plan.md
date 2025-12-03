# Business Analysis Plan: Expense Tracker AI

**Session ID**: session_expense_tracker_20251202
**Created**: 2025-12-02
**Agent**: Business Analyst
**Status**: Plan Ready for Execution

---

## Executive Summary

This plan provides a comprehensive business analysis for the Expense Tracker AI application, refining user stories, establishing acceptance criteria, identifying edge cases, clarifying business rules, and defining success metrics. The analysis covers five main feature areas: Dashboard, Expenses Page, Expense Form, AI Chat Interface, and Layout Intelligence Agent.

**Key Focus Areas**:
- User story refinement with clear acceptance criteria
- Edge case identification (empty states, error scenarios, boundary conditions)
- Business rule clarifications for validation and calculations
- Mobile vs desktop experience differences
- Success metrics aligned with functional and non-functional requirements

---

## 1. User Stories Refinement

### 1.1 Dashboard Feature

#### US-D1: View Monthly Spending Metrics

**As a** personal expense tracker user
**I want to** see my key spending metrics for the current month at a glance
**So that** I can quickly understand my financial status without digging through detailed records

**Acceptance Criteria**:
- [ ] Dashboard displays exactly 4 metric cards: Total Spent, Average Daily Spending, Top Category, Transaction Count
- [ ] Total Spent shows sum of all expenses for current calendar month (Jan 1 - Dec 31 if December)
- [ ] Total Spent formatted as currency with 2 decimal places (e.g., $1,234.56)
- [ ] Average Daily Spending calculated as: totalSpent ÷ current day of month
- [ ] Average Daily Spending shows $0.00 on the 1st of any month (division by 1 still shows total)
- [ ] Top Category displays category name with highest total amount for current month
- [ ] If two categories tie, display first alphabetically (Comida before Transporte)
- [ ] Top Category shows "None" if zero expenses exist for current month
- [ ] Transaction Count displays integer count of expense records for current month
- [ ] All metrics update in real-time when expense is created, edited, or deleted
- [ ] Metrics display loading skeleton on initial page load
- [ ] Metrics handle month transitions correctly (Jan 1 shows only Jan 1 data, not previous month)

**Priority**: P0 - Critical (Core MVP feature)

**Estimated Effort**: Medium

---

#### US-D2: Visualize Expense Trends

**As a** personal expense tracker user
**I want to** see a visual chart of my expenses grouped by day or category
**So that** I can identify spending patterns and trends at a glance

**Acceptance Criteria**:
- [ ] Chart displays below metrics panel on dashboard
- [ ] Chart supports two grouping modes: "By Day" and "By Category"
- [ ] Default grouping mode is "By Day"
- [ ] Toggle control allows switching between grouping modes
- [ ] "By Day" shows expenses summed per calendar day for current month
- [ ] "By Category" shows expenses summed per category for current month
- [ ] Chart type is bar chart (vertical bars)
- [ ] X-axis labeled appropriately (dates for "By Day", category names for "By Category")
- [ ] Y-axis shows amount in currency format
- [ ] Chart displays "No data to display" message if zero expenses exist
- [ ] Chart updates in real-time when expenses change
- [ ] Chart is responsive (stacks vertically on mobile, horizontal on desktop)
- [ ] Chart library supports accessibility (keyboard navigation, screen reader labels)

**Priority**: P0 - Critical

**Estimated Effort**: Medium

---

#### US-D3: Access Recent Expenses Quickly

**As a** personal expense tracker user
**I want to** see my 5-10 most recent expenses on the dashboard
**So that** I can quickly verify recent entries without navigating to the full list

**Acceptance Criteria**:
- [ ] Recent expenses section displays below chart on dashboard
- [ ] Shows exactly 10 most recent expenses (sorted by date descending, then by createdAt descending)
- [ ] Each expense card displays: description, amount (formatted currency), category (badge), date (formatted)
- [ ] Clicking expense card opens Expense Form in edit mode
- [ ] "View All Expenses" link navigates to /expenses page
- [ ] If fewer than 10 expenses exist, show all available
- [ ] If zero expenses exist, show empty state message: "No expenses yet. Add your first expense to get started."
- [ ] Section has clear heading: "Recent Expenses"
- [ ] Loading state shows 10 skeleton cards while fetching data
- [ ] Cards are stacked vertically on mobile, can be 2-column grid on desktop (optional)

**Priority**: P0 - Critical

**Estimated Effort**: Small

---

#### US-D4: Add New Expense from Dashboard

**As a** personal expense tracker user
**I want to** add a new expense directly from the dashboard
**So that** I can quickly log expenses without navigating away

**Acceptance Criteria**:
- [ ] "Add Expense" button visible on dashboard (top-right or floating action button)
- [ ] Button labeled clearly: "+ Add Expense" or similar
- [ ] Clicking button opens Expense Form in create mode
- [ ] Form opens as modal on desktop (centered overlay)
- [ ] Form opens as drawer on mobile (slides up from bottom)
- [ ] Form overlay has backdrop (dims background)
- [ ] Clicking backdrop or pressing Escape closes form (with unsaved changes warning)
- [ ] Button is accessible via keyboard (Tab navigation, Enter to activate)
- [ ] Button has appropriate ARIA label for screen readers

**Priority**: P0 - Critical

**Estimated Effort**: Small

---

### 1.2 Expenses Page Feature

#### US-E1: View All Expenses with Default Filters

**As a** personal expense tracker user
**I want to** see all my expenses filtered to the current year by default
**So that** I focus on recent data without being overwhelmed by historical records

**Acceptance Criteria**:
- [ ] On page load, expenses automatically filtered to current calendar year (Jan 1 - Dec 31 of current year)
- [ ] Expenses sorted by date descending (newest first) by default
- [ ] Initial display shows first 20 expense records
- [ ] "Load More" button appears at bottom if more than 20 records exist
- [ ] Clicking "Load More" loads next 20 records, appends to list
- [ ] "Load More" button hidden when all matching records displayed
- [ ] Loading state shows skeleton cards while fetching initial data
- [ ] Page displays record count: "Showing X of Y expenses"
- [ ] Empty state message if zero expenses exist for current year: "No expenses found for this year."
- [ ] URL reflects default filter state (optional: /expenses?year=2025)

**Priority**: P0 - Critical

**Estimated Effort**: Medium

---

#### US-E2: Filter Expenses by Category

**As a** personal expense tracker user
**I want to** filter expenses by one or more categories
**So that** I can focus on specific types of spending

**Acceptance Criteria**:
- [ ] Category filter displayed as multi-select dropdown or chip group
- [ ] Dropdown shows all 7 categories: Comida, Transporte, Entretenimiento, Salud, Compras, Servicios, Otros
- [ ] "All Categories" option clears category filter (shows all)
- [ ] Selecting multiple categories uses OR logic (show expenses matching ANY selected category)
- [ ] Filter applies immediately on selection (no "Apply" button needed)
- [ ] Expense list updates with only matching records
- [ ] Record count updates: "Showing X of Y expenses (filtered)"
- [ ] Selected categories visually indicated (checked or highlighted)
- [ ] Clearing all selections reverts to "All Categories"
- [ ] Category filter persists when combined with date or search filters (AND logic across filter types)
- [ ] Loading state shown during filter application if IndexedDB query takes >200ms

**Priority**: P0 - Critical

**Estimated Effort**: Medium

---

#### US-E3: Filter Expenses by Date Range

**As a** personal expense tracker user
**I want to** filter expenses by a custom date range
**So that** I can analyze spending for specific time periods

**Acceptance Criteria**:
- [ ] Date range filter displays two date pickers: "From" and "To"
- [ ] Default "From" date is Jan 1 of current year
- [ ] Default "To" date is Dec 31 of current year
- [ ] User can select custom start date, end date, or both
- [ ] Date range is inclusive (includes both start and end dates)
- [ ] If only "From" date provided, filter shows expenses >= start date
- [ ] If only "To" date provided, filter shows expenses <= end date
- [ ] Filter applies immediately on date selection
- [ ] Expense list updates with only matching records
- [ ] Invalid date range (end before start) shows validation error: "End date must be after start date"
- [ ] Clear button resets date range to current year defaults
- [ ] Date filter persists when combined with category or search filters

**Priority**: P1 - High

**Estimated Effort**: Medium

---

#### US-E4: Search Expenses by Description

**As a** personal expense tracker user
**I want to** search expenses by description text
**So that** I can quickly find specific transactions

**Acceptance Criteria**:
- [ ] Search input field visible at top of Expenses page
- [ ] Placeholder text: "Search by description..."
- [ ] Search is case-insensitive substring match
- [ ] Search queries entire description field
- [ ] Search debounced with 300ms delay (avoids excessive re-renders)
- [ ] Expense list updates to show only matching records
- [ ] Clearing search input shows all expenses (respecting other filters)
- [ ] Search works in combination with category and date filters (AND logic)
- [ ] Record count updates: "Showing X of Y expenses (search: '{query}')"
- [ ] Empty search result shows message: "No expenses match your search."
- [ ] Search input has clear button (X icon) to quickly clear text

**Priority**: P1 - High

**Estimated Effort**: Small

---

#### US-E5: Edit Expense from List

**As a** personal expense tracker user
**I want to** click an expense card to edit it
**So that** I can quickly correct errors or update details

**Acceptance Criteria**:
- [ ] Clicking anywhere on expense card opens Expense Form in edit mode
- [ ] Form pre-filled with existing expense data (description, amount, category, date)
- [ ] Form title changes to "Edit Expense"
- [ ] Save button updates existing expense in IndexedDB
- [ ] After successful save, form closes and expense list updates immediately
- [ ] Updated expense re-sorted in list based on date (maintains sort order)
- [ ] Success toast message: "Expense updated successfully"
- [ ] Cancel button closes form without saving (shows unsaved changes warning)
- [ ] Delete button visible in edit mode (opens confirmation dialog)
- [ ] Form accessible via keyboard (Enter key on focused card opens form)
- [ ] Expense card has hover state (cursor: pointer, subtle highlight)

**Priority**: P0 - Critical

**Estimated Effort**: Small

---

#### US-E6: Delete Expense with Confirmation

**As a** personal expense tracker user
**I want to** delete an expense with a confirmation step
**So that** I avoid accidental deletion of important records

**Acceptance Criteria**:
- [ ] Delete button visible in Expense Form (edit mode only)
- [ ] Delete button styled as destructive action (red color, outlined)
- [ ] Clicking delete button opens confirmation dialog
- [ ] Dialog message: "Are you sure you want to delete this expense? This action cannot be undone."
- [ ] Dialog has two buttons: "Cancel" (default focus) and "Delete" (destructive)
- [ ] Clicking "Cancel" closes dialog, returns to form
- [ ] Clicking "Delete" removes expense from IndexedDB
- [ ] After successful deletion, form closes and expense list updates immediately
- [ ] Success toast message: "Expense deleted successfully"
- [ ] If deletion fails, error toast: "Failed to delete expense. Please try again."
- [ ] Dialog accessible via keyboard (Escape closes, Enter confirms)
- [ ] Backdrop click closes dialog (same as Cancel)

**Priority**: P0 - Critical

**Estimated Effort**: Small

---

### 1.3 Expense Form Feature

#### US-F1: Create New Expense with Validation

**As a** personal expense tracker user
**I want to** create a new expense with comprehensive validation
**So that** I ensure data quality and avoid errors

**Acceptance Criteria**:
- [ ] Form has 4 fields: Description (text), Amount (number), Category (select), Date (date picker)
- [ ] Description field required, min 3 characters, max 200 characters
- [ ] Description cannot be only whitespace (trimmed before validation)
- [ ] Description error: "Description is required and must be at least 3 characters"
- [ ] Amount field required, must be positive number > 0
- [ ] Amount allows up to 2 decimal places (e.g., 12.99)
- [ ] Amount max value: 999,999,999.99 (to prevent overflow)
- [ ] Amount error: "Amount must be a positive number"
- [ ] Category field required, dropdown with 7 options
- [ ] Category error: "Please select a valid category"
- [ ] Date field required, defaults to today's date
- [ ] Date cannot be in the future (max: today)
- [ ] Date cannot be before year 1900 (reasonable constraint)
- [ ] Date error: "Please select a valid date (not in the future)"
- [ ] Form uses React Hook Form with Zod schema validation
- [ ] Validation triggers on blur (field loses focus)
- [ ] Submit button disabled until all fields valid
- [ ] Clicking "Save" validates all fields, creates expense in IndexedDB
- [ ] After successful save, form closes and UI updates immediately (dashboard metrics, expense list)
- [ ] Success toast message: "Expense created successfully"
- [ ] If save fails, error toast: "Failed to create expense. Please try again."
- [ ] Loading state on submit button: "Saving..." with spinner

**Priority**: P0 - Critical

**Estimated Effort**: Large

---

#### US-F2: Cancel Form with Unsaved Changes Warning

**As a** personal expense tracker user
**I want to** be warned before losing unsaved changes
**So that** I don't accidentally discard my work

**Acceptance Criteria**:
- [ ] Cancel button visible in form header or footer
- [ ] If form is pristine (no changes made), clicking Cancel closes form immediately
- [ ] If form is dirty (changes made), clicking Cancel opens confirmation dialog
- [ ] Dialog message: "You have unsaved changes. Are you sure you want to close?"
- [ ] Dialog has two buttons: "Stay" (default focus) and "Discard Changes" (destructive)
- [ ] Clicking "Stay" closes dialog, returns to form
- [ ] Clicking "Discard Changes" closes form without saving
- [ ] Clicking backdrop (outside form) triggers same behavior as Cancel button
- [ ] Pressing Escape key triggers same behavior as Cancel button
- [ ] Dialog accessible via keyboard
- [ ] Form tracks dirty state using React Hook Form formState.isDirty

**Priority**: P1 - High

**Estimated Effort**: Small

---

#### US-F3: Responsive Form Layout

**As a** personal expense tracker user
**I want to** use the expense form comfortably on both mobile and desktop
**So that** I can add expenses regardless of device

**Acceptance Criteria**:
- [ ] On desktop (≥768px), form opens as centered modal (350px width, auto height)
- [ ] On mobile (<768px), form opens as drawer sliding up from bottom (full width, 80vh height)
- [ ] Modal has close button (X icon) in top-right corner
- [ ] Drawer has drag handle at top (visual indicator, optional drag-to-close)
- [ ] Form fields stack vertically on all screen sizes
- [ ] Input fields have appropriate mobile keyboard types (number keyboard for Amount, date picker for Date)
- [ ] Form scrollable if content exceeds viewport height
- [ ] Focus trapped within form (Tab cycles through form fields only)
- [ ] First field (Description) auto-focused when form opens
- [ ] Form overlay prevents interaction with background content
- [ ] Form animations smooth (slide-in/fade-in, 200ms duration)

**Priority**: P0 - Critical

**Estimated Effort**: Medium

---

### 1.4 AI Chat Interface Feature

#### US-C1: Access Chat Interface from Any Page

**As a** personal expense tracker user
**I want to** access the AI chat interface from any page
**So that** I can get layout assistance whenever I need it

**Acceptance Criteria**:
- [ ] Floating chat bubble visible on all pages (Dashboard, Expenses)
- [ ] Bubble positioned in bottom-right corner (fixed position)
- [ ] Bubble size: 60x60px on mobile, 70x70px on desktop
- [ ] Bubble displays chat icon (message or robot icon)
- [ ] Bubble has subtle pulse animation to indicate availability
- [ ] Clicking bubble opens chat window
- [ ] Bubble z-index high enough to appear above all content
- [ ] Bubble accessible via keyboard (Tab navigation, Enter to activate)
- [ ] Bubble has ARIA label: "Open layout assistant chat"
- [ ] Bubble color matches design system accent color

**Priority**: P1 - High

**Estimated Effort**: Small

---

#### US-C2: Interact with Chat Window

**As a** personal expense tracker user
**I want to** send messages to the layout assistant and receive responses
**So that** I can request layout modifications

**Acceptance Criteria**:
- [ ] Chat window opens above chat bubble when bubble clicked
- [ ] Window positioned in bottom-right corner (above bubble)
- [ ] Window size: 350x500px on desktop, 100vw x 60vh on mobile
- [ ] Window has header: "Layout Assistant" with minimize and close buttons
- [ ] Window has scrollable message history area (body)
- [ ] Window has message input field and send button (footer)
- [ ] Messages displayed in conversation format (user messages right-aligned, AI messages left-aligned)
- [ ] User can type message and press Enter or click Send to submit
- [ ] After sending, user message immediately appears in chat
- [ ] AI typing indicator appears ("Assistant is typing...")
- [ ] AI response appears after processing (simulated delay or real API call)
- [ ] Chat auto-scrolls to latest message
- [ ] Message timestamps displayed (optional)
- [ ] Chat window maintains conversation state during session (not persisted to IndexedDB)
- [ ] Clicking minimize collapses window back to bubble
- [ ] Clicking close closes window (same as minimize)
- [ ] Clicking backdrop (if exists) closes window
- [ ] Chat window accessible via keyboard
- [ ] Input field has placeholder: "Ask me to modify your dashboard layout..."

**Priority**: P1 - High

**Estimated Effort**: Medium

---

#### US-C3: Receive Layout Suggestions from AI

**As a** personal expense tracker user
**I want to** receive structured layout suggestions from the AI agent
**So that** I understand how my dashboard can be customized

**Acceptance Criteria**:
- [ ] AI agent parses user request (e.g., "Move metrics to the left")
- [ ] AI agent generates structured JSON response with layoutConfig
- [ ] AI message displays suggestion in conversational text
- [ ] AI message optionally displays JSON config in collapsible section (for advanced users)
- [ ] Suggestions are relevant to user request
- [ ] AI gracefully handles unclear requests: "I'm not sure I understand. Can you clarify what layout change you'd like?"
- [ ] AI does not execute layout changes (Stage 1-2 constraint)
- [ ] AI response time < 3 seconds (local processing or fast API)
- [ ] If AI request fails, error message: "Failed to process your request. Please try again."
- [ ] User can continue conversation (ask follow-up questions)

**Priority**: P2 - Medium

**Estimated Effort**: Large (depends on AI implementation)

---

### 1.5 Layout Intelligence Agent Feature

#### US-L1: Understand Layout Modification Requests

**As a** layout intelligence agent
**I want to** parse and understand natural language layout requests
**So that** I can generate appropriate layout suggestions

**Acceptance Criteria**:
- [ ] Agent recognizes keywords: "move", "resize", "create", "show", "hide", "highlight"
- [ ] Agent identifies target elements: "metrics", "chart", "recent expenses", "categories"
- [ ] Agent understands positions: "left", "right", "top", "bottom", "center"
- [ ] Agent understands sizes: "bigger", "smaller", "larger", "full width", "half width"
- [ ] Agent understands layouts: "two-column", "single-column", "grid"
- [ ] Agent generates structured output matching LayoutConfig interface
- [ ] Agent provides fallback for unrecognized requests
- [ ] Agent validates suggestions are feasible (e.g., doesn't suggest impossible layouts)

**Priority**: P2 - Medium

**Estimated Effort**: Large

---

#### US-L2: Generate Structured Layout Configurations

**As a** layout intelligence agent
**I want to** generate structured JSON configurations
**So that** the UI layer can interpret and display suggestions

**Acceptance Criteria**:
- [ ] Output format matches defined JSON structure (suggestion + layoutConfig)
- [ ] layoutConfig includes positioning, sizing, and ordering properties
- [ ] Output is valid JSON (parseable)
- [ ] Output includes human-readable suggestion text
- [ ] Output includes previewAvailable flag (false for Stage 1-2)
- [ ] Agent provides multiple suggestion options if applicable
- [ ] Agent explains what the layout change would do

**Priority**: P2 - Medium

**Estimated Effort**: Medium

---

## 2. Edge Case Analysis

### 2.1 Empty State Scenarios

#### No Expenses Exist (First-Time User)

**Scenario**: User opens app for the first time, no expenses in IndexedDB

**Expected Behavior**:
- Dashboard metrics show:
  - Total Spent: $0.00
  - Average Daily Spending: $0.00
  - Top Category: "None"
  - Transaction Count: 0
- Chart displays: "No data to display. Add your first expense to see your spending trends."
- Recent Expenses section: "No expenses yet. Add your first expense to get started."
- Prominent "Add Expense" button or call-to-action
- Expenses page: "No expenses found for this year. Create your first expense to start tracking."

**UI Considerations**:
- Empty states should be visually distinct (icon + message)
- Provide clear next action (guide user to add expense)
- Avoid showing "0" everywhere (use friendly messages)

---

#### No Expenses This Month (Month Just Started)

**Scenario**: User has historical expenses, but none for current month (e.g., today is Jan 1)

**Expected Behavior**:
- Dashboard metrics show:
  - Total Spent: $0.00
  - Average Daily Spending: $0.00 (or total ÷ 1 if any expense exists for Jan 1)
  - Top Category: "None"
  - Transaction Count: 0
- Chart shows: "No expenses this month yet."
- Recent Expenses section shows last 10 expenses from previous months
- Expenses page (filtered to current year): "No expenses found for this year."
- User can change date filter to see historical data

**UI Considerations**:
- Distinguish between "no data ever" and "no data this period"
- Recent expenses should still show (not limited to current month)

---

#### All Expenses Filtered Out

**Scenario**: User applies category/date/search filters with zero matching results

**Expected Behavior**:
- Expenses page shows: "No expenses match your filters."
- Record count: "Showing 0 of Y expenses (filtered)"
- Clear filters button or link to reset
- Filter controls remain visible and functional
- User can adjust filters to see results

**UI Considerations**:
- Empty state should explain why (filters applied)
- Provide easy way to clear filters

---

### 2.2 Error Scenarios

#### IndexedDB Unavailable or Fails

**Scenario**: Browser doesn't support IndexedDB or database fails to open

**Expected Behavior**:
- App displays global error state: "Unable to access local storage. Please ensure your browser supports IndexedDB and try again."
- Dashboard shows error state (no metrics)
- Expenses page shows error state
- Expense form disabled (cannot save)
- Provide troubleshooting tips (check browser, private mode, etc.)

**Recovery Actions**:
- Retry button to attempt reopening database
- Link to help documentation

---

#### Failed to Create/Update Expense

**Scenario**: IndexedDB write operation fails (disk full, transaction error, etc.)

**Expected Behavior**:
- Error toast: "Failed to save expense. Please try again."
- Form remains open with user data intact (don't lose input)
- Submit button re-enabled after error
- Retry up to 3 times automatically
- After 3 failures, show persistent error message

**Recovery Actions**:
- User can retry manually
- Form data not lost
- Consider fallback to localStorage if IndexedDB persistently fails

---

#### Failed to Delete Expense

**Scenario**: IndexedDB delete operation fails

**Expected Behavior**:
- Error toast: "Failed to delete expense. Please try again."
- Confirmation dialog closes
- Expense remains in list (not optimistically removed)
- User can retry deletion

---

#### AI Agent Request Fails

**Scenario**: AI agent processing fails or times out

**Expected Behavior**:
- Error message in chat: "I'm having trouble processing your request right now. Please try again later."
- User can continue conversation
- Previous messages remain in history
- Retry button or option to rephrase request

---

### 2.3 Boundary Conditions

#### Year Transition (Dec 31 → Jan 1)

**Scenario**: User views dashboard on Dec 31, then on Jan 1

**Expected Behavior**:
- Dec 31 metrics show all December expenses
- Jan 1 metrics show only Jan 1 expenses (monthly reset)
- Recent expenses list continues to show last 10 (including December)
- Expenses page default filter changes to new year (2026 instead of 2025)
- No data carried over from previous month to current month metrics

**Testing Considerations**:
- Simulate date changes in tests
- Verify metric calculations use current month boundaries

---

#### First Day of Month (Average Daily Spending)

**Scenario**: Today is the 1st of any month, user views metrics

**Expected Behavior**:
- Average Daily Spending = totalSpent ÷ 1
- If $100 spent on Jan 1, average shows $100.00
- Metric updates as more expenses added on Jan 1
- No division by zero errors

---

#### Maximum Amount Value

**Scenario**: User enters amount close to maximum (999,999,999.99)

**Expected Behavior**:
- Form accepts valid maximum value
- Amount displays correctly in currency format ($999,999,999.99)
- Metrics calculations handle large numbers without overflow
- UI doesn't break with long numbers (consider responsive text sizing)

---

#### Date in Distant Past (Year 1900)

**Scenario**: User selects date from year 1900 (minimum allowed)

**Expected Behavior**:
- Form accepts date
- Date displays correctly
- Filtering works correctly for old dates
- No date parsing errors

---

#### Date in Future (Validation)

**Scenario**: User attempts to select tomorrow's date

**Expected Behavior**:
- Form validation error: "Date cannot be in the future"
- Submit button disabled
- User must correct date to proceed
- Today's date allowed (max: today)

---

#### Pagination with Exactly 20 Records

**Scenario**: User has exactly 20 expenses matching filters

**Expected Behavior**:
- Initial load shows all 20 records
- "Load More" button hidden (no more records)
- Record count: "Showing 20 of 20 expenses"

---

#### Pagination with 21 Records

**Scenario**: User has 21 expenses matching filters

**Expected Behavior**:
- Initial load shows 20 records
- "Load More" button visible
- Record count: "Showing 20 of 21 expenses"
- Clicking "Load More" shows 21st record
- "Load More" button hidden after loading all

---

### 2.4 Mobile vs Desktop Differences

#### Form Display

**Desktop (≥768px)**:
- Modal centered on screen (350px width)
- Backdrop dims background
- Close button in top-right

**Mobile (<768px)**:
- Drawer slides up from bottom (full width, 80vh height)
- Drag handle at top (optional)
- Close button or swipe down to close

---

#### Chat Window

**Desktop**:
- Fixed size: 350x500px
- Positioned above chat bubble (bottom-right)

**Mobile**:
- Full width (100vw) and 60vh height
- Slides up from bottom
- May cover chat bubble when open

---

#### Dashboard Layout

**Desktop**:
- Metrics panel: 4-column grid
- Chart and recent expenses side-by-side (optional)

**Mobile**:
- Metrics panel: 2-column grid or vertical stack
- Chart and recent expenses stacked vertically

---

#### Expense Cards

**Desktop**:
- Can display in 2-3 column grid (optional)
- More horizontal space for details

**Mobile**:
- Single column (vertical stack)
- Smaller font sizes
- Touch-friendly tap targets (min 44x44px)

---

## 3. Business Rule Clarifications

### 3.1 Expense Validation Rules (Detailed)

#### Description Field

**Rule**: Required, min 3 characters, max 200 characters, cannot be only whitespace

**Clarifications**:
- Trim whitespace before validation (leading and trailing spaces removed)
- "   abc   " trimmed to "abc" (valid)
- "  a  " trimmed to "a" (invalid, <3 chars)
- "   " trimmed to "" (invalid, required)
- Numbers allowed in description ("Paid $50 for groceries" is valid)
- Special characters allowed (emojis, punctuation)
- Validation message placement: below field, red text

**Edge Cases**:
- User pastes 500 characters → truncated to 200 or error
- User types "  " → shows required error on blur

---

#### Amount Field

**Rule**: Required, positive number > 0, max 2 decimal places, max value 999,999,999.99

**Clarifications**:
- Input type="number" with step="0.01"
- Negative numbers rejected on blur validation
- Zero rejected ("Amount must be greater than 0")
- Value like "12.999" rounded to "13.00" or rejected (prefer rejection for accuracy)
- Scientific notation ("1e5") rejected (must be standard decimal format)
- Comma separators in input ("1,000") handled gracefully (strip commas before parsing)
- NaN or Infinity rejected

**Edge Cases**:
- User types "0.00" → error
- User types "-50" → error
- User types "12.3" → accepted (becomes "12.30")
- User types "abc" → input blocked or validation error

---

#### Category Field

**Rule**: Required, must be one of 7 predefined categories

**Clarifications**:
- Dropdown prevents invalid values (not free text)
- Default selection: none (placeholder: "Select category")
- Cannot submit without selecting category
- Category names in Spanish (as defined): Comida, Transporte, etc.

**Edge Cases**:
- User doesn't select → error on submit
- User selects then clears → error (treat as required)

---

#### Date Field

**Rule**: Required, valid ISO 8601 date, cannot be in future, cannot be before 1900

**Clarifications**:
- Date picker prevents invalid dates (browser native or library)
- Max date: today (inclusive)
- Min date: Jan 1, 1900
- Default: today's date
- Date stored as ISO 8601 string in IndexedDB
- Display formatted as locale-specific (e.g., "Dec 2, 2025" in English, "2 dic 2025" in Spanish)

**Edge Cases**:
- User selects tomorrow → validation error
- User types invalid date manually → picker rejects or validation error
- User in different timezone → use local timezone consistently

---

### 3.2 Metric Calculation Rules (Detailed)

#### Total Spent This Month

**Formula**: `SUM(amount) WHERE date >= firstDayOfMonth AND date <= lastDayOfMonth`

**Clarifications**:
- firstDayOfMonth = current year, current month, day 1, 00:00:00
- lastDayOfMonth = current year, current month, last day of month, 23:59:59
- Calculation uses date boundaries (inclusive)
- Formatted as currency: `$1,234.56`
- Shows `$0.00` if no expenses this month

**Edge Cases**:
- Month with 28 days (February) vs 31 days → dynamic last day
- Leap year February (29 days) → handle correctly
- Dec 31 23:59 → included in December total
- Jan 1 00:00 → included in January total

---

#### Average Daily Spending

**Formula**: `totalSpentThisMonth ÷ currentDayOfMonth`

**Clarifications**:
- currentDayOfMonth = integer (1-31 depending on month)
- On the 1st, average = totalSpent ÷ 1
- On the 15th, average = totalSpent ÷ 15
- Result formatted as currency: `$45.67`
- Shows `$0.00` if no expenses this month

**Edge Cases**:
- Division by zero impossible (day always ≥ 1)
- If only 1 expense on the 1st ($100), average = $100.00
- If $300 total on the 15th, average = $20.00

---

#### Top Category

**Formula**: `GROUP BY category, SUM(amount), ORDER BY SUM(amount) DESC, LIMIT 1`

**Clarifications**:
- Group expenses by category, sum amounts
- Category with highest total selected
- If tie (two categories with same total), select first alphabetically:
  - Comida and Transporte both $100 → Comida (C before T)
  - Categories sorted: Comida, Compras, Entretenimiento, Otros, Salud, Servicios, Transporte
- Display category name only: "Comida" (not amount)
- Shows "None" if zero expenses this month

**Edge Cases**:
- All categories have $0 → "None"
- Single expense ($50 Comida) → "Comida"
- Tie-breaker alphabetical: Salud and Servicios ($50 each) → Salud

---

#### Transaction Count

**Formula**: `COUNT(*) WHERE date >= firstDayOfMonth AND date <= lastDayOfMonth`

**Clarifications**:
- Count number of expense records (rows)
- Simple integer count
- Display: "23" or "23 transactions"
- Shows "0" if no expenses this month

**Edge Cases**:
- Single expense → "1"
- Zero expenses → "0"

---

### 3.3 Filter Combination Logic

**Filters**: Category, Date Range, Description Search

**Logic**: AND across filter types, OR within multi-select

**Examples**:

1. **Category Filter Only**:
   - User selects "Comida" → show only Comida expenses
   - User selects "Comida" and "Transporte" → show Comida OR Transporte (OR logic)

2. **Date Range Filter Only**:
   - User sets Jan 1 - Jan 31 → show expenses in January only

3. **Search Filter Only**:
   - User types "grocery" → show expenses where description contains "grocery" (case-insensitive)

4. **Combined Filters** (AND logic):
   - Category: Comida + Date: Jan 1-31 + Search: "grocery"
   - Result: expenses that are (Comida) AND (in January) AND (description contains "grocery")

**Clarifications**:
- Filters applied simultaneously
- Each filter narrows results
- Clearing one filter expands results (other filters still active)
- "Reset All Filters" clears all and shows default state (current year)

---

### 3.4 AI Agent Response Boundaries

**Current Stage (1-2) Constraints**:
- Agent provides suggestions ONLY (no execution)
- Agent has NO access to actual expense data
- Agent has NO ability to modify IndexedDB
- Agent responses are informational and educational

**Allowed Agent Capabilities**:
- Parse layout modification requests
- Generate structured JSON layout configurations
- Provide conversational explanations
- Suggest feasible layout changes

**Prohibited Agent Actions**:
- Execute layout changes automatically
- Read expense amounts, categories, or dates
- Modify dashboard UI directly
- Access user data beyond conversation history

**Response Format**:
- Conversational text: "I can help you create a two-column layout..."
- Structured JSON: `{ suggestion: "...", layoutConfig: { ... } }`
- No misleading claims ("I've changed your layout" → incorrect)

**Future (Stage 3) Capabilities**:
- Read-only access to dashboard metrics (for context-aware suggestions)
- Ability to execute layout changes with user confirmation
- Persistent layout configurations

---

## 4. Success Metrics

### 4.1 Functional Requirements Validation

**Metric**: Feature completeness percentage

**Target**: 100% of P0 features implemented and tested

**P0 Features** (Must Have for MVP):
- Dashboard metrics (all 4 cards)
- Expense chart (by day/category)
- Recent expenses list
- Expenses page (list, filters, search, pagination)
- Expense form (create/edit with validation)
- Delete expense with confirmation
- Floating chat bubble and window
- AI agent basic response capability

**Validation Method**:
- Manual testing checklist
- Automated tests for validation logic
- Cross-browser testing (Chrome, Safari, Firefox)
- Mobile device testing (iOS, Android)

---

### 4.2 User Experience Goals

#### Goal 1: Fast Expense Entry

**Metric**: Time to add new expense (from dashboard to saved)

**Target**: < 30 seconds for typical user

**Measurement**:
- User opens form (click "Add Expense")
- User fills 4 fields (description, amount, category, date)
- User clicks Save
- Form closes, expense visible in UI

**Success Criteria**:
- Form opens in <500ms
- Validation feedback instant (<100ms)
- Save operation completes in <500ms
- UI updates immediately

---

#### Goal 2: Clear Visual Hierarchy

**Metric**: User comprehension of dashboard

**Target**: New users understand metrics within 10 seconds

**Validation Method**:
- User testing (show dashboard, ask "What do you see?")
- Verify users can identify key metrics without explanation
- Check users understand what each metric represents

**Success Criteria**:
- Metrics clearly labeled
- Visual distinction between metric cards
- Logical flow (top-to-bottom or left-to-right)
- No confusion about data source (current month)

---

#### Goal 3: Effortless Filtering

**Metric**: Time to filter expenses by category

**Target**: < 5 seconds

**Measurement**:
- User navigates to Expenses page
- User opens category filter
- User selects category
- Results update

**Success Criteria**:
- Filter controls visible and obvious
- Filter applies immediately (no lag)
- Clear feedback on active filters
- Easy to reset filters

---

#### Goal 4: Conversational AI Interaction

**Metric**: User satisfaction with AI chat

**Target**: 80% of test users find AI helpful

**Validation Method**:
- User testing with sample requests
- Collect feedback on response quality
- Measure response time

**Success Criteria**:
- AI responds in < 3 seconds
- Responses relevant to user request
- Suggestions are actionable and clear
- No confusing or misleading responses

---

### 4.3 Performance Benchmarks

#### Page Load Time

**Metric**: Time to First Contentful Paint (FCP)

**Target**: < 1 second

**Measurement**:
- Lighthouse performance audit
- Real-world testing on 4G connection

---

#### IndexedDB Query Performance

**Metric**: Time to fetch and display 100 expenses

**Target**: < 500ms

**Measurement**:
- Simulate 100 expense records
- Measure time from query start to UI render

---

#### UI Update Responsiveness

**Metric**: Time from user action to UI feedback

**Target**: < 100ms

**Examples**:
- Click "Add Expense" → Form opens
- Type in search → Results filter
- Click expense card → Form opens

---

#### Mobile Responsiveness

**Metric**: UI adapts correctly to all screen sizes

**Target**: Responsive on 320px to 1920px widths

**Validation**:
- Test breakpoints: 320px, 375px, 768px, 1024px, 1440px
- Verify no horizontal scroll
- Verify touch targets ≥44x44px

---

### 4.4 Accessibility Compliance

**Standard**: WCAG 2.1 Level AA

**Key Requirements**:
- Color contrast ≥4.5:1 for text
- Keyboard navigation for all features
- Screen reader compatibility
- Focus indicators visible
- ARIA labels for interactive elements

**Validation Method**:
- Lighthouse accessibility audit
- Manual keyboard navigation testing
- Screen reader testing (NVDA, VoiceOver)

---

### 4.5 Error Handling Coverage

**Metric**: Percentage of error scenarios handled gracefully

**Target**: 100% of identified error scenarios

**Scenarios to Cover**:
- IndexedDB unavailable
- Create expense fails
- Update expense fails
- Delete expense fails
- AI agent request fails
- Network timeout (future API calls)
- Invalid form input
- Empty states

**Validation**:
- Manual error simulation
- Automated error state tests

---

## 5. Priority Recommendations

### P0 - Critical (MVP Blockers)

**Must have before launch**:

1. **Dashboard**:
   - All 4 metrics cards
   - Expense chart (basic bar chart)
   - Recent expenses list (10 items)

2. **Expenses Page**:
   - Expense list with initial filters (current year)
   - Category filter (multi-select)
   - Basic pagination (20 items, load more)

3. **Expense Form**:
   - Create/edit modes
   - All 4 fields with validation
   - React Hook Form + Zod integration
   - Save and cancel functionality

4. **Delete Functionality**:
   - Delete button in edit form
   - Confirmation dialog

5. **IndexedDB**:
   - CRUD operations
   - Error handling for database failures

6. **Mobile Responsiveness**:
   - Form as modal (desktop) / drawer (mobile)
   - Responsive dashboard layout
   - Touch-friendly controls

**Estimated Total Effort**: 3-4 weeks (single developer)

---

### P1 - High (Important for Good UX)

**Should have soon after launch**:

1. **Enhanced Filtering**:
   - Date range filter
   - Description search
   - Combined filter logic

2. **Chat Interface**:
   - Floating chat bubble
   - Chat window UI
   - Basic message history

3. **Improved Error Handling**:
   - Retry logic for failed operations
   - Unsaved changes warning
   - Specific error messages

4. **Loading States**:
   - Skeleton loaders for dashboard
   - Spinner for form submit
   - Loading indicators for filters

5. **Accessibility**:
   - Keyboard navigation
   - ARIA labels
   - Focus management

**Estimated Total Effort**: 1-2 weeks

---

### P2 - Medium (Nice to Have)

**Can defer to later iterations**:

1. **AI Agent Intelligence**:
   - Advanced layout request parsing
   - Multiple suggestion options
   - Context-aware responses

2. **Enhanced Visualizations**:
   - Chart toggle (bar/line/pie)
   - Chart animations
   - Interactive chart tooltips

3. **Advanced Sorting**:
   - Sort by amount
   - Sort by category
   - Custom sort orders

4. **Bulk Actions**:
   - Select multiple expenses
   - Bulk delete
   - Bulk category change

**Estimated Total Effort**: 2-3 weeks

---

### P3 - Low (Future Enhancements)

**Stage 3 or beyond**:

1. **AI Layout Execution**:
   - Direct layout modification
   - Layout preview
   - Persistent configurations

2. **Export/Import**:
   - Export expenses to CSV
   - Import from CSV
   - Backup/restore functionality

3. **Advanced Analytics**:
   - Spending trends over time
   - Category breakdowns
   - Budget vs actual

4. **Themes**:
   - Dark mode
   - Custom color schemes
   - Font size adjustments

**Estimated Total Effort**: 4+ weeks

---

## 6. Next Steps for Parent Agent

### Immediate Actions

1. **Review this plan** with stakeholders (if applicable)
2. **Create session context entry** appending this plan's summary
3. **Invoke specialized agents**:
   - Domain Architect (for expense/dashboard/ai-chat domain structure)
   - UX/UI Designer (for layout and responsive design)
   - shadcn Builder (for component selection)
   - Next.js Builder (for App Router architecture)

### Implementation Sequence

**Phase 1: Foundation** (Week 1)
- Set up IndexedDB schema and CRUD operations
- Create base Expense entity with Zod schema
- Build Expense Form component (atoms → organisms)

**Phase 2: Expense Management** (Week 2)
- Implement Expenses page with list and filters
- Add pagination
- Integrate create/edit/delete functionality

**Phase 3: Dashboard** (Week 3)
- Build metric calculation logic
- Create metric cards
- Implement basic chart
- Add recent expenses list

**Phase 4: AI Chat** (Week 4)
- Create chat bubble and window UI
- Implement chat state management
- Build basic AI agent response logic

**Phase 5: Polish** (Week 5)
- Mobile responsiveness refinement
- Accessibility improvements
- Error handling edge cases
- Performance optimization

---

## 7. Open Questions

### Technical Questions

1. **Chart Library Selection**: Should we use Chart.js, Recharts, or another library?
   - Recommendation: Recharts (React-friendly, responsive, accessible)

2. **AI Agent Implementation**: Local logic or external API (OpenAI, Anthropic)?
   - Stage 1-2: Simple rule-based parser (no API)
   - Stage 3: Consider LLM API for advanced NLP

3. **Date Formatting**: Should we support locale-specific date formats or default to US format?
   - Recommendation: Use browser locale (Intl.DateTimeFormat)

4. **Offline Detection**: Should we detect online/offline status and inform user?
   - Recommendation: Not necessary (app is offline-first), but nice to have

### UX Questions

1. **Empty State Imagery**: Should we use illustrations or just text messages?
   - Recommendation: Simple icons + text for MVP, illustrations later

2. **Confirmation Dialogs**: Should all destructive actions require confirmation or just delete?
   - Recommendation: Just delete for now, add to others if user feedback requests

3. **Expense Card Actions**: Should edit/delete be accessible from card or only in form?
   - Recommendation: Edit from card (click to open form), delete only in form

4. **Chat Window Persistence**: Should chat stay open between page navigations?
   - Recommendation: Close on navigation for MVP, persist later if requested

---

## Approval

**Business Analyst**: Claude (AI Agent)
**Date**: 2025-12-02
**Plan Status**: Ready for Review and Execution

---

## Changelog

| Date       | Version | Changes                                                   | Author            |
| ---------- | ------- | --------------------------------------------------------- | ----------------- |
| 2025-12-02 | 1.0     | Initial business analysis plan created                    | Business Analyst  |
| 2025-12-02 | 1.0     | Added user stories, edge cases, business rules, metrics   | Business Analyst  |
| 2025-12-02 | 1.0     | Defined success criteria and priority recommendations     | Business Analyst  |

---

**END OF BUSINESS ANALYSIS PLAN**
