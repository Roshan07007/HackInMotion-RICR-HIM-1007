/**
 * Core AI service.
 * Wraps the Groq API and provides a single, reusable `generateAiResponse` helper.
 * Domain-specific prompts and logic live in resume.service.ts and chat.service.ts.
 */

import Groq from "groq-sdk";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// ---------------------------------------------------------------------------
// Groq client (lazy-initialised to avoid crashing at import time if key is missing)
// ---------------------------------------------------------------------------

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not defined in environment variables");
  return new Groq({ apiKey });
};

// ---------------------------------------------------------------------------
// Core helper
// ---------------------------------------------------------------------------

/**
 * Call the Groq API with automatic fallback to a smaller model if the primary
 * model is unavailable or returns an error.
 */
export const generateAiResponse = async (
  messages: ChatMessage[],
  requireJson: boolean = false,
  maxTokens: number = 1500
): Promise<string> => {
  const client = getGroqClient();
  const primaryModel = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const fallbackModel = process.env.GROQ_FALLBACK_MODEL || "llama-3.1-8b-instant";

  try {
    return await executeCompletion(client, primaryModel, messages, requireJson, maxTokens);
  } catch (error) {
    console.warn(`Primary model (${primaryModel}) failed. Trying fallback (${fallbackModel})…`, error);
    return await executeCompletion(client, fallbackModel, messages, requireJson, maxTokens);
  }
};

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

const executeCompletion = async (
  client: Groq,
  model: string,
  messages: ChatMessage[],
  requireJson: boolean,
  maxTokens: number
): Promise<string> => {
  const completion = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: maxTokens,
    response_format: requireJson ? { type: "json_object" } : { type: "text" },
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) throw new Error("No response content from AI model");
  return content;
};
