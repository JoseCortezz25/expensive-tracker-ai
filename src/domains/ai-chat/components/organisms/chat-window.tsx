/**
 * ChatWindow Organism Component
 *
 * Main floating chat interface with message history and input.
 * Responsive: full-screen on mobile, floating card on desktop.
 *
 * @module domains/ai-chat/components/organisms/chat-window
 */

'use client';

import * as React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useChatStore } from '../../stores/chat-store';
import { MessageList } from '../molecules/message-list';
import { ChatInput } from '../molecules/chat-input';
import { aiChatTextMap } from '../../ai-chat.text-map';

export interface ChatWindowProps {
  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * ChatWindow Component
 *
 * Floating chat interface with AI assistant.
 *
 * @example
 * ```tsx
 * <ChatWindow />
 * ```
 */
export function ChatWindow({ className }: ChatWindowProps) {
  const { closeChat, setLoading } = useChatStore();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [input, setInput] = React.useState('');
  const [showError, setShowError] = React.useState(false);

  const { messages, error, status, sendMessage, regenerate } = useChat({
    onFinish: ({ isError }) => {
      setLoading(false);
      if (isError) {
        setShowError(true);
      }
    },
    onError: () => {
      setLoading(false);
      setShowError(true);
    }
  });

  // // Convert UIMessage[] to Message[]
  // const messages: Message[] = React.useMemo(() => {
  //   return uiMessages.map(msg => ({
  //     id: msg.id,
  //     role: msg.role,
  //     content: msg.parts
  //       .filter(part => part.type === 'text')
  //       .map(part => (part as any).text)
  //       .join(''),
  //     createdAt: new Date()
  //   }));
  // }, [uiMessages]);

  const isLoading = status === 'streaming' || status === 'submitted';

  // Sync loading state
  React.useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  // Show error when it changes
  React.useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    debugger;
    e.preventDefault();

    if (!input.trim() || isLoading) {
      return;
    }

    sendMessage({
      role: 'user',
      parts: [{ type: 'text', text: input }]
    });

    setInput('');
  };

  // Position classes based on device
  const positionClasses = isDesktop
    ? 'fixed bottom-24 right-6 w-[350px] h-[500px] shadow-xl'
    : 'fixed inset-0 w-full h-full';

  // Get user-friendly error message
  const getErrorMessage = (error: Error | null | undefined): string => {
    if (!error) return '';

    const errorMessage = error.message.toLowerCase();

    // API key error
    if (errorMessage.includes('api key') || errorMessage.includes('apikey')) {
      return 'Error de configuración: Verifica tu API key de Google en el archivo .env.local';
    }

    // Rate limit error
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return (
        aiChatTextMap.errorProcessing +
        '. Demasiadas solicitudes, intenta en un momento.'
      );
    }

    // Network error
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }

    // Invalid prompt error
    if (
      errorMessage.includes('invalid prompt') ||
      errorMessage.includes('modelmessage')
    ) {
      return 'Error de formato en el mensaje. Por favor, intenta de nuevo.';
    }

    // Generic error
    return (
      aiChatTextMap.errorProcessing +
      '. ' +
      aiChatTextMap.errorSendingDescription
    );
  };

  return (
    <Card className={cn(positionClasses, 'z-50 flex flex-col', className)}>
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b pb-4">
        <div>
          <CardTitle className="text-base">
            {aiChatTextMap.chatHeading}
          </CardTitle>
          <p className="text-muted-foreground text-xs">
            {aiChatTextMap.chatSubheading}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeChat}
          aria-label={aiChatTextMap.closeChat}
        >
          <X className="size-4" />
        </Button>
      </CardHeader>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
        {/* Message List */}
        <MessageList messages={messages} isLoading={isLoading} />

        {/* Input Area */}
        <div className="border-t p-4">
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}
