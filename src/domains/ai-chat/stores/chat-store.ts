/**
 * Chat Store
 *
 * Zustand store for managing AI chat state (UI only, session-only persistence).
 * Controls chat window visibility, message history, loading states, and errors.
 *
 * @module domains/ai-chat/stores/chat-store
 */

'use client';

import { create } from 'zustand';
import type { ChatStore, ChatMessage } from '../types';

/**
 * Initial chat state
 */
const initialState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,
  input: '',
};

/**
 * Chat store hook
 *
 * Manages chat UI state including window visibility, messages, and loading states.
 * Messages are session-only (not persisted to IndexedDB).
 *
 * @example
 * ```tsx
 * const { isOpen, messages, openChat, addMessage } = useChatStore();
 *
 * // Open chat
 * openChat();
 *
 * // Add message
 * addMessage({
 *   id: '1',
 *   role: 'user',
 *   content: 'Hello',
 *   createdAt: new Date(),
 * });
 * ```
 */
export const useChatStore = create<ChatStore>((set) => ({
  ...initialState,

  /**
   * Open chat window
   */
  openChat: () =>
    set({
      isOpen: true,
    }),

  /**
   * Close chat window
   */
  closeChat: () =>
    set({
      isOpen: false,
    }),

  /**
   * Toggle chat window
   */
  toggleChat: () =>
    set((state) => ({
      isOpen: !state.isOpen,
    })),

  /**
   * Add message to history
   */
  addMessage: (message: ChatMessage) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  /**
   * Clear all messages
   */
  clearMessages: () =>
    set({
      messages: [],
      error: null,
    }),

  /**
   * Set loading state
   */
  setLoading: (isLoading: boolean) =>
    set({
      isLoading,
    }),

  /**
   * Set error message
   */
  setError: (error: string | null) =>
    set({
      error,
      isLoading: false,
    }),

  /**
   * Set input value
   */
  setInput: (input: string) =>
    set({
      input,
    }),

  /**
   * Reset chat state
   */
  reset: () =>
    set(initialState),
}));

/**
 * Selector hooks for optimized re-renders
 */

/**
 * Get chat open state
 */
export const useIsChatOpen = () => useChatStore((state) => state.isOpen);

/**
 * Get messages
 */
export const useChatMessages = () => useChatStore((state) => state.messages);

/**
 * Get loading state
 */
export const useIsChatLoading = () => useChatStore((state) => state.isLoading);

/**
 * Get error state
 */
export const useChatError = () => useChatStore((state) => state.error);

/**
 * Get input value
 */
export const useChatInput = () => useChatStore((state) => state.input);

/**
 * Get chat actions
 */
export const useChatActions = () =>
  useChatStore((state) => ({
    openChat: state.openChat,
    closeChat: state.closeChat,
    toggleChat: state.toggleChat,
    addMessage: state.addMessage,
    clearMessages: state.clearMessages,
    setLoading: state.setLoading,
    setError: state.setError,
    setInput: state.setInput,
    reset: state.reset,
  }));
