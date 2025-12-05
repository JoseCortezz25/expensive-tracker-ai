/**
 * Expenses Page
 *
 * Full expense management page with filtering, sorting, and CRUD operations.
 * Main view for browsing and managing all expenses.
 *
 * @module app/expenses/page
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ExpenseList } from '@/domains/expenses/components/organisms/expense-list';
import { ExpenseFilters } from '@/domains/expenses/components/organisms/expense-filters';
import { ExpenseFormModal } from '@/domains/expenses/components/organisms/expense-form-modal';
import { useExpenses } from '@/domains/expenses/hooks/use-expenses';
import { useCreateExpense } from '@/domains/expenses/hooks/use-create-expense';
import { useUpdateExpense } from '@/domains/expenses/hooks/use-update-expense';
import { useDeleteExpense } from '@/domains/expenses/hooks/use-delete-expense';
import { useExpenseFilters, useHasActiveFilters } from '@/domains/expenses/hooks/use-expense-filters';
import type { Expense, CreateExpenseInput, UpdateExpenseInput } from '@/domains/expenses/types';
import { expensesTextMap } from '@/domains/expenses/expenses.text-map';
import { toast } from 'sonner';

/**
 * Expenses Page Component
 */
export default function ExpensesPage() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);
  const [filtersOpen, setFiltersOpen] = React.useState(false);

  // Filters state
  const {
    selectedCategories,
    dateRange,
    searchQuery,
    sort,
    setSelectedCategories,
    setDateRange,
    setSearchQuery,
    setSort,
    resetFilters,
  } = useExpenseFilters();

  const hasActiveFilters = useHasActiveFilters();

  // Fetch expenses with filters
  const { expenses, isLoading, error, refetch, totalCount, hasMore } = useExpenses({
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    dateFrom: dateRange?.from?.toISOString(),
    dateTo: dateRange?.to?.toISOString(),
    searchQuery: searchQuery || undefined,
    sortBy: sort.field,
    sortOrder: sort.order,
    limit: 20,
  });

  // Mutations
  const { mutate: createExpense, isLoading: isCreating } = useCreateExpense();
  const { mutate: updateExpense, isLoading: isUpdating } = useUpdateExpense();
  const { mutate: deleteExpense, isLoading: isDeleting } = useDeleteExpense();

  // Handle create expense
  const handleCreateExpense = async (data: CreateExpenseInput) => {
    try {
      await createExpense(data);
      toast.success(expensesTextMap.expenseCreated);
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error(expensesTextMap.errorSaving);
    }
  };

  // Handle update expense
  const handleUpdateExpense = async (data: UpdateExpenseInput) => {
    if (!editingExpense) return;

    try {
      await updateExpense({ id: editingExpense.id, input: data });
      toast.success(expensesTextMap.expenseUpdated);
      setEditingExpense(null);
      refetch();
    } catch (error) {
      console.error('Error updating expense:', error);
      toast.error(expensesTextMap.errorSaving);
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async (expense: Expense) => {
    if (!confirm(expensesTextMap.deleteConfirmDescription)) {
      return;
    }

    try {
      await deleteExpense(expense.id);
      toast.success(expensesTextMap.expenseDeleted);
      refetch();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error(expensesTextMap.errorDeleting);
    }
  };

  // Handle edit expense
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
  };

  return (
    <div className="container mx-auto space-y-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{expensesTextMap.heading}</h1>
          <p className="text-muted-foreground">{expensesTextMap.subheading}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            {expensesTextMap.backToDashboard}
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>{expensesTextMap.addExpense}</Button>
        </div>
      </div>

      {/* Filters + List */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop Filters (Sidebar) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-4">
            <h2 className="font-semibold">{expensesTextMap.filterButton || 'Filtros'}</h2>
            <ExpenseFilters
              selectedCategories={selectedCategories}
              dateRange={dateRange}
              searchQuery={searchQuery}
              sort={sort}
              onCategoriesChange={setSelectedCategories}
              onDateRangeChange={setDateRange}
              onSearchQueryChange={setSearchQuery}
              onSortChange={setSort}
              onResetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
              variant="full"
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-4">
          {/* Mobile Filters (Sheet) */}
          <div className="lg:hidden">
            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  {expensesTextMap.filterButton || 'Filtros'}
                  {hasActiveFilters && ' •'}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>{expensesTextMap.filterButton || 'Filtros'}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ExpenseFilters
                    selectedCategories={selectedCategories}
                    dateRange={dateRange}
                    searchQuery={searchQuery}
                    sort={sort}
                    onCategoriesChange={setSelectedCategories}
                    onDateRangeChange={setDateRange}
                    onSearchQueryChange={setSearchQuery}
                    onSortChange={setSort}
                    onResetFilters={resetFilters}
                    hasActiveFilters={hasActiveFilters}
                    variant="full"
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Expense List */}
          <ExpenseList
            expenses={expenses}
            isLoading={isLoading}
            error={error}
            hasMore={hasMore}
            totalCount={totalCount}
            onLoadMore={() => {
              // Future: Implement pagination
              console.log('Load more');
            }}
            onExpenseEdit={handleEditExpense}
            onExpenseDelete={handleDeleteExpense}
            onRetry={refetch}
          />
        </main>
      </div>

      {/* Add Expense Modal */}
      <ExpenseFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode="create"
        onSubmit={handleCreateExpense}
        isLoading={isCreating}
      />

      {/* Edit Expense Modal */}
      {editingExpense && (
        <ExpenseFormModal
          open={true}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          mode="edit"
          initialData={editingExpense}
          onSubmit={handleUpdateExpense}
          isLoading={isUpdating}
        />
      )}
    </div>
  );
}
