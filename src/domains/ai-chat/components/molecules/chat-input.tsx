/**
 * ChatInput Molecule Component
 *
 * Message input with send button for AI chat.
 * Features auto-resize textarea and keyboard shortcuts.
 *
 * @module domains/ai-chat/components/molecules/chat-input
 */

'use client';

import * as React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { aiChatTextMap } from '../../ai-chat.text-map';

export interface ChatInputProps {
  /**
   * Input value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;

  /**
   * Submit handler
   */
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Maximum character limit
   * @default 500
   */
  maxLength?: number;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ChatInput Component
 *
 * Text input for chat messages with send button.
 *
 * @example
 * ```tsx
 * <ChatInput
 *   value={input}
 *   onChange={handleInputChange}
 *   onSubmit={handleSubmit}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isLoading = false,
  placeholder,
  maxLength = 500,
  className,
}: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to calculate new height
    textarea.style.height = 'auto';

    // Set new height (max 4 lines ~96px)
    const newHeight = Math.min(textarea.scrollHeight, 96);
    textarea.style.height = `${newHeight}px`;
  }, [value]);

  // Handle Enter key (submit on Enter, new line on Shift+Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled && !isLoading) {
        // Trigger form submit
        const form = e.currentTarget.form;
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  const isDisabled = disabled || isLoading;
  const isEmpty = !value.trim();
  const characterCount = value.length;
  const isOverLimit = characterCount > maxLength;

  return (
    <form onSubmit={onSubmit} className={cn('flex flex-col gap-2', className)}>
      <div className="flex gap-2">
        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || aiChatTextMap.inputPlaceholder}
          disabled={isDisabled}
          maxLength={maxLength}
          rows={1}
          className="min-h-[40px] max-h-24 resize-none"
          aria-label={aiChatTextMap.messageInput}
        />

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          disabled={isDisabled || isEmpty || isOverLimit}
          aria-label={aiChatTextMap.sendMessage}
        >
          <Send className="size-4" />
        </Button>
      </div>

      {/* Character Count */}
      {characterCount > maxLength * 0.8 && (
        <div className="flex justify-end px-1">
          <span
            className={cn(
              'text-xs',
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            )}
          >
            {characterCount}/{maxLength}
          </span>
        </div>
      )}

      {/* Keyboard Shortcut Hint */}
      {!isLoading && (
        <div className="px-1 text-xs text-muted-foreground">
          {aiChatTextMap.shortcutSend}
        </div>
      )}
    </form>
  );
}
