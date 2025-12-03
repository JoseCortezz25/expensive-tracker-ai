/**
 * Text Map for AI Chat Domain
 *
 * Centralizes all user-facing text for the AI chat and layout intelligence feature.
 * This ensures consistency and makes future i18n easier.
 *
 * @module domains/ai-chat/ai-chat.text-map
 */

export const aiChatTextMap = {
  // Chat bubble
  chatBubbleLabel: 'Abrir asistente de diseño',
  chatBubbleTooltip: 'Chat con el asistente',
  chatBubbleNewMessage: 'Nuevo mensaje',

  // Chat window header
  chatHeading: 'Asistente de Diseño',
  chatSubheading: 'Personaliza tu dashboard',
  chatAssistantName: 'Asistente',
  chatWindowTitle: 'Layout Intelligence',

  // Chat window actions
  closeChat: 'Cerrar chat',
  minimizeChat: 'Minimizar chat',
  expandChat: 'Expandir chat',
  clearChat: 'Limpiar conversación',
  newConversation: 'Nueva conversación',

  // Input area
  inputPlaceholder: 'Escribe tu mensaje aquí...',
  inputPlaceholderExample: 'Ej: "Mueve las métricas a la izquierda"',
  sendMessage: 'Enviar',
  sendMessageShort: 'Enviar',
  typeMessage: 'Escribe un mensaje',

  // Welcome message
  welcomeMessage: '¡Hola! Soy tu asistente de diseño. Puedo ayudarte a personalizar el layout de tu dashboard.',
  welcomeExamples: 'Prueba preguntarme:',
  welcomeExample1: '"Mueve las métricas a la izquierda"',
  welcomeExample2: '"Haz el gráfico más grande"',
  welcomeExample3: '"Crea un layout de dos columnas"',
  welcomeExample4: '"Resalta las categorías con mayor gasto"',

  // AI status indicators
  aiTyping: 'Asistente está escribiendo...',
  aiThinking: 'Pensando...',
  aiProcessing: 'Procesando tu solicitud...',
  aiReady: 'Listo para ayudarte',
  aiOffline: 'Sin conexión',

  // Message senders
  senderUser: 'Tú',
  senderAI: 'Asistente IA',
  senderSystem: 'Sistema',

  // Message status
  statusSending: 'Enviando...',
  statusSent: 'Enviado',
  statusError: 'Error',

  // Message roles
  roleUser: 'Tú',
  roleAssistant: 'Asistente',
  roleSystem: 'Sistema',

  // Layout suggestions
  suggestionApply: 'Aplicar sugerencia',
  suggestionPreview: 'Vista previa',
  suggestionDismiss: 'Descartar',
  suggestionApplied: 'Sugerencia aplicada',
  suggestionNotAvailable: 'Sugerencia no disponible',

  // Stage 1-2 limitations (suggestions only)
  stage1Message: 'Actualmente puedo sugerirte cambios de layout, pero no aplicarlos automáticamente.',
  stage1Disclaimer: 'Nota: Las sugerencias son solo informativas en esta versión.',
  futureFeature: 'Esta función estará disponible en una futura versión.',

  // Layout modification suggestions
  layoutSuggestionTitle: 'Sugerencia de Layout',
  layoutChangeDetected: 'He identificado un cambio de layout:',
  layoutCurrentConfig: 'Configuración actual',
  layoutProposedConfig: 'Configuración propuesta',
  layoutDescription: 'Descripción del cambio',

  // Common layout patterns (for AI responses)
  layoutTwoColumn: 'Layout de dos columnas',
  layoutSingleColumn: 'Layout de una columna',
  layoutGrid: 'Layout de cuadrícula',
  layoutChartFocused: 'Layout enfocado en gráfico',
  layoutMetricsLeft: 'Métricas a la izquierda',
  layoutMetricsRight: 'Métricas a la derecha',
  layoutMetricsTop: 'Métricas arriba',

  // AI understanding confirmations
  understoodRequest: 'Entiendo que quieres:',
  canHelp: 'Puedo ayudarte con eso.',
  needsClarification: 'Necesito más información:',
  notUnderstood: 'No estoy seguro de entender tu solicitud.',
  tryRephrase: 'Por favor, intenta reformular tu pregunta.',

  // Error messages
  errorSendingMessage: 'Error al enviar mensaje',
  errorSendingDescription: 'No se pudo enviar tu mensaje. Intenta nuevamente.',
  errorLoadingHistory: 'Error al cargar historial',
  errorProcessing: 'Error al procesar solicitud',
  errorGeneric: 'Ocurrió un error inesperado',
  errorRetry: 'Reintentar',

  // Empty states
  noMessages: 'No hay mensajes aún',
  noMessagesDescription: 'Comienza una conversación con el asistente',
  startConversation: 'Iniciar conversación',

  // Loading states
  loadingChat: 'Cargando chat...',
  loadingMessages: 'Cargando mensajes...',
  loadingHistory: 'Cargando historial...',

  // Confirmation dialogs
  clearChatTitle: '¿Limpiar conversación?',
  clearChatDescription: 'Se eliminarán todos los mensajes. Esta acción no se puede deshacer.',
  clearChatConfirm: 'Sí, limpiar',
  clearChatCancel: 'Cancelar',

  // Accessibility labels
  chatWindow: 'Ventana de chat',
  chatBubble: 'Botón de chat',
  messageList: 'Lista de mensajes',
  messageInput: 'Campo de entrada de mensaje',
  sendButton: 'Botón enviar',
  closeButton: 'Botón cerrar',
  userMessage: 'Mensaje del usuario',
  assistantMessage: 'Mensaje del asistente',
  typingIndicator: 'Indicador de escritura',

  // Keyboard shortcuts (if implemented)
  shortcutSend: 'Enter para enviar',
  shortcutNewLine: 'Shift+Enter para nueva línea',
  shortcutClose: 'Esc para cerrar',

  // Time stamps
  justNow: 'Justo ahora',
  minutesAgo: 'hace {minutes} min',
  hoursAgo: 'hace {hours} h',
  yesterday: 'Ayer',
  dateFormat: 'dd/MM/yyyy HH:mm',

  // Success messages
  messageSent: 'Mensaje enviado',
  chatCleared: 'Conversación limpiada',
  suggestionSaved: 'Sugerencia guardada',

  // Context awareness (future Stage 3)
  contextAvailable: 'Tengo acceso a tus datos de gastos',
  contextNotAvailable: 'No tengo acceso a tus datos en este momento',
  analyzingData: 'Analizando tus datos...',
  insightGenerated: 'He encontrado algo interesante:',

  // Limitations and disclaimers
  betaFeature: 'Esta es una función experimental',
  noDataModification: 'No puedo modificar tus datos de gastos',
  layoutOnlySuggestions: 'Solo puedo sugerir cambios de layout',
  privacyNote: 'Tus datos permanecen en tu dispositivo',

  // Help and tips
  helpTitle: '¿Cómo puedo ayudarte?',
  helpTip1: 'Pídeme que reorganice elementos del dashboard',
  helpTip2: 'Pregunta sobre cómo personalizar el layout',
  helpTip3: 'Solicita cambios de tamaño o posición',
  showHelp: 'Mostrar ayuda',
  hideHelp: 'Ocultar ayuda',
} as const;

/**
 * Type-safe text key accessor
 */
export type AiChatTextKey = keyof typeof aiChatTextMap;
