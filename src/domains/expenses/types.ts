/**
 * Types for Expenses Domain
 *
 * Defines all TypeScript interfaces and types for expense management.
 * These types align with the IndexedDB schema and business requirements.
 *
 * @module domains/expenses/types
 */

/**
 * Expense category enum
 * Must match the categories defined in PROJECT.md
 */
export type ExpenseCategory =
  | 'Comida'
  | 'Transporte'
  | 'Entretenimiento'
  | 'Salud'
  | 'Compras'
  | 'Servicios'
  | 'Otros';

/**
 * Array of all valid expense categories
 * Useful for Select dropdowns and validation
 */
export const EXPENSE_CATEGORIES: readonly ExpenseCategory[] = [
  'Comida',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Compras',
  'Servicios',
  'Otros',
] as const;

/**
 * Complete Expense entity as stored in IndexedDB
 *
 * All fields are required. ID and timestamps are auto-generated.
 */
export interface Expense {
  /** UUID v4 - Auto-generated */
  id: string;

  /** Description of the expense (3-200 chars) */
  description: string;

  /** Amount in local currency (positive, 2 decimal max) */
  amount: number;

  /** Category from predefined list */
  category: ExpenseCategory;

  /** Date of expense (ISO 8601 string, not future) */
  date: string;

  /** Record creation timestamp (ISO 8601 string) - Auto-generated */
  createdAt: string;

  /** Last update timestamp (ISO 8601 string) - Auto-updated */
  updatedAt: string;
}

/**
 * Input for creating a new expense
 * Omits auto-generated fields (id, createdAt, updatedAt)
 */
export interface CreateExpenseInput {
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: string; // ISO 8601 string or Date will be converted
}

/**
 * Input for updating an existing expense
 * All fields are optional - only provided fields will be updated
 */
export interface UpdateExpenseInput {
  description?: string;
  amount?: number;
  category?: ExpenseCategory;
  date?: string;
}

/**
 * Filter options for querying expenses
 * All filters are optional and can be combined
 */
export interface ExpenseFilters {
  /** Filter by categories (OR logic - matches any) */
  categories?: ExpenseCategory[];

  /** Filter by date range (inclusive) */
  dateFrom?: string; // ISO 8601 string
  dateTo?: string; // ISO 8601 string

  /** Search in description (case-insensitive substring) */
  searchQuery?: string;

  /** Sort field */
  sortBy?: 'date' | 'amount' | 'createdAt';

  /** Sort direction */
  sortOrder?: 'asc' | 'desc';

  /** Pagination: number of items to return */
  limit?: number;

  /** Pagination: number of items to skip */
  offset?: number;
}

/**
 * Result of a filtered expense query
 * Includes pagination metadata
 */
export interface ExpenseQueryResult {
  /** Filtered expenses */
  expenses: Expense[];

  /** Total count matching filters (before pagination) */
  totalCount: number;

  /** Whether there are more results available */
  hasMore: boolean;

  /** Current offset */
  offset: number;

  /** Current limit */
  limit: number;
}

/**
 * Sort configuration
 */
export interface ExpenseSort {
  field: 'date' | 'amount' | 'createdAt';
  order: 'asc' | 'desc';
}

/**
 * Date range filter
 */
export interface DateRange {
  from: Date | null;
  to: Date | null;
}

/**
 * UI state for expense filters (stored in Zustand)
 */
export interface ExpenseFiltersState {
  /** Selected categories for filtering */
  selectedCategories: ExpenseCategory[];

  /** Date range filter */
  dateRange: DateRange;

  /** Search query */
  searchQuery: string;

  /** Sort configuration */
  sort: ExpenseSort;

  /** Actions to update state */
  setSelectedCategories: (categories: ExpenseCategory[]) => void;
  setDateRange: (range: DateRange) => void;
  setSearchQuery: (query: string) => void;
  setSort: (sort: ExpenseSort) => void;
  resetFilters: () => void;
}

/**
 * Expense summary statistics
 * Used for calculating totals and averages
 */
export interface ExpenseSummary {
  /** Total amount of all expenses */
  total: number;

  /** Number of expenses */
  count: number;

  /** Average amount per expense */
  average: number;

  /** Minimum expense amount */
  min: number;

  /** Maximum expense amount */
  max: number;
}

/**
 * Category summary for aggregations
 */
export interface CategorySummary {
  category: ExpenseCategory;
  total: number;
  count: number;
  percentage: number; // 0-100
}

/**
 * Hook return type for useExpenses
 */
export interface UseExpensesResult {
  expenses: Expense[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  totalCount: number;
  hasMore: boolean;
}

/**
 * Hook return type for mutation hooks (create, update, delete)
 */
export interface UseMutationResult<TData = void, TVariables = unknown> {
  mutate: (variables: TVariables) => Promise<TData>;
  isLoading: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Form state for expense form
 */
export interface ExpenseFormData {
  description: string;
  amount: string; // String for form input, converted to number on submit
  category: ExpenseCategory | '';
  date: Date | null;
}

/**
 * Form mode (create or edit)
 */
export type ExpenseFormMode = 'create' | 'edit';
