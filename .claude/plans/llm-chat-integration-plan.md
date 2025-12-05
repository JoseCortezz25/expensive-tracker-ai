# AI Chat Integration - LLM Implementation Plan

**Created**: 2025-12-04
**Session**: `session_expense_tracker_20251202`
**Complexity**: Medium
**Agent**: LLM Integration Architect

---

## 1. Overview

This plan defines the implementation of a floating AI chat interface for the Expense Tracker application using Vercel AI SDK. The chat enables users to interact with a Layout Intelligence Agent that provides suggestions for dashboard customization (Stage 1-2) and answers questions about their expenses.

**Value Proposition**:
- Natural language interaction for layout customization
- Conversational interface for expense insights
- Seamless integration with existing offline-first architecture
- Streaming responses for better UX

**Current State**:
- ✅ MessageBubble component exists (needs emoji replacement)
- ✅ Text map complete (`ai-chat.text-map.ts`)
- ❌ Chat UI components incomplete
- ❌ AI SDK integration missing
- ❌ API route not created
- ❌ State management not implemented

---

## 2. Model & Provider Strategy

### Model Selection
**Primary Model**: `claude-3-5-sonnet-20241022` (Anthropic)
- Reasoning: Excellent at structured outputs, conversational, follows instructions
- Context window: 200k tokens
- Streaming support: ✅
- Cost-effective for chat interactions

**Fallback Model**: `gpt-4-turbo` (OpenAI)
- Use if Anthropic unavailable
- Similar capabilities, broader availability

### Provider Configuration
```typescript
// Provider: @ai-sdk/anthropic or @ai-sdk/openai
import { anthropic } from '@ai-sdk/anthropic';
import { createAnthropic } from '@ai-sdk/anthropic';

const model = anthropic('claude-3-5-sonnet-20241022');
```

### Streaming Strategy
- **ALWAYS** use streaming for UI responses (`.stream()` or `streamText()`)
- Stream partial responses to MessageList in real-time
- Display typing indicator while waiting for first token
- Handle stream cancellation on component unmount

### Parameters
```typescript
{
  model: 'claude-3-5-sonnet-20241022',
  maxTokens: 1000, // Limit response length for cost control
  temperature: 0.7, // Balanced creativity
  topP: 0.9,
  stream: true, // REQUIRED
}
```

---

## 3. Files to Create

### 3.1 Core AI Integration

#### `src/app/api/chat/route.ts`
**Purpose**: Next.js Route Handler for streaming chat responses
**Dependencies**: `ai` SDK, Anthropic provider
**Functionality**:
- Accepts POST requests with message array
- Streams AI responses using `streamText()`
- Returns `AIStreamResponse`
- Error handling with try-catch
- Rate limiting (basic)

```typescript
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    messages,
    system: LAYOUT_AGENT_SYSTEM_PROMPT,
    maxTokens: 1000,
    temperature: 0.7,
  });

  return result.toDataStreamResponse();
}
```

#### `src/domains/ai-chat/types.ts`
**Purpose**: TypeScript types for chat domain
**Exports**:
- `ChatMessage` interface
- `LayoutSuggestion` interface
- `ChatState` interface
- `AgentResponse` type

```typescript
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    layoutSuggestion?: LayoutSuggestion;
    error?: boolean;
  };
}

export interface LayoutSuggestion {
  title: string;
  description: string;
  config: Record<string, any>;
  previewAvailable: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}
```

#### `src/domains/ai-chat/stores/chat-store.ts`
**Purpose**: Zustand store for chat UI state
**State**:
- `isOpen`: boolean (chat window visibility)
- `messages`: ChatMessage[] (session-only, not persisted)
- `isLoading`: boolean
- `error`: string | null

**Actions**:
- `openChat()`: Set isOpen to true
- `closeChat()`: Set isOpen to false
- `toggleChat()`: Toggle isOpen
- `addMessage(message)`: Append to messages array
- `clearMessages()`: Reset messages to []
- `setLoading(value)`: Update loading state
- `setError(message)`: Set error message

#### `src/domains/ai-chat/agents/layout-intelligence-agent.ts`
**Purpose**: System prompt and rule-based layout parser (Stage 1-2)
**Exports**:
- `LAYOUT_AGENT_SYSTEM_PROMPT`: string (detailed instructions for AI)
- `parseLayoutRequest()`: Simple pattern matching for common requests
- `layoutPatterns`: Array of recognized patterns

```typescript
export const LAYOUT_AGENT_SYSTEM_PROMPT = `
You are a Layout Intelligence Agent for an expense tracking application.

