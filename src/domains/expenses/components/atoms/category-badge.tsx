/**
 * CategoryBadge Atom Component
 *
 * Displays an expense category with color-coded badge.
 * Wraps shadcn Badge component with category-specific styling.
 *
 * @module domains/expenses/components/atoms/category-badge
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ExpenseCategory } from '../../types';
import { expensesTextMap } from '../../expenses.text-map';

export interface CategoryBadgeProps {
  /**
   * Expense category
   */
  category: ExpenseCategory;

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Show category icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Click handler
   */
  onClick?: () => void;
}

/**
 * Category configuration with colors and icons
 */
const categoryConfig: Record<
  ExpenseCategory,
  {
    label: string;
    colors: string;
    icon: string;
  }
> = {
  Comida: {
    label: expensesTextMap.categoryComida,
    colors: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
    icon: '🍕',
  },
  Transporte: {
    label: expensesTextMap.categoryTransporte,
    colors: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    icon: '🚗',
  },
  Entretenimiento: {
    label: expensesTextMap.categoryEntretenimiento,
    colors: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    icon: '🎮',
  },
  Salud: {
    label: expensesTextMap.categorySalud,
    colors: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    icon: '🏥',
  },
  Compras: {
    label: expensesTextMap.categoryCompras,
    colors: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    icon: '🛍️',
  },
  Servicios: {
    label: expensesTextMap.categoryServicios,
    colors: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400',
    icon: '💼',
  },
  Otros: {
    label: expensesTextMap.categoryOtros,
    colors: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    icon: '📦',
  },
};

/**
 * Get size classes
 */
function getSizeClasses(size: CategoryBadgeProps['size']): string {
  switch (size) {
    case 'sm':
      return 'text-xs px-2 py-0.5';
    case 'md':
      return 'text-sm px-2.5 py-1';
    case 'lg':
      return 'text-base px-3 py-1.5';
    default:
      return 'text-sm px-2.5 py-1';
  }
}

/**
 * CategoryBadge Component
 *
 * Renders a color-coded badge for expense categories.
 *
 * @example
 * ```tsx
 * <CategoryBadge category="Comida" />
 * // Output: 🍕 Comida (orange badge)
 *
 * <CategoryBadge category="Transporte" size="sm" showIcon={false} />
 * // Output: Transporte (small blue badge, no icon)
 *
 * <CategoryBadge category="Salud" onClick={() => console.log('clicked')} />
 * // Output: 🏥 Salud (clickable green badge)
 * ```
 */
export function CategoryBadge({
  category,
  size = 'md',
  showIcon = true,
  className,
  onClick,
}: CategoryBadgeProps) {
  const config = categoryConfig[category];

  return (
    <Badge
      variant="secondary"
      className={cn(
        'inline-flex items-center gap-1 font-medium transition-colors',
        config.colors,
        getSizeClasses(size),
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {showIcon && <span className="text-base leading-none">{config.icon}</span>}
      <span>{config.label}</span>
    </Badge>
  );
}

/**
 * Compact category badge without icon
 * Useful for dense layouts
 */
export function CompactCategoryBadge({
  category,
  className,
}: Pick<CategoryBadgeProps, 'category' | 'className'>) {
  return <CategoryBadge category={category} size="sm" showIcon={false} className={className} />;
}

/**
 * Category icon only (no text)
 * Useful for very compact displays
 */
export function CategoryIcon({
  category,
  className,
}: Pick<CategoryBadgeProps, 'category' | 'className'>) {
  const config = categoryConfig[category];

  return (
    <span
      className={cn('inline-flex text-lg leading-none', className)}
      title={config.label}
      aria-label={config.label}
    >
      {config.icon}
    </span>
  );
}

/**
 * Get category color classes (for custom implementations)
 */
export function getCategoryColors(category: ExpenseCategory): string {
  return categoryConfig[category].colors;
}

/**
 * Get category label (localized)
 */
export function getCategoryLabel(category: ExpenseCategory): string {
  return categoryConfig[category].label;
}

/**
 * Get category icon emoji
 */
export function getCategoryIcon(category: ExpenseCategory): string {
  return categoryConfig[category].icon;
}
