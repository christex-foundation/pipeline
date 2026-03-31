//@ts-check
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$lib/server/config';
import { zodResponseFormat } from 'openai/helpers/zod';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

/**
 * Sends a chat completion request with structured output validated by a Zod schema.
 *
 * Provider contract:
 * - Input: array of message objects ({ role, content }), a Zod schema, and a schema name
 * - Output: the full response object from the AI provider (caller accesses .choices[0].message.parsed)
 *
 * To swap to an alternative provider (e.g. Ollama), reimplement this function
 * to call the alternative API while returning an object with the same shape.
 *
 * @param {Array<{ role: string, content: string }>} messages - Chat messages
 * @param {import('zod').ZodType} zodSchema - Zod schema for response validation
 * @param {string} schemaName - Name for the response format
 * @returns {Promise<any>} Parsed completion response
 */
export async function chatCompletionWithSchema(messages, zodSchema, schemaName) {
  return await openai.beta.chat.completions.parse({
    model: 'gpt-4o',
    messages,
    response_format: zodResponseFormat(zodSchema, schemaName),
    temperature: 0,
  });
}

/**
 * Generates a text embedding vector.
 *
 * Provider contract:
 * - Input: a string of text
 * - Output: an array of numbers (the embedding vector)
 *
 * To swap to an alternative provider, reimplement this function
 * to return an embedding vector of the same dimensionality.
 *
 * @param {string} text - Text to embed
 * @returns {Promise<number[]>} Embedding vector
 */
export async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}
