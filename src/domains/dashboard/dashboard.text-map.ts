/**
 * Text Map for Dashboard Domain
 *
 * Centralizes all user-facing text for the dashboard feature.
 * This ensures consistency and makes future i18n easier.
 *
 * @module domains/dashboard/dashboard.text-map
 */

export const dashboardTextMap = {
  // Page heading
  heading: 'Dashboard',
  subheading: 'Resumen de tus finanzas',
  welcome: 'Bienvenido',
  welcomeBack: 'Bienvenido de nuevo',

  // Navigation
  viewExpenses: 'Ver gastos',
  viewAllExpenses: 'Ver todos los gastos',
  addExpense: 'Agregar gasto',

  // Metrics panel heading
  metricsHeading: 'Métricas del mes',
  metricsSubheading: 'Resumen financiero actual',

  // Metric labels
  totalSpent: 'Total gastado',
  totalSpentThisMonth: 'Total gastado este mes',
  averageDailySpending: 'Promedio diario',
  averageDailySpendingFull: 'Gasto promedio diario',
  topCategory: 'Categoría principal',
  topSpendingCategory: 'Categoría con más gastos',
  transactionCount: 'Transacciones',
  transactionCountFull: 'Número de transacciones',

  // Metric descriptions (for tooltips/help text)
  totalSpentDescription: 'Suma de todos tus gastos del mes actual',
  averageDailyDescription: 'Promedio de gasto por día en el mes',
  topCategoryDescription: 'Categoría donde más has gastado este mes',
  transactionCountDescription: 'Cantidad de gastos registrados este mes',

  // Metric values when empty
  noData: 'Sin datos',
  noExpenses: 'Sin gastos',
  noCategory: 'Ninguna',
  zeroTransactions: '0 transacciones',

  // Chart section
  chartHeading: 'Visualización de gastos',
  chartSubheading: 'Análisis de tus gastos',
  chartNoData: 'No hay datos para mostrar',
  chartLoading: 'Cargando gráfico...',
  chartError: 'Error al cargar gráfico',

  // Chart controls
  groupByDay: 'Por día',
  groupByCategory: 'Por categoría',
  groupByLabel: 'Agrupar por',
  chartTypeLabel: 'Tipo de gráfico',
  barChart: 'Gráfico de barras',
  lineChart: 'Gráfico de líneas',
  pieChart: 'Gráfico circular',

  // Chart labels
  chartXAxisDay: 'Día del mes',
  chartXAxisCategory: 'Categoría',
  chartYAxisAmount: 'Monto ($)',
  chartLegendAmount: 'Monto',
  chartLegendTotal: 'Total',

  // Recent expenses section
  recentHeading: 'Gastos recientes',
  recentSubheading: 'Últimas transacciones',
  recentNoExpenses: 'No hay gastos recientes',
  recentNoExpensesDescription: 'Tus gastos aparecerán aquí',
  recentViewAll: 'Ver todos',
  recentShowMore: 'Mostrar más',
  recentShowLess: 'Mostrar menos',

  // Time periods
  thisMonth: 'Este mes',
  lastMonth: 'Mes pasado',
  thisYear: 'Este año',
  last30Days: 'Últimos 30 días',
  last7Days: 'Últimos 7 días',
  today: 'Hoy',
  yesterday: 'Ayer',

  // Loading states
  loadingMetrics: 'Cargando métricas...',
  loadingChart: 'Cargando gráfico...',
  loadingRecentExpenses: 'Cargando gastos recientes...',
  calculating: 'Calculando...',

  // Error states
  errorLoadingMetrics: 'Error al cargar métricas',
  errorLoadingMetricsDescription: 'No se pudieron cargar las métricas. Intenta recargar la página.',
  errorLoadingChart: 'Error al cargar gráfico',
  errorLoadingChartDescription: 'No se pudo cargar el gráfico. Intenta nuevamente.',
  errorLoadingRecent: 'Error al cargar gastos recientes',
  errorLoadingRecentDescription: 'No se pudieron cargar los gastos recientes.',

  // Empty state - first time user
  emptyStateHeading: '¡Comienza a rastrear tus gastos!',
  emptyStateDescription: 'Agrega tu primer gasto para ver métricas y análisis.',
  emptyStateAction: 'Agregar primer gasto',

  // Empty state - no expenses this month
  noExpensesThisMonthHeading: 'No hay gastos este mes',
  noExpensesThisMonthDescription: 'Comienza agregando un nuevo gasto.',
  noExpensesThisMonthAction: 'Agregar gasto',

  // Accessibility labels
  metricsPanel: 'Panel de métricas',
  metricCard: 'Tarjeta de métrica',
  chartContainer: 'Contenedor de gráfico',
  recentExpensesList: 'Lista de gastos recientes',
  addExpenseButton: 'Botón para agregar gasto',
  viewAllButton: 'Botón para ver todos los gastos',
  chartControls: 'Controles del gráfico',

  // Currency formatting
  currencySymbol: '$',
  currencyFormat: '$ {amount}',
  currencyFormatShort: '${amount}',

  // Number formatting
  transactionSingular: 'transacción',
  transactionPlural: 'transacciones',

  // Date formatting
  dateFormat: 'dd/MM/yyyy',
  monthFormat: 'MMMM',
  monthYearFormat: 'MMMM yyyy',
  shortDateFormat: 'dd/MM',

  // Refresh/reload
  refresh: 'Actualizar',
  refreshMetrics: 'Actualizar métricas',
  lastUpdated: 'Última actualización',
  autoRefresh: 'Actualización automática',

  // Filters (if dashboard has filters)
  filterByMonth: 'Filtrar por mes',
  currentMonth: 'Mes actual',
  selectMonth: 'Seleccionar mes',

  // Tooltips
  tooltipTotalSpent: 'Suma total de gastos en el mes actual',
  tooltipAvgDaily: 'Promedio calculado: Total ÷ días transcurridos del mes',
  tooltipTopCategory: 'Categoría con el monto total más alto',
  tooltipTransactionCount: 'Cantidad de gastos registrados',
} as const;

/**
 * Type-safe text key accessor
 */
export type DashboardTextKey = keyof typeof dashboardTextMap;
