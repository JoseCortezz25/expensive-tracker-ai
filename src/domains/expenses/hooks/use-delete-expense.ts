/**
 * useDeleteExpense Hook
 *
 * Custom hook for deleting expenses.
 * Manages loading state, errors, and provides mutation function.
 *
 * @module domains/expenses/hooks/use-delete-expense
 */

'use client';

import { useState, useCallback } from 'react';
import { deleteExpense } from '../actions';
import type { UseMutationResult } from '../types';
import { logError } from '../errors';

/**
 * Hook for deleting expenses
 *
 * Provides mutation function with loading and error states.
 * Takes expense ID as input, returns void on success.
 *
 * @returns Mutation result with mutate function, loading state, and error
 *
 * @example
 * ```typescript
 * const { mutate, isLoading, error, reset } = useDeleteExpense();
 *
 * const handleDelete = async () => {
 *   if (confirm('¿Eliminar gasto?')) {
 *     await mutate(expense.id);
 *     console.log('Deleted successfully');
 *   }
 * };
 * ```
 */
export function useDeleteExpense(): UseMutationResult<void, string> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      await deleteExpense(id);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      logError(error, { expenseId: id });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    mutate,
    isLoading,
    error,
    reset,
  };
}
