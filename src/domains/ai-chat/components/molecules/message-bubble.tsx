/**
 * MessageBubble Molecule Component
 *
 * Displays a chat message bubble with sender, content, and timestamp.
 * Used in the AI chat interface.
 *
 * @module domains/ai-chat/components/molecules/message-bubble
 */

'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { aiChatTextMap } from '../../ai-chat.text-map';

export interface MessageBubbleProps {
  /**
   * Message content
   */
  content: string;

  /**
   * Message sender
   * @default 'user'
   */
  sender: 'user' | 'ai' | 'system';

  /**
   * Message timestamp
   */
  timestamp?: Date | string;

  /**
   * Show timestamp
   * @default false
   */
  showTimestamp?: boolean;

  /**
   * Message status
   */
  status?: 'sending' | 'sent' | 'error';

  /**
   * Loading state (for streaming responses)
   * @default false
   */
  isLoading?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Format timestamp
 */
function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return formatDistanceToNow(date, { addSuffix: true, locale: es });
}

/**
 * Get sender configuration
 */
function getSenderConfig(sender: MessageBubbleProps['sender']) {
  switch (sender) {
    case 'user':
      return {
        label: aiChatTextMap.senderUser || 'Tú',
        bgColor: 'bg-primary text-primary-foreground',
        alignment: 'ml-auto',
        avatar: '👤',
      };
    case 'ai':
      return {
        label: aiChatTextMap.senderAI || 'Asistente IA',
        bgColor: 'bg-secondary text-secondary-foreground',
        alignment: 'mr-auto',
        avatar: '🤖',
      };
    case 'system':
      return {
        label: aiChatTextMap.senderSystem || 'Sistema',
        bgColor: 'bg-muted text-muted-foreground',
        alignment: 'mx-auto',
        avatar: 'ℹ️',
      };
    default:
      return {
        label: 'Unknown',
        bgColor: 'bg-muted text-muted-foreground',
        alignment: 'mx-auto',
        avatar: '❓',
      };
  }
}

/**
 * Status indicator
 */
function StatusIndicator({ status }: { status: MessageBubbleProps['status'] }) {
  if (!status) return null;

  switch (status) {
    case 'sending':
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-spin"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          <span>{aiChatTextMap.statusSending || 'Enviando...'}</span>
        </div>
      );

    case 'sent':
      return (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      );

    case 'error':
      return (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <span>{aiChatTextMap.statusError || 'Error'}</span>
        </div>
      );

    default:
      return null;
  }
}

/**
 * Loading dots animation
 */
function LoadingDots() {
  return (
    <div className="flex gap-1">
      <div className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <div className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <div className="size-2 animate-bounce rounded-full bg-current" />
    </div>
  );
}

/**
 * MessageBubble Component
 *
 * Renders a chat message bubble with sender styling.
 *
 * @example
 * ```tsx
 * <MessageBubble
 *   content="¿Cuánto gasté este mes?"
 *   sender="user"
 *   timestamp={new Date()}
 *   showTimestamp
 * />
 *
 * <MessageBubble
 *   content="Gastaste $5,250 este mes."
 *   sender="ai"
 *   timestamp={new Date()}
 *   status="sent"
 * />
 *
 * <MessageBubble
 *   content=""
 *   sender="ai"
 *   isLoading
 * />
 * ```
 */
export function MessageBubble({
  content,
  sender,
  timestamp,
  showTimestamp = false,
  status,
  isLoading = false,
  className,
}: MessageBubbleProps) {
  const config = getSenderConfig(sender);

  if (isLoading) {
    return (
      <div
        className={cn(
          'flex max-w-[80%] flex-col gap-1',
          config.alignment,
          className
        )}
      >
        <div
          className={cn(
            'rounded-2xl px-4 py-3 shadow-sm',
            config.bgColor
          )}
        >
          <LoadingDots />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex max-w-[80%] flex-col gap-1',
        config.alignment,
        className
      )}
    >
      {/* Sender Label (only for AI and system messages) */}
      {sender !== 'user' && (
        <div className="flex items-center gap-1.5 px-2 text-xs font-medium text-muted-foreground">
          <span>{config.avatar}</span>
          <span>{config.label}</span>
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          'rounded-2xl px-4 py-3 shadow-sm',
          config.bgColor,
          sender === 'user' && 'rounded-tr-sm',
          sender === 'ai' && 'rounded-tl-sm'
        )}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {content}
        </p>
      </div>

      {/* Timestamp & Status */}
      {(showTimestamp || status) && (
        <div className="flex items-center gap-2 px-2">
          {showTimestamp && timestamp && (
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(timestamp)}
            </span>
          )}
          <StatusIndicator status={status} />
        </div>
      )}
    </div>
  );
}

/**
 * MessageBubble Skeleton (loading state)
 */
export function MessageBubbleSkeleton({
  sender = 'ai',
  className,
}: Pick<MessageBubbleProps, 'sender' | 'className'>) {
  const config = getSenderConfig(sender);

  return (
    <div
      className={cn(
        'flex max-w-[80%] flex-col gap-1',
        config.alignment,
        className
      )}
    >
      {sender !== 'user' && (
        <Skeleton className="h-4 w-24" />
      )}
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  );
}

/**
 * System message variant
 * Centered, muted styling
 */
export function SystemMessage({
  content,
  className,
}: Pick<MessageBubbleProps, 'content' | 'className'>) {
  return (
    <div className={cn('flex justify-center', className)}>
      <div className="max-w-[80%] rounded-full bg-muted px-4 py-2 text-center">
        <p className="text-xs text-muted-foreground">{content}</p>
      </div>
    </div>
  );
}
