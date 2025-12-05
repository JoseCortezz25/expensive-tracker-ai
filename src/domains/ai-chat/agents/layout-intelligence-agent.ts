/**
 * Layout Intelligence Agent
 *
 * System prompt and rule-based parser for dashboard layout modifications.
 * Stage 1-2: Provides suggestions only, cannot execute changes.
 *
 * @module domains/ai-chat/agents/layout-intelligence-agent
 */

import type { LayoutSuggestion, LayoutRequestDetection, LayoutPattern } from '../types';

/**
 * System prompt for Layout Intelligence Agent
 *
 * Provides context about the dashboard and instructions for responding
 * to layout modification requests.
 */
export const LAYOUT_AGENT_SYSTEM_PROMPT = `Eres un Asistente de Diseño especializado en personalizar dashboards de seguimiento de gastos.

## Tu Rol

Ayudas a los usuarios a personalizar el layout de su dashboard mediante sugerencias claras y estructuradas.

## Contexto del Dashboard

El dashboard contiene estos componentes:

1. **Panel de Métricas** (4 tarjetas):
   - Total gastado este mes
   - Promedio diario de gasto
   - Categoría con mayor gasto
   - Cantidad de transacciones

2. **Gráfico de Gastos**:
   - Visualización de gastos por día o por categoría
   - Tipos: gráfico de barras, líneas o circular

3. **Lista de Gastos Recientes**:
   - Muestra los últimos 5-10 gastos
   - Incluye: descripción, monto, categoría, fecha

## Patrones de Layout Disponibles

Puedes sugerir estos layouts:

- **Dos columnas**: Métricas a un lado, gráfico al otro
- **Una columna**: Todo apilado verticalmente (móvil)
- **Cuadrícula**: Métricas en grid 2x2, gráfico abajo
- **Enfocado en gráfico**: Gráfico grande, métricas compactas
- **Variaciones de posición**: Métricas arriba/izquierda/derecha

## Limitación Importante (Stage 1-2)

⚠️ Actualmente solo puedes **sugerir** cambios de layout. No puedes aplicarlos automáticamente.

Cuando un usuario solicite un cambio:
1. Reconoce su solicitud con empatía
2. Describe el layout sugerido claramente
3. Explica los beneficios del cambio
4. Clarifica que en esta versión solo proporcionas sugerencias

## Ejemplos de Respuestas

**Usuario**: "Mueve las métricas a la izquierda"
**Tú**: "¡Claro! Te sugiero un layout de dos columnas donde:
- Las 4 tarjetas de métricas se ubican en la columna izquierda (40% del ancho)
- El gráfico de gastos ocupa la columna derecha (60% del ancho)
- La lista de gastos recientes permanece abajo en ancho completo

Este diseño te permitirá ver tus métricas clave mientras exploras el gráfico.

Nota: Actualmente proporciono sugerencias. En futuras versiones podrás aplicar estos cambios automáticamente."

**Usuario**: "¿Cuánto gasté este mes?"
**Tú**: "Según las métricas de tu dashboard, este mes has gastado [monto]. Tu promedio diario es [promedio] y la categoría donde más gastas es [categoría].

¿Te gustaría que te ayude a reorganizar el dashboard para resaltar esta información?"

## Instrucciones de Respuesta

- Responde SIEMPRE en español
- Sé conciso (máximo 150 palabras)
- Usa un tono amigable y profesional
- Si no entiendes la solicitud, pide clarificación
- Si la solicitud no es sobre layout, responde de manera útil pero redirige al tema
- Nunca inventes datos de gastos (si el usuario pregunta por montos, indica que debe revisar su dashboard)

## Preguntas Frecuentes

**"¿Puedes aplicar este cambio?"** → Explica la limitación Stage 1-2 amablemente
**"¿Por qué no se aplica?"** → Esta es una función experimental, en desarrollo
**"¿Cuándo estará disponible?"** → En futuras versiones (Stage 3)

Recuerda: Tu objetivo es ser útil, claro y honesto sobre las capacidades actuales.`;

/**
 * Layout patterns with keywords for detection
 */
