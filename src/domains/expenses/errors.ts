/**
 * Custom Error Classes for Expenses Domain
 *
 * Defines specific error types for better error handling and debugging.
 * Each error type represents a different failure scenario.
 *
 * @module domains/expenses/errors
 */

/**
 * Base error class for all expense-related errors
 * Extends native Error with additional context
 */
export class ExpenseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ExpenseError';

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Thrown when an expense is not found in IndexedDB
 * Use this for 404-like scenarios
 */
export class ExpenseNotFoundError extends ExpenseError {
  constructor(expenseId: string, context?: Record<string, unknown>) {
    super(
      `Expense with ID "${expenseId}" not found`,
      'EXPENSE_NOT_FOUND',
      { expenseId, ...context }
    );
    this.name = 'ExpenseNotFoundError';
  }
}

/**
 * Thrown when expense data fails validation
 * Contains detailed validation errors from Zod
 */
export class ExpenseValidationError extends ExpenseError {
  constructor(
    message: string,
    public readonly validationErrors: Record<string, string[]>,
    context?: Record<string, unknown>
  ) {
    super(
      message,
      'EXPENSE_VALIDATION_ERROR',
      { validationErrors, ...context }
    );
    this.name = 'ExpenseValidationError';
  }

  /**
   * Get validation errors for a specific field
   */
  getFieldErrors(field: string): string[] {
    return this.validationErrors[field] || [];
  }

  /**
   * Check if a specific field has errors
   */
  hasFieldError(field: string): boolean {
    return field in this.validationErrors;
  }

  /**
   * Get all validation error messages as flat array
   */
  getAllErrorMessages(): string[] {
    return Object.values(this.validationErrors).flat();
  }
}

/**
 * Thrown when IndexedDB operations fail
 * Wraps native IndexedDB errors with additional context
 */
export class IndexedDBError extends ExpenseError {
  constructor(
    message: string,
    public readonly operation: 'open' | 'read' | 'write' | 'delete',
    public readonly originalError?: Error,
    context?: Record<string, unknown>
  ) {
    super(
      message,
      'INDEXEDDB_ERROR',
      { operation, originalError: originalError?.message, ...context }
    );
    this.name = 'IndexedDBError';
  }

  /**
   * Check if error is due to quota exceeded
   */
  isQuotaExceeded(): boolean {
    return (
      this.originalError?.name === 'QuotaExceededError' ||
      this.message.includes('quota')
    );
  }

  /**
   * Check if error is due to database being blocked
   */
  isBlocked(): boolean {
    return (
      this.originalError?.name === 'AbortError' ||
      this.message.includes('blocked')
    );
  }

  /**
   * Check if IndexedDB is not supported
   */
  isNotSupported(): boolean {
    return this.message.includes('not supported');
  }
}

/**
 * Thrown when an expense operation is invalid for business logic reasons
 * Example: Trying to delete an expense that doesn't exist
 */
export class ExpenseOperationError extends ExpenseError {
  constructor(
    operation: string,
    reason: string,
    context?: Record<string, unknown>
  ) {
    super(
      `Cannot ${operation}: ${reason}`,
      'EXPENSE_OPERATION_ERROR',
      { operation, reason, ...context }
    );
    this.name = 'ExpenseOperationError';
  }
}

/**
 * Type guard to check if error is an ExpenseError
 */
export function isExpenseError(error: unknown): error is ExpenseError {
  return error instanceof ExpenseError;
}

/**
 * Type guard to check if error is ExpenseNotFoundError
 */
export function isExpenseNotFoundError(
  error: unknown
): error is ExpenseNotFoundError {
  return error instanceof ExpenseNotFoundError;
}

/**
 * Type guard to check if error is ExpenseValidationError
 */
export function isExpenseValidationError(
  error: unknown
): error is ExpenseValidationError {
  return error instanceof ExpenseValidationError;
}

/**
 * Type guard to check if error is IndexedDBError
 */
export function isIndexedDBError(error: unknown): error is IndexedDBError {
  return error instanceof IndexedDBError;
}

/**
 * Convert Zod validation error to ExpenseValidationError
 *
 * @param zodError - Zod validation error
 * @returns ExpenseValidationError instance
 */
export function fromZodError(zodError: {
  issues: Array<{ path: (string | number)[]; message: string }>;
}): ExpenseValidationError {
  const validationErrors: Record<string, string[]> = {};

  for (const issue of zodError.issues) {
    const field = issue.path.join('.');
    if (!validationErrors[field]) {
      validationErrors[field] = [];
    }
    validationErrors[field].push(issue.message);
  }

  return new ExpenseValidationError(
    'Validation failed',
    validationErrors
  );
}

/**
 * Convert any error to a user-friendly message
 * Use this for displaying errors to users
 *
 * @param error - Any error object
 * @returns User-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (isExpenseNotFoundError(error)) {
    return 'El gasto no fue encontrado. Puede haber sido eliminado.';
  }

  if (isExpenseValidationError(error)) {
    const messages = error.getAllErrorMessages();
    return messages.length > 0
      ? messages[0]
      : 'Los datos ingresados no son válidos.';
  }

  if (isIndexedDBError(error)) {
    if (error.isQuotaExceeded()) {
      return 'El almacenamiento está lleno. Por favor, elimina algunos gastos antiguos.';
    }
    if (error.isNotSupported()) {
      return 'Tu navegador no soporta almacenamiento offline.';
    }
    if (error.isBlocked()) {
      return 'La base de datos está bloqueada. Cierra otras pestañas de esta aplicación.';
    }
    return 'Error al acceder al almacenamiento local. Por favor, intenta nuevamente.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';
}

/**
 * Log error to console with structured information
 * Use this for debugging in development
 *
 * @param error - Error to log
 * @param context - Additional context
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  if (isExpenseError(error)) {
    console.error('[ExpenseError]', {
      name: error.name,
      code: error.code,
      message: error.message,
      context: error.context,
      additionalContext: context,
      stack: error.stack,
    });
  } else {
    console.error('[UnknownError]', {
      error,
      context,
    });
  }
}
