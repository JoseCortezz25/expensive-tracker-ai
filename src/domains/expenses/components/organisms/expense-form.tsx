/**
 * ExpenseForm Organism Component
 *
 * Complete form for creating and editing expenses.
 * Uses React Hook Form with Zod validation.
 *
 * @module domains/expenses/components/organisms/expense-form
 */

'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import type { Expense, CreateExpenseInput, UpdateExpenseInput, ExpenseCategory } from '../../types';
import { createExpenseSchema, updateExpenseSchema } from '../../schema';
import { EXPENSE_CATEGORIES } from '../../types';
import { CategoryBadge, getCategoryIconComponent } from '../atoms/category-badge';
import { ExpenseDatePicker } from '../molecules/date-picker';
import { expensesTextMap } from '../../expenses.text-map';

export interface ExpenseFormProps {
  /**
   * Initial expense data (for editing)
   */
  initialData?: Expense;

  /**
   * Form mode
   * @default 'create'
   */
  mode?: 'create' | 'edit';

  /**
   * Submit handler
   */
  onSubmit: (data: CreateExpenseInput | UpdateExpenseInput) => void | Promise<void>;

  /**
   * Cancel handler
   */
  onCancel?: () => void;

  /**
   * Loading state (during submission)
   * @default false
   */
  isLoading?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Form data type
 */
type ExpenseFormData = {
  description: string;
  amount: string; // String for input, converted to number on submit
  category: ExpenseCategory;
  date: Date;
};

/**
 * Get default form values
 */
function getDefaultValues(initialData?: Expense): ExpenseFormData {
  if (initialData) {
    return {
      description: initialData.description,
      amount: initialData.amount.toString(),
      category: initialData.category,
      date: new Date(initialData.date),
    };
  }

  return {
    description: '',
    amount: '',
    category: 'Otros',
    date: new Date(),
  };
}

/**
 * ExpenseForm Component
 *
 * Complete form for creating/editing expenses with validation.
 *
 * @example
 * ```tsx
 * // Create mode
 * <ExpenseForm
 *   mode="create"
 *   onSubmit={async (data) => {
 *     await createExpense(data);
 *   }}
 *   onCancel={() => setShowForm(false)}
 * />
 *
 * // Edit mode
 * <ExpenseForm
 *   mode="edit"
 *   initialData={expense}
 *   onSubmit={async (data) => {
 *     await updateExpense(expense.id, data);
 *   }}
 *   isLoading={isUpdating}
 * />
 * ```
 */
export function ExpenseForm({
  initialData,
  mode = 'create',
  onSubmit,
  onCancel,
  isLoading = false,
  disabled = false,
  className,
}: ExpenseFormProps) {
  // Create a custom schema for form validation that accepts string for amount
  const formSchema = mode === 'create' ? createExpenseSchema : updateExpenseSchema;

  const form = useForm<ExpenseFormData>({
    defaultValues: getDefaultValues(initialData),
    mode: 'onBlur',
  });

  const { handleSubmit, control, formState, setValue, watch } = form;
  const { errors, isDirty, isSubmitting } = formState;

  // Watch amount for real-time formatting
  const amountValue = watch('amount');

  // Handle form submission
  const onSubmitHandler = async (data: ExpenseFormData) => {
    try {
      // Convert amount string to number
      const amount = parseFloat(data.amount);

      if (isNaN(amount)) {
        form.setError('amount', {
          type: 'manual',
          message: expensesTextMap.amountInvalid,
        });
        return;
      }

      // Convert date to ISO string
      const date = data.date.toISOString();

      const submitData: CreateExpenseInput | UpdateExpenseInput = {
        description: data.description,
        amount,
        category: data.category,
        date,
      };

      await onSubmit(submitData);

      // Reset form on successful create
      if (mode === 'create') {
        form.reset();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  // Handle cancel with confirmation if dirty
  const handleCancel = () => {
    if (isDirty && !confirm(expensesTextMap.cancelFormDescription)) {
      return;
    }
    onCancel?.();
  };

  const isFormDisabled = disabled || isLoading || isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmitHandler)} className={cn('space-y-6', className)}>
        {/* Description Field */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{expensesTextMap.descriptionLabel}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={expensesTextMap.descriptionPlaceholder}
                  disabled={isFormDisabled}
                  autoFocus
                  maxLength={200}
                />
              </FormControl>
              <FormDescription>{expensesTextMap.descriptionHelp}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount Field */}
        <FormField
          control={control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{expensesTextMap.amountLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999999.99"
                    placeholder={expensesTextMap.amountPlaceholder}
                    disabled={isFormDisabled}
                    className="pl-7"
                    onWheel={(e) => e.currentTarget.blur()} // Prevent scroll changing value
                  />
                </div>
              </FormControl>
              <FormDescription>{expensesTextMap.amountHelp}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Field */}
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{expensesTextMap.categoryLabel}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isFormDisabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={expensesTextMap.categoryPlaceholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((category) => {
                    const Icon = getCategoryIconComponent(category);
                    return (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" />
                          <span>{expensesTextMap[`category${category}` as keyof typeof expensesTextMap]}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormDescription>{expensesTextMap.categoryHelp}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Field */}
        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{expensesTextMap.dateLabel}</FormLabel>
              <FormControl>
                <ExpenseDatePicker
                  date={field.value}
                  onDateChange={(date) => {
                    if (date) {
                      field.onChange(date);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>{expensesTextMap.dateHelp}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isFormDisabled}
            >
              {expensesTextMap.cancel}
            </Button>
          )}
          <Button type="submit" disabled={isFormDisabled}>
            {isLoading || isSubmitting ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                {expensesTextMap.savingExpense}
              </>
            ) : (
              expensesTextMap.saveExpense
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