Your role is to:
1. Understand user requests for dashboard layout changes
2. Provide clear, structured suggestions for layout modifications
3. Answer questions about expense data in a friendly manner
4. IMPORTANT: You can only SUGGEST changes, not execute them (Stage 1-2)

Dashboard components available:
- Metrics Panel (4 cards: total spent, average daily, top category, transaction count)
- Expense Chart (visualization of expenses by day or category)
- Recent Expenses List (last 5-10 expenses)

Common layout patterns you can suggest:
- Two-column layout (metrics left/right, chart opposite)
- Single-column layout (stacked vertically)
- Grid layout (metrics in 2x2 grid)
- Chart-focused layout (chart large, metrics compact)

When user asks for layout changes:
1. Acknowledge the request
2. Describe the suggested layout
3. Explain benefits
4. Clarify that you cannot apply changes automatically yet

Keep responses concise and friendly. Always respond in Spanish.
`;

export function parseLayoutRequest(userMessage: string): LayoutSuggestion | null {
  const message = userMessage.toLowerCase();

  // Pattern matching for common requests
  if (message.includes('dos columnas') || message.includes('2 columnas')) {
    return {
      title: 'Layout de dos columnas',
      description: 'Organizar el dashboard en dos columnas: métricas a la izquierda, gráfico a la derecha',
      config: { layout: 'two-column', metricsPosition: 'left' },
      previewAvailable: false,
    };
  }

  // Add more patterns...

  return null;
}
```

### 3.2 UI Components

#### `src/domains/ai-chat/components/organisms/chat-bubble.tsx`
**Purpose**: Floating button that opens chat
**Features**:
- Fixed position bottom-right (20px from edges)
- MessageSquare icon from lucide-react
- Notification badge if new suggestions available
- Click handler to toggle chat window
- Accessible (ARIA labels, keyboard navigation)
- High z-index (z-50)

#### `src/domains/ai-chat/components/organisms/chat-window.tsx`
**Purpose**: Main chat interface
**Features**:
- Floating card positioned above chat bubble
- Header: title + close button
- Body: MessageList with scroll
- Footer: ChatInput
- Uses `useChat` hook from AI SDK
- Handles streaming responses
- Auto-scroll to bottom on new messages
- Responsive: full-screen on mobile, 350x500px on desktop

#### `src/domains/ai-chat/components/molecules/message-list.tsx`
**Purpose**: Scrollable list of messages
**Features**:
- Maps over messages array
- Renders MessageBubble for each message
- Loading indicator for streaming (MessageBubble with isLoading)
- Empty state if no messages
- Auto-scroll behavior with ref

#### `src/domains/ai-chat/components/molecules/chat-input.tsx`
**Purpose**: Message input with send button
**Features**:
- Textarea with auto-resize (max 4 lines)
- Send button (disabled when empty or loading)
- Send icon from lucide-react
- Enter to send, Shift+Enter for new line
- Character limit (500 chars)
- Placeholder from text map

### 3.3 Integration Hook

#### `src/domains/ai-chat/hooks/use-ai-chat.ts`
**Purpose**: Wrapper around AI SDK's `useChat` with app-specific logic
**Functionality**:
- Import `useChat` from `ai/react`
- Configure API endpoint (`/api/chat`)
- Handle message submission
- Manage loading states
- Error handling
- Integration with chat-store

```typescript
import { useChat } from 'ai/react';
import { useChatStore } from '../stores/chat-store';

export function useAiChat() {
  const { messages: storeMessages, addMessage, setLoading, setError } = useChatStore();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      if (!response.ok) {
        setError('Error al comunicarse con el asistente');
      }
    },
    onFinish: (message) => {
      addMessage({
        id: message.id,
        role: message.role,
        content: message.content,
        timestamp: new Date(),
      });
    },
  });

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
  };
}
```

---

## 4. Files to Modify

### 4.1 `src/domains/ai-chat/components/molecules/message-bubble.tsx`
**Change**: Replace emoji avatars with Lucide React icons
**Reason**: Project constraint - no emojis allowed

**Changes**:
- Line 77: `'👤'` → `<User className="size-3" />` (import from lucide-react)
- Line 84: `'🤖'` → `<Bot className="size-3" />` (import from lucide-react)
- Line 91: `'ℹ️'` → `<Info className="size-3" />` (import from lucide-react)
- Line 98: `'❓'` → `<HelpCircle className="size-3" />` (import from lucide-react)

Update avatar rendering to use icon components instead of strings.

