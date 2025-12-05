/**
 * Dashboard Page
 *
 * Main dashboard showing metrics, recent expenses, and quick actions.
 * Displays overview of financial data with interactive components.
 *
 * @module app/dashboard/page
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DashboardMetrics } from '@/domains/dashboard/components/organisms/dashboard-metrics';
import { RecentExpensesList } from '@/domains/dashboard/components/organisms/recent-expenses-list';
import { ExpenseFormModal } from '@/domains/expenses/components/organisms/expense-form-modal';
import { useExpenses } from '@/domains/expenses/hooks/use-expenses';
import { useCreateExpense } from '@/domains/expenses/hooks/use-create-expense';
import type { CreateExpenseInput, ExpenseCategory } from '@/domains/expenses/types';
import { getCategoryIconComponent } from '@/domains/expenses/components/atoms/category-badge';
import { dashboardTextMap } from '@/domains/dashboard/dashboard.text-map';
import { toast } from 'sonner';

/**
 * Calculate dashboard metrics from expenses
 */
function calculateMetrics(expenses: Array<{ amount: number; category: string; date: string }>) {
  if (expenses.length === 0) {
    return {
      totalSpent: 0,
      averageDaily: 0,
      topCategory: null,
      transactionCount: 0,
    };
  }

  // Total spent
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Transaction count
  const transactionCount = expenses.length;

  // Average daily (based on current month)
  const now = new Date();
  const daysInMonth = now.getDate(); // Days elapsed in current month
  const averageDaily = totalSpent / Math.max(daysInMonth, 1);

  // Top category
  const categoryTotals = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const topCategoryEntry = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];
  const topCategory = topCategoryEntry
    ? {
        name: topCategoryEntry[0],
        amount: topCategoryEntry[1],
        Icon: getCategoryIconComponent(topCategoryEntry[0] as ExpenseCategory),
      }
    : null;

  return {
    totalSpent,
    averageDaily,
    topCategory,
    transactionCount,
  };
}

/**
 * Dashboard Page Component
 */
export default function DashboardPage() {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  // Fetch current month expenses
  const filters = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return {
      dateFrom: new Date(currentYear, currentMonth, 1).toISOString(),
      dateTo: new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999).toISOString(),
      sortBy: 'date' as const,
      sortOrder: 'desc' as const,
      limit: 100, // Get all for metrics calculation
    };
  }, []);

  const { expenses, isLoading, error, refetch } = useExpenses(filters);

  const { mutate: createExpense, isLoading: isCreating } = useCreateExpense();

  // Calculate metrics
  const metricsData = React.useMemo(() => calculateMetrics(expenses), [expenses]);

  // Get recent expenses (last 5)
  const recentExpenses = expenses.slice(0, 5);

  // Handle create expense
  const handleCreateExpense = async (data: CreateExpenseInput) => {
    try {
      await createExpense(data);
      toast.success(dashboardTextMap.expenseCreated || 'Gasto creado exitosamente');
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating expense:', error);
      toast.error(dashboardTextMap.errorCreatingExpense || 'Error al crear el gasto');
    }
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dashboardTextMap.heading}</h1>
          <p className="text-muted-foreground">{dashboardTextMap.subheading}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push('/expenses')}>
            {dashboardTextMap.viewExpenses || 'Ver gastos'}
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            {dashboardTextMap.addExpense || 'Agregar gasto'}
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <DashboardMetrics data={metricsData} isLoading={isLoading} error={error} />

      {/* Recent Expenses */}
      <RecentExpensesList
        expenses={recentExpenses}
        isLoading={isLoading}
        limit={5}
        onViewAll={() => router.push('/expenses')}
        onExpenseClick={(expense) => {
          // Future: Open expense details modal
          console.log('View expense:', expense.id);
        }}
      />

      {/* Add Expense Modal */}
      <ExpenseFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode="create"
        onSubmit={handleCreateExpense}
        isLoading={isCreating}
      />
    </div>
  );
}
