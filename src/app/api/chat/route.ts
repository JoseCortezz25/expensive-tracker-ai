/**
 * Chat API Route
 *
 * Next.js Route Handler for streaming AI chat responses.
 * Uses Vercel AI SDK with Google Gemini 2.0.
 *
 * @module app/api/chat/route
 */

import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { LAYOUT_AGENT_SYSTEM_PROMPT } from '@/domains/ai-chat/agents/layout-intelligence-agent';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    console.log('messages', messages);
    // Convert UIMessages to ModelMessages
    const modelMessages = convertToModelMessages(messages);

    // Stream AI response
    const result = streamText({
      model: openai('gpt-5-chat-latest'),
      system: LAYOUT_AGENT_SYSTEM_PROMPT,
      messages: modelMessages,
      temperature: 0.7 // Balanced creativity
    });

    console.log('result', result);
    // Return streaming response
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log('error', error);
    return new Response('Error al procesar la solicitud', { status: 500 });
  }
}