### 4.2 `src/app/layout.tsx`
**Change**: Add ChatBubble component to root layout
**Location**: After `<Toaster />`, before closing `</ThemeProvider>`

```tsx
import { ChatBubble } from '@/domains/ai-chat/components/organisms/chat-bubble';

// ... in JSX
<ThemeProvider>
  {children}
  <Toaster position="bottom-right" richColors />
  <ChatBubble />
</ThemeProvider>
```

---

## 5. Implementation Steps

### Phase 1: Dependencies Installation
```bash
# Install AI SDK core and Anthropic provider
pnpm add ai @ai-sdk/anthropic

# Alternative: OpenAI provider (if using GPT-4)
# pnpm add @ai-sdk/openai
```

### Phase 2: Environment Configuration
Create `.env.local`:
```env
# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-...

# Alternative: OpenAI API Key
# OPENAI_API_KEY=sk-...
```

### Phase 3: Core Types and Store
1. Create `src/domains/ai-chat/types.ts`
2. Create `src/domains/ai-chat/stores/chat-store.ts`
3. Create `src/domains/ai-chat/agents/layout-intelligence-agent.ts`

### Phase 4: API Route
1. Create `src/app/api/chat/route.ts`
2. Implement streaming with `streamText()`
3. Add system prompt from layout-intelligence-agent
4. Test with curl:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hola"}]}'
```

### Phase 5: Custom Hook
1. Create `src/domains/ai-chat/hooks/use-ai-chat.ts`
2. Integrate `useChat` from `ai/react`
3. Connect with chat-store

### Phase 6: UI Components
1. Fix `message-bubble.tsx` (replace emojis)
2. Create `chat-input.tsx`
3. Create `message-list.tsx`
4. Create `chat-window.tsx`
5. Create `chat-bubble.tsx`

### Phase 7: Integration
1. Add ChatBubble to root layout
2. Test chat flow:
   - Click bubble → window opens
   - Type message → send
   - Receive streaming response
   - Close chat → state persists

### Phase 8: Verification
- TypeScript compilation: `pnpm tsc --noEmit`
- Test streaming responses
- Test error handling
- Test mobile responsive design

---

## 6. LLM-Specific Sections

### 6.1 Streaming Implementation

**AI SDK Streaming Pattern**:
```typescript
// API Route
import { streamText } from 'ai';

const result = await streamText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  messages,
  system: LAYOUT_AGENT_SYSTEM_PROMPT,
});

return result.toDataStreamResponse();
```

**Client Hook**:
```typescript
// useChat automatically handles streaming
const { messages, isLoading } = useChat({
  api: '/api/chat',
});

// Messages update in real-time as stream arrives
```

### 6.2 System Prompt Design

**Structure**:
1. Role definition: "You are a Layout Intelligence Agent..."
2. Capabilities: What you can do
3. Constraints: What you cannot do (Stage 1-2)
4. Dashboard context: Available components
5. Layout patterns: Suggested configurations
6. Response guidelines: Tone, language, format

**Key Instructions**:
- Always respond in Spanish
- Be concise (max 150 words per response)
- Acknowledge limitations (suggestions only)
- Provide structured layout suggestions when requested
- Ask clarifying questions if unclear

### 6.3 Error Handling & Retry

**API Route Error Handling**:
```typescript
export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      messages,
      system: LAYOUT_AGENT_SYSTEM_PROMPT,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Error al procesar solicitud' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

**Client-Side Retry**:
```typescript
const { reload } = useChat({
  api: '/api/chat',
  onError: (error) => {
    console.error('Chat error:', error);
    // User can click retry button
  },
});
```

### 6.4 Rate Limiting & Cost Control

**Message Limits**:
- Max tokens per response: 1000 (cost control)
- Max conversation history: 20 messages (context limit)
- Character limit per user message: 500 chars

**Rate Limiting** (Future Enhancement):
- Basic: Track requests per session in memory
- Advanced: Use Redis or Upstash for persistent rate limits
- Pattern: 20 messages per session, 5 messages per minute

---

## 7. Important Notes

### Security
⚠️ **NEVER expose API keys in client code**
- API keys in `.env.local` only
- API route runs server-side (Next.js edge runtime)
- Keys never sent to browser

### Cost Optimization
💰 **Minimize API costs**:
- Limit max tokens (1000 per response)
- Limit conversation history (20 messages)
- Clear chat periodically
- Use structured prompts (less tokens)

