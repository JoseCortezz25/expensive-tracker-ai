/**
 * useExpenses Hook
 *
 * Custom hook for fetching expenses with filters.
 * Manages loading state, errors, and provides refetch capability.
 *
 * @module domains/expenses/hooks/use-expenses
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getExpenses } from '../actions';
import type { Expense, ExpenseFilters, UseExpensesResult } from '../types';
import { logError } from '../errors';

/**
 * Hook for querying expenses with filters
 *
 * Automatically fetches on mount and when filters change.
 * Provides loading state, error handling, and manual refetch.
 *
 * @param filters - Optional filters for querying expenses
 * @returns Hook result with expenses, loading state, error, and refetch function
 *
 * @example
 * ```typescript
 * const { expenses, isLoading, error, refetch, totalCount, hasMore } = useExpenses({
 *   categories: ['Comida'],
 *   dateFrom: '2025-01-01',
 *   limit: 20
 * });
 * ```
 */
export function useExpenses(
  filters: ExpenseFilters = {}
): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Fetch expenses from IndexedDB
  const fetchExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getExpenses(filters);

      setExpenses(result.expenses);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      logError(error, { filters });
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Refetch function for manual updates
  const refetch = useCallback(async () => {
    await fetchExpenses();
  }, [fetchExpenses]);

  return {
    expenses,
    isLoading,
    error,
    refetch,
    totalCount,
    hasMore,
  };
}
