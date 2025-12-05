/**
 * MessageList Molecule Component
 *
 * Scrollable list of chat messages with auto-scroll behavior.
 * Renders MessageBubble components for each message.
 *
 * @module domains/ai-chat/components/molecules/message-list
 */

'use client';

import * as React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { MessageBubble, MessageBubbleSkeleton } from './message-bubble';
import { aiChatTextMap } from '../../ai-chat.text-map';
import { UIMessage } from 'ai';
import { MessageAssistant } from './message-assistant';
import { MessageUser } from './message-user';

export interface MessageListProps {
  /**
   * Array of messages
   */
  messages: UIMessage[];

  /**
   * Loading state (AI is generating response)
   * @default false
   */
  isLoading?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

export function MessageList({
  messages,
  isLoading = false,
  className
}: MessageListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Empty state
  if (messages.length === 0 && !isLoading) {
    return (
      <div
        className={cn(
          'flex flex-1 items-center justify-center bg-amber-100 p-8',
          className
        )}
      >
        <div className="text-center">
          <p className="text-muted-foreground text-sm font-medium">
            {aiChatTextMap.noMessages}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">
            {aiChatTextMap.noMessagesDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className={cn('flex-1', className)}>
      <div
        ref={scrollRef}
        className="flex max-h-[400px] flex-col gap-4 overflow-y-auto p-4"
      >
        {messages.map(message => {
          const isAssistant = message.role === 'assistant';

          if (isAssistant) {
            return (
              <MessageAssistant
                key={message.id}
                message={message}
                parts={message.parts}
                onReload={() => {}}
                onShowCanvas={() => {}}
              />
            );
          }

          return (
            <MessageUser
              key={message.id}
              message={message}
              onEdit={() => {}} // TODO: Implement edit
              onReload={() => {}}
              onDelete={() => {}}
            />
          );
        })}

        {/* Loading indicator */}
        {isLoading && <MessageBubble content="" sender="ai" isLoading />}
      </div>
    </ScrollArea>
  );
}