### Offline Considerations
⚠️ **Chat requires internet**:
- API route needs Anthropic/OpenAI connection
- Display warning if offline
- Graceful degradation (show "offline" message)
- Do NOT block core expense tracking features

### Type Safety
✅ **Typed schemas for messages**:
```typescript
import { Message } from 'ai';

// AI SDK provides Message type
// Extend with metadata if needed
interface ChatMessage extends Message {
  metadata?: {
    layoutSuggestion?: LayoutSuggestion;
  };
}
```

### Accessibility
♿ **A11y Requirements**:
- ARIA labels on chat bubble and window
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader announcements for new messages
- Focus management when opening/closing
- Color contrast compliance

### Mobile Responsive
📱 **Mobile-Specific Behavior**:
- Chat window full-screen on mobile (100vw x 60vh)
- Bottom sheet pattern (slide up from bottom)
- Safe area insets for notched devices
- Touch-friendly button sizes (44x44px minimum)

---

## 8. Testing Strategy

### Manual Testing Checklist
- [ ] Chat bubble appears in bottom-right
- [ ] Click bubble → chat window opens
- [ ] Type message → streaming response appears
- [ ] Messages persist during navigation
- [ ] Close chat → state preserved
- [ ] Error handling works (disconnect network)
- [ ] Mobile responsive (test on device)
- [ ] Icons load correctly (no emojis)

### API Route Testing
```bash
# Test POST request
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hola, ¿cómo estás?"}
    ]
  }'

# Should stream response back
```

### TypeScript Verification
```bash
pnpm tsc --noEmit
```

---

## 9. Future Enhancements (Stage 3)

**When ready for Stage 3**:
1. **Context Integration**: Pass expense data to AI for insights
2. **Layout Execution**: Apply layout changes automatically
3. **Persistent Layouts**: Save configurations to IndexedDB
4. **Advanced Patterns**: Multi-turn conversations, tool calling
5. **Voice Input**: Add speech-to-text for accessibility

---

## 10. File Structure Summary

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # ⭐ NEW - Streaming API route
│   └── layout.tsx                # Modified - Add ChatBubble
│
├── domains/
│   └── ai-chat/
│       ├── types.ts               # ⭐ NEW - TypeScript types
│       ├── ai-chat.text-map.ts   # ✅ Exists
│       ├── agents/
│       │   └── layout-intelligence-agent.ts  # ⭐ NEW - System prompt
│       ├── stores/
│       │   └── chat-store.ts      # ⭐ NEW - Zustand store
│       ├── hooks/
│       │   └── use-ai-chat.ts     # ⭐ NEW - useChat wrapper
│       └── components/
│           ├── atoms/
│           │   └── (future: typing-indicator.tsx)
│           ├── molecules/
│           │   ├── message-bubble.tsx       # Modified - Remove emojis
│           │   ├── message-list.tsx         # ⭐ NEW
│           │   └── chat-input.tsx           # ⭐ NEW
│           └── organisms/
│               ├── chat-bubble.tsx          # ⭐ NEW
│               └── chat-window.tsx          # ⭐ NEW
```

**New Files**: 10
**Modified Files**: 2

---

## 11. Dependencies Summary

**Package Installations**:
```bash
pnpm add ai @ai-sdk/anthropic
```

**Environment Variables**:
```env
ANTHROPIC_API_KEY=sk-ant-...
```

**shadcn/ui Components** (already installed):
- ✅ Button
- ✅ Card
- ✅ ScrollArea
- ✅ Textarea (if not installed: `pnpm dlx shadcn@latest add textarea`)

---

## 12. Complexity Assessment

**Overall Complexity**: Medium

**Breakdown**:
- AI SDK Integration: Low (well-documented, straightforward)
- Streaming Implementation: Medium (requires understanding of stream handling)
- UI Components: Low (Atomic Design, clear patterns)
- State Management: Low (Zustand is simple)
- Testing: Medium (need to verify streaming behavior)

**Estimated Implementation Time**: 3-4 hours (single developer)

---

## 13. Success Criteria

✅ **Implementation Complete When**:
1. Chat bubble visible in bottom-right corner
2. Click opens floating chat window
3. User can send messages
4. AI responds with streaming (visible token-by-token)
5. Chat persists across page navigation
6. No emojis (Lucide icons only)
7. TypeScript compilation clean (0 errors)
8. Mobile responsive (full-screen chat on small screens)
9. Error handling works (network failures)
10. System prompt provides helpful layout suggestions

---

**Plan Complete**: Ready for parent agent execution.

**Next Step**: Parent agent implements files in order (types → store → agent → API route → hook → components → integration).
