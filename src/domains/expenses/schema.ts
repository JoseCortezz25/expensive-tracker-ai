/**
 * Zod Validation Schemas for Expenses Domain
 *
 * Defines validation rules for expense data according to business requirements.
 * Schemas are shared between client-side validation and data persistence.
 *
 * @module domains/expenses/schema
 */

import { z } from 'zod';
import { EXPENSE_CATEGORIES, type ExpenseCategory } from './types';

/**
 * Category enum schema
 * Validates that category is one of the predefined values
 */
export const expenseCategorySchema = z.enum([
  'Comida',
  'Transporte',
  'Entretenimiento',
  'Salud',
  'Compras',
  'Servicios',
  'Otros',
]);

/**
 * Description field validation
 * Business rules:
 * - Required
 * - Minimum 3 characters
 * - Maximum 200 characters
 * - Cannot be only whitespace
 */
const descriptionSchema = z
  .string({ message: 'La descripción es obligatoria' })
  .min(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  .max(200, { message: 'La descripción no puede exceder 200 caracteres' })
  .trim()
  .refine((val) => val.length > 0, {
    message: 'La descripción no puede estar vacía',
  });

/**
 * Amount field validation
 * Business rules:
 * - Required
 * - Must be positive (> 0)
 * - Maximum 2 decimal places
 * - Maximum value: 999,999,999.99
 */
const amountSchema = z
  .number({ message: 'El monto es obligatorio' })
  .positive({ message: 'El monto debe ser mayor a 0' })
  .max(999_999_999.99, { message: 'El monto excede el límite permitido' })
  .refine((val) => {
    // Check for max 2 decimal places
    const decimalPlaces = (val.toString().split('.')[1] || '').length;
    return decimalPlaces <= 2;
  }, { message: 'El monto debe tener máximo 2 decimales' });

/**
 * Date field validation
 * Business rules:
 * - Required
 * - Must be valid ISO 8601 date string
 * - Cannot be in the future
 * - Cannot be before year 1900
 */
const dateSchema = z
  .string({ message: 'La fecha es obligatoria' })
  .refine(
    (val) => {
      try {
        const date = new Date(val);
        return !isNaN(date.getTime());
      } catch {
        return false;
      }
    },
    { message: 'Selecciona una fecha válida' }
  )
  .refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();
      return date <= now;
    },
    { message: 'La fecha no puede ser futura' }
  )
  .refine(
    (val) => {
      const date = new Date(val);
      const minDate = new Date('1900-01-01');
      return date >= minDate;
    },
    { message: 'La fecha no puede ser anterior a 1900' }
  );

/**
 * Complete expense schema (for full entity)
 * Includes all fields including auto-generated ones
 */
export const expenseSchema = z.object({
  id: z.string().uuid('ID debe ser un UUID válido'),
  description: descriptionSchema,
  amount: amountSchema,
  category: expenseCategorySchema,
  date: dateSchema,
  createdAt: z.string().datetime('createdAt debe ser fecha ISO 8601'),
  updatedAt: z.string().datetime('updatedAt debe ser fecha ISO 8601'),
});

/**
 * Schema for creating a new expense
 * Omits auto-generated fields (id, createdAt, updatedAt)
 */
export const createExpenseSchema = z.object({
  description: descriptionSchema,
  amount: amountSchema,
  category: expenseCategorySchema,
  date: dateSchema,
});

/**
 * Schema for updating an existing expense
 * All fields are optional (partial update)
 */
export const updateExpenseSchema = z
  .object({
    description: descriptionSchema.optional(),
    amount: amountSchema.optional(),
    category: expenseCategorySchema.optional(),
    date: dateSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes proporcionar al menos un campo para actualizar',
  });

/**
 * Schema for expense filters
 * All fields are optional
 */
export const expenseFiltersSchema = z.object({
  categories: z.array(expenseCategorySchema).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  searchQuery: z.string().optional(),
  sortBy: z.enum(['date', 'amount', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

/**
 * Type inference from schemas
 * These types automatically match the schema definitions
 */
export type ExpenseSchemaType = z.infer<typeof expenseSchema>;
export type CreateExpenseSchemaType = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseSchemaType = z.infer<typeof updateExpenseSchema>;
export type ExpenseFiltersSchemaType = z.infer<typeof expenseFiltersSchema>;

/**
 * Helper function to validate expense data
 * Returns parsed data or throws validation error
 *
 * @param data - Data to validate
 * @returns Validated and parsed data
 * @throws {z.ZodError} If validation fails
 */
export function validateExpense(data: unknown): ExpenseSchemaType {
  return expenseSchema.parse(data);
}

/**
 * Helper function to validate create expense input
 * Returns parsed data or throws validation error
 *
 * @param data - Data to validate
 * @returns Validated and parsed data
 * @throws {z.ZodError} If validation fails
 */
export function validateCreateExpense(data: unknown): CreateExpenseSchemaType {
  return createExpenseSchema.parse(data);
}

/**
 * Helper function to validate update expense input
 * Returns parsed data or throws validation error
 *
 * @param data - Data to validate
 * @returns Validated and parsed data
 * @throws {z.ZodError} If validation fails
 */
export function validateUpdateExpense(data: unknown): UpdateExpenseSchemaType {
  return updateExpenseSchema.parse(data);
}

/**
 * Safe validation that returns result object instead of throwing
 *
 * @param data - Data to validate
 * @returns Result object with success flag and data or error
 */
export function safeValidateExpense(data: unknown) {
  return expenseSchema.safeParse(data);
}

/**
 * Safe validation for create expense input
 *
 * @param data - Data to validate
 * @returns Result object with success flag and data or error
 */
export function safeValidateCreateExpense(data: unknown) {
  return createExpenseSchema.safeParse(data);
}

/**
 * Safe validation for update expense input
 *
 * @param data - Data to validate
 * @returns Result object with success flag and data or error
 */
export function safeValidateUpdateExpense(data: unknown) {
  return updateExpenseSchema.safeParse(data);
}
