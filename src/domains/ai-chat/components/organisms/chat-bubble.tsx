/**
 * ChatBubble Organism Component
 *
 * Floating action button that opens the AI chat interface.
 * Positioned bottom-right, toggles chat window visibility.
 *
 * @module domains/ai-chat/components/organisms/chat-bubble
 */

'use client';

import * as React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatStore } from '../../stores/chat-store';
import { ChatWindow } from './chat-window';
import { aiChatTextMap } from '../../ai-chat.text-map';

export interface ChatBubbleProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ChatBubble Component
 *
 * Floating button that opens AI chat interface.
 *
 * @example
 * ```tsx
 * <ChatBubble />
 * ```
 */
export function ChatBubble({ className }: ChatBubbleProps) {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <Button
          size="icon"
          className={cn(
            'fixed bottom-6 right-6 z-50 size-14 rounded-full shadow-lg transition-transform hover:scale-110',
            className
          )}
          onClick={toggleChat}
          aria-label={aiChatTextMap.chatBubbleLabel}
        >
          <MessageSquare className="size-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && <ChatWindow />}
    </>
  );
}
