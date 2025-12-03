/**
 * useUpdateExpense Hook
 *
 * Custom hook for updating existing expenses.
 * Manages loading state, errors, and provides mutation function.
 *
 * @module domains/expenses/hooks/use-update-expense
 */

'use client';

import { useState, useCallback } from 'react';
import { updateExpense } from '../actions';
import type { UpdateExpenseInput, Expense, UseMutationResult } from '../types';
import { logError } from '../errors';

/**
 * Input type for update mutation (includes ID)
 */
interface UpdateExpenseVariables {
  id: string;
  input: UpdateExpenseInput;
}

/**
 * Hook for updating existing expenses
 *
 * Provides mutation function with loading and error states.
 * Requires expense ID and partial update data.
 *
 * @returns Mutation result with mutate function, loading state, and error
 *
 * @example
 * ```typescript
 * const { mutate, isLoading, error, reset } = useUpdateExpense();
 *
 * const handleUpdate = async () => {
 *   const updated = await mutate({
 *     id: expense.id,
 *     input: { amount: 50.00 }
 *   });
 *   console.log('Updated:', updated);
 * };
 * ```
 */
export function useUpdateExpense(): UseMutationResult<
  Expense,
  UpdateExpenseVariables
> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: UpdateExpenseVariables): Promise<Expense> => {
      try {
        setIsLoading(true);
        setError(null);

        const expense = await updateExpense(variables.id, variables.input);
        return expense;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);
        logError(error, { variables });
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
