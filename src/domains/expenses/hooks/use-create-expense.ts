/**
 * useCreateExpense Hook
 *
 * Custom hook for creating new expenses.
 * Manages loading state, errors, and provides mutation function.
 *
 * @module domains/expenses/hooks/use-create-expense
 */

'use client';

import { useState, useCallback } from 'react';
import { createExpense } from '../actions';
import type { CreateExpenseInput, Expense, UseMutationResult } from '../types';
import { logError } from '../errors';

/**
 * Hook for creating new expenses
 *
 * Provides mutation function with loading and error states.
 * Does NOT auto-refetch - you must call refetch manually or use a global state manager.
 *
 * @returns Mutation result with mutate function, loading state, and error
 *
 * @example
 * ```typescript
 * const { mutate, isLoading, error, reset } = useCreateExpense();
 *
 * const handleSubmit = async (data) => {
 *   const expense = await mutate(data);
 *   console.log('Created:', expense);
 *   // Manually refetch expenses list
 * };
 * ```
 */
export function useCreateExpense(): UseMutationResult<
  Expense,
  CreateExpenseInput
> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (input: CreateExpenseInput): Promise<Expense> => {
      try {
        setIsLoading(true);
        setError(null);

        const expense = await createExpense(input);
        return expense;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        logError(error, { input });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

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
