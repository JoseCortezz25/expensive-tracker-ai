/**
 * Text Map for Expenses Domain
 *
 * Centralizes all user-facing text for the expenses feature.
 * This ensures consistency and makes future i18n easier.
 *
 * @module domains/expenses/expenses.text-map
 */

export const expensesTextMap = {
  // Page heading and navigation
  heading: 'Gastos',
  subheading: 'Gestiona y revisa tus gastos',
  backToDashboard: 'Volver al Dashboard',
  viewAll: 'Ver todos',

  // Actions
  addExpense: 'Agregar Gasto',
  addExpenseShort: 'Agregar',
  editExpense: 'Editar Gasto',
  deleteExpense: 'Eliminar Gasto',
  saveExpense: 'Guardar',
  cancel: 'Cancelar',
  clearFilters: 'Limpiar Filtros',
  apply: 'Aplicar',
  loadMore: 'Cargar más',
  retry: 'Reintentar',

  // Form labels
  descriptionLabel: 'Descripción',
  amountLabel: 'Monto',
  categoryLabel: 'Categoría',
  dateLabel: 'Fecha',

  // Form placeholders
  descriptionPlaceholder: 'Ej: Almuerzo en restaurante',
  amountPlaceholder: '0.00',
  categoryPlaceholder: 'Selecciona una categoría',
  datePlaceholder: 'Selecciona una fecha',
  searchPlaceholder: 'Buscar gastos...',

  // Form help text
  descriptionHelp: 'Describe brevemente este gasto',
  amountHelp: 'Monto en tu moneda local',
  categoryHelp: 'Categoría del gasto',
  dateHelp: 'Fecha en que realizaste el gasto',

  // Validation errors
  descriptionRequired: 'La descripción es obligatoria',
  descriptionMinLength: 'La descripción debe tener al menos 3 caracteres',
  descriptionMaxLength: 'La descripción no puede exceder 200 caracteres',
  amountRequired: 'El monto es obligatorio',
  amountPositive: 'El monto debe ser mayor a 0',
  amountInvalid: 'Ingresa un monto válido',
  categoryRequired: 'La categoría es obligatoria',
  categoryInvalid: 'Selecciona una categoría válida',
  dateRequired: 'La fecha es obligatoria',
  dateInvalid: 'Selecciona una fecha válida',
  dateFuture: 'La fecha no puede ser futura',

  // Categories (matching PROJECT.md requirements)
  categoryComida: 'Comida',
  categoryTransporte: 'Transporte',
  categoryEntretenimiento: 'Entretenimiento',
  categorySalud: 'Salud',
  categoryCompras: 'Compras',
  categoryServicios: 'Servicios',
  categoryOtros: 'Otros',

  // Category short names (for badges/chips)
  categoryComidaShort: 'Comida',
  categoryTransporteShort: 'Transporte',
  categoryEntretenimientoShort: 'Entretenim.',
  categorySaludShort: 'Salud',
  categoryComprasShort: 'Compras',
  categoryServiciosShort: 'Servicios',
  categoryOtrosShort: 'Otros',

  // Filter labels
  filterByCategory: 'Filtrar por categoría',
  filterByDateRange: 'Filtrar por rango de fechas',
  searchByDescription: 'Buscar por descripción',
  allCategories: 'Todas las categorías',
  dateFrom: 'Desde',
  dateTo: 'Hasta',

  // Sorting
  sortBy: 'Ordenar por',
  sortByDateDesc: 'Fecha (más recientes)',
  sortByDateAsc: 'Fecha (más antiguos)',
  sortByAmountDesc: 'Monto (mayor a menor)',
  sortByAmountAsc: 'Monto (menor a mayor)',

  // Empty states
  noExpenses: 'No hay gastos registrados',
  noExpensesDescription: 'Comienza agregando tu primer gasto',
  noExpensesFiltered: 'No se encontraron gastos',
  noExpensesFilteredDescription: 'Intenta ajustar tus filtros',
  noExpensesThisMonth: 'No hay gastos este mes',
  noExpensesThisYear: 'No hay gastos este año',

  // Loading states
  loadingExpenses: 'Cargando gastos...',
  savingExpense: 'Guardando...',
  deletingExpense: 'Eliminando...',
  processing: 'Procesando...',

  // Error states
  errorLoading: 'Error al cargar gastos',
  errorLoadingDescription: 'No se pudieron cargar tus gastos. Por favor, intenta nuevamente.',
  errorSaving: 'Error al guardar',
  errorSavingDescription: 'No se pudo guardar el gasto. Verifica los datos e intenta nuevamente.',
  errorDeleting: 'Error al eliminar',
  errorDeletingDescription: 'No se pudo eliminar el gasto. Por favor, intenta nuevamente.',
  errorGeneric: 'Ocurrió un error',
  errorGenericDescription: 'Algo salió mal. Por favor, intenta nuevamente.',

  // Success feedback
  expenseCreated: 'Gasto creado exitosamente',
  expenseUpdated: 'Gasto actualizado exitosamente',
  expenseDeleted: 'Gasto eliminado exitosamente',

  // Confirmation dialogs
  deleteConfirmTitle: '¿Eliminar gasto?',
  deleteConfirmDescription:
    'Esta acción no se puede deshacer. El gasto será eliminado permanentemente.',
  deleteConfirmButton: 'Sí, eliminar',
  deleteConfirmCancel: 'Cancelar',

  cancelFormTitle: '¿Descartar cambios?',
  cancelFormDescription: 'Tienes cambios sin guardar que se perderán.',
  cancelFormButton: 'Descartar',
  cancelFormCancel: 'Continuar editando',

  // Pagination
  showingResults: 'Mostrando {count} gastos',
  showingResultsFiltered: 'Mostrando {count} de {total} gastos',
  loadingMore: 'Cargando más gastos...',
  noMoreResults: 'No hay más gastos para mostrar',

  // Accessibility labels
  expenseCard: 'Tarjeta de gasto',
  expenseDetails: 'Detalles del gasto',
  editButton: 'Editar gasto',
  deleteButton: 'Eliminar gasto',
  filterButton: 'Filtros',
  searchInput: 'Buscar gastos',
  categorySelect: 'Seleccionar categoría',
  datePickerButton: 'Seleccionar fecha',
  closeModal: 'Cerrar',
  openFilters: 'Abrir filtros',
  closeFilters: 'Cerrar filtros',

  // Date formatting (context for date-fns)
  dateFormat: 'dd/MM/yyyy',
  dateTimeFormat: 'dd/MM/yyyy HH:mm',
  dateRangeFormat: 'dd MMM',
  monthYearFormat: 'MMMM yyyy',

  // Currency formatting
  currencySymbol: '$',
  currencyFormat: '$ {amount}',

  // Expense card
  expenseAmount: 'Monto',
  expenseCategory: 'Categoría',
  expenseDate: 'Fecha',
  expenseDescription: 'Descripción',
} as const;

/**
 * Type-safe text key accessor
 */
export type ExpensesTextKey = keyof typeof expensesTextMap;
