/**
 * AI Chat Domain Types
 *
 * Type definitions for the AI chat and layout intelligence system.
 * Includes message types, layout suggestions, and chat state.
 *
 * @module domains/ai-chat/types
 */

/**
 * Chat message role
 */
export type ChatMessageRole = 'user' | 'assistant' | 'system';

/**
 * Chat message interface
 */
export interface ChatMessage {
  /**
   * Message ID (unique identifier)
   */
  id: string;

  /**
   * Message role
   */
  role: ChatMessageRole;

  /**
   * Message content
   */
  content: string;

  /**
   * Message timestamp
   */
  createdAt?: Date;

  /**
   * Optional metadata
   */
  metadata?: {
    /**
     * Layout suggestion (if AI detected a layout request)
     */
    layoutSuggestion?: LayoutSuggestion;

    /**
     * Error flag
     */
    error?: boolean;

    /**
     * Loading state
     */
    isLoading?: boolean;
  };
}

/**
 * Layout suggestion from AI
 */
export interface LayoutSuggestion {
  /**
   * Suggestion title
   */
  title: string;

  /**
   * Detailed description
   */
  description: string;

  /**
   * Layout configuration (JSON object)
   */
  config: Record<string, any>;

  /**
   * Whether preview is available (Stage 3)
   */
  previewAvailable: boolean;

  /**
   * Suggested layout pattern
   */
  pattern?:
    | 'two-column'
    | 'single-column'
    | 'grid'
    | 'chart-focused'
    | 'metrics-left'
    | 'metrics-right'
    | 'metrics-top'
    | 'custom';
}

/**
 * Chat state interface
 */
export interface ChatState {
  /**
   * Chat window open/close state
   */
  isOpen: boolean;

  /**
   * Message history (session-only)
   */
  messages: ChatMessage[];

  /**
   * Loading state (AI is processing)
   */
  isLoading: boolean;

  /**
   * Error message
   */
  error: string | null;

  /**
   * Input value (controlled input)
   */
  input: string;
}

/**
 * Chat store actions
 */
export interface ChatActions {
  /**
   * Open chat window
   */
  openChat: () => void;

  /**
   * Close chat window
   */
  closeChat: () => void;

  /**
   * Toggle chat window
   */
  toggleChat: () => void;

  /**
   * Add message to history
   */
  addMessage: (message: ChatMessage) => void;

  /**
   * Clear all messages
   */
  clearMessages: () => void;

  /**
   * Set loading state
   */
  setLoading: (isLoading: boolean) => void;

  /**
   * Set error message
   */
  setError: (error: string | null) => void;

  /**
   * Set input value
   */
  setInput: (input: string) => void;

  /**
   * Reset chat state
   */
  reset: () => void;
}

/**
 * Complete chat store type
 */
export type ChatStore = ChatState & ChatActions;

/**
 * Layout pattern type
 */
export type LayoutPattern =
  | 'two-column'
  | 'single-column'
  | 'grid'
  | 'chart-focused'
  | 'metrics-left'
  | 'metrics-right'
  | 'metrics-top'
  | 'custom';

/**
 * Layout request detection result
 */
export interface LayoutRequestDetection {
  /**
   * Whether a layout request was detected
   */
  isLayoutRequest: boolean;

  /**
   * Detected pattern (if any)
   */
  pattern?: LayoutPattern;

  /**
   * Confidence score (0-1)
   */
  confidence?: number;

  /**
   * Extracted keywords
   */
  keywords?: string[];
}
