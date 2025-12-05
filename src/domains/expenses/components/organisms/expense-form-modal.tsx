/**
 * ExpenseFormModal Organism Component
 *
 * Responsive modal wrapper for ExpenseForm.
 * Uses Dialog on desktop and Drawer on mobile.
 *
 * @module domains/expenses/components/organisms/expense-form-modal
 */

'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ExpenseForm } from './expense-form';
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from '../../types';
import { expensesTextMap } from '../../expenses.text-map';

export interface ExpenseFormModalPropsBase {
  /**
   * Modal open state
   */
  open: boolean;

  /**
   * Open state change handler
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Loading state (during submission)
   * @default false
   */
  isLoading?: boolean;
}

export interface ExpenseFormModalCreateProps extends ExpenseFormModalPropsBase {
  /**
   * Form mode
   */
  mode: 'create';

  /**
   * Initial expense data (not used in create mode)
   */
  initialData?: never;

  /**
   * Submit handler for create
   */
  onSubmit: (data: CreateExpenseInput) => void | Promise<void>;
}

export interface ExpenseFormModalEditProps extends ExpenseFormModalPropsBase {
  /**
   * Form mode
   */
  mode: 'edit';

  /**
   * Initial expense data (required in edit mode)
   */
  initialData: Expense;

  /**
   * Submit handler for edit
   */
  onSubmit: (data: UpdateExpenseInput) => void | Promise<void>;
}

export type ExpenseFormModalProps = ExpenseFormModalCreateProps | ExpenseFormModalEditProps;

/**
 * ExpenseFormModal Component
 *
 * Responsive modal that shows ExpenseForm.
 * Automatically switches between Dialog (desktop) and Drawer (mobile).
 *
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * const { mutate, isLoading } = useCreateExpense();
 *
 * <ExpenseFormModal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   mode="create"
 *   onSubmit={async (data) => {
 *     await mutate(data);
 *     setIsOpen(false);
 *   }}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function ExpenseFormModal({
  open,
  onOpenChange,
  initialData,
  mode = 'create',
  onSubmit,
  isLoading = false,
}: ExpenseFormModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const title = mode === 'create' ? expensesTextMap.addExpense : expensesTextMap.editExpense;
  const description =
    mode === 'create'
      ? expensesTextMap.addExpenseDescription || 'Registra un nuevo gasto'
      : expensesTextMap.editExpenseDescription || 'Modifica los detalles del gasto';

  const handleSubmit = async (data: CreateExpenseInput | UpdateExpenseInput) => {
    // Type assertion based on mode
    if (mode === 'create') {
      await (onSubmit as (data: CreateExpenseInput) => void | Promise<void>)(data as CreateExpenseInput);
    } else {
      await (onSubmit as (data: UpdateExpenseInput) => void | Promise<void>)(data as UpdateExpenseInput);
    }
    // Close modal on successful submit
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Desktop: Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <ExpenseForm
            initialData={initialData}
            mode={mode}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: Drawer
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <ExpenseForm
            initialData={initialData}
            mode={mode}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