const layoutPatterns: Array<{
  pattern: LayoutPattern;
  keywords: string[];
  title: string;
  description: string;
}> = [
  {
    pattern: 'two-column',
    keywords: ['dos columnas', '2 columnas', 'columnas', 'lado a lado', 'dividir'],
    title: 'Layout de dos columnas',
    description: 'Organiza el dashboard en dos columnas con métricas y gráfico lado a lado',
  },
  {
    pattern: 'metrics-left',
    keywords: ['métricas izquierda', 'métricas a la izquierda', 'izquierda', 'left'],
    title: 'Métricas a la izquierda',
    description: 'Coloca las tarjetas de métricas en el lado izquierdo del dashboard',
  },
  {
    pattern: 'metrics-right',
    keywords: ['métricas derecha', 'métricas a la derecha', 'derecha', 'right'],
    title: 'Métricas a la derecha',
    description: 'Coloca las tarjetas de métricas en el lado derecho del dashboard',
  },
  {
    pattern: 'metrics-top',
    keywords: ['métricas arriba', 'métricas encima', 'arriba', 'top'],
    title: 'Métricas arriba',
    description: 'Coloca las tarjetas de métricas en la parte superior (layout tradicional)',
  },
  {
    pattern: 'chart-focused',
    keywords: [
      'gráfico grande',
      'gráfico más grande',
      'agrandar gráfico',
      'expandir gráfico',
      'enfoque gráfico',
      'destacar gráfico',
    ],
    title: 'Layout enfocado en gráfico',
    description: 'Prioriza el gráfico haciéndolo más grande, con métricas compactas',
  },
  {
    pattern: 'grid',
    keywords: ['cuadrícula', 'grid', 'rejilla', '2x2', 'mosaico'],
    title: 'Layout en cuadrícula',
    description: 'Organiza las métricas en una cuadrícula 2x2 con el gráfico debajo',
  },
  {
    pattern: 'single-column',
    keywords: ['una columna', 'vertical', 'apilado', 'simple', 'móvil'],
    title: 'Layout de una columna',
    description: 'Apila todos los elementos verticalmente (ideal para móvil)',
  },
];

/**
 * Parse user message to detect layout requests
 *
 * Uses simple keyword matching to identify common layout patterns.
 * Returns detection result with confidence score.
 *
 * @param userMessage - User's message text
 * @returns Layout request detection result
 *
 * @example
 * ```ts
 * const result = parseLayoutRequest('Mueve las métricas a la izquierda');
 * // { isLayoutRequest: true, pattern: 'metrics-left', confidence: 0.9 }
 * ```
 */
export function parseLayoutRequest(userMessage: string): LayoutRequestDetection {
  const message = userMessage.toLowerCase().trim();

  // Check for layout-related keywords
  const layoutKeywords = [
    'layout',
    'diseño',
    'organizar',
    'mover',
    'cambiar',
    'posición',
    'ubicar',
    'colocar',
    'reorganizar',
    'distribuir',
  ];

  const hasLayoutKeyword = layoutKeywords.some((keyword) => message.includes(keyword));

  // Try to match specific patterns
  for (const patternDef of layoutPatterns) {
    const matchedKeywords = patternDef.keywords.filter((keyword) =>
      message.includes(keyword.toLowerCase())
    );

    if (matchedKeywords.length > 0) {
      const confidence = Math.min(0.9, 0.6 + matchedKeywords.length * 0.15);

      return {
        isLayoutRequest: true,
        pattern: patternDef.pattern,
        confidence,
        keywords: matchedKeywords,
      };
    }
  }

  // Generic layout request without specific pattern
  if (hasLayoutKeyword) {
    return {
      isLayoutRequest: true,
      confidence: 0.5,
      keywords: layoutKeywords.filter((kw) => message.includes(kw)),
    };
  }

  // Not a layout request
  return {
    isLayoutRequest: false,
  };
}

/**
 * Generate layout suggestion based on detected pattern
 *
 * Creates a structured layout suggestion with configuration details.
 *
 * @param pattern - Detected layout pattern
 * @returns Layout suggestion object
 *
 * @example
 * ```ts
 * const suggestion = generateLayoutSuggestion('metrics-left');
 * // Returns structured suggestion with title, description, config
 * ```
 */
export function generateLayoutSuggestion(pattern: LayoutPattern): LayoutSuggestion {
  const patternDef = layoutPatterns.find((p) => p.pattern === pattern);

  if (!patternDef) {
    return {
      title: 'Layout personalizado',
      description: 'Configuración de layout personalizada',
      config: { pattern: 'custom' },
      previewAvailable: false,
      pattern: 'custom',
    };
  }

  // Generate configuration based on pattern
  const configs: Record<LayoutPattern, Record<string, any>> = {
    'two-column': {
      layout: 'two-column',
      columns: [
        { component: 'metrics', width: '40%' },
        { component: 'chart', width: '60%' },
      ],
    },
    'metrics-left': {
      layout: 'two-column',
      metricsPosition: 'left',
      metricsWidth: '35%',
      chartWidth: '65%',
    },
    'metrics-right': {
      layout: 'two-column',
      metricsPosition: 'right',
      metricsWidth: '35%',
      chartWidth: '65%',
    },
    'metrics-top': {
      layout: 'single-column',
      order: ['metrics', 'chart', 'recent-expenses'],
    },
    'chart-focused': {
      layout: 'chart-priority',
      chartHeight: '500px',
      metricsSize: 'compact',
    },
    grid: {
      layout: 'grid',
      metricsGrid: '2x2',
      chartPosition: 'below',
    },
    'single-column': {
      layout: 'single-column',
      stack: 'vertical',
    },
    custom: {
      layout: 'custom',
    },
  };

  return {
    title: patternDef.title,
    description: patternDef.description,
    config: configs[pattern],
    previewAvailable: false, // Stage 1-2: no preview
    pattern,
  };
}

/**
 * Get all available layout patterns
 *
 * @returns Array of available layout patterns with metadata
 */
export function getAvailablePatterns() {
  return layoutPatterns.map((p) => ({
    pattern: p.pattern,
    title: p.title,
    description: p.description,
  }));
}
