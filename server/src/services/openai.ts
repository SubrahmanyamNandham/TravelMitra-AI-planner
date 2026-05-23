import { env } from '../lib/env.js';

const OPENAI_HEADERS = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${env.AI_INTEGRATIONS_OPENAI_API_KEY}`
};

export async function createChatStream(body: Record<string, unknown>) {
  const response = await fetch(`${env.AI_INTEGRATIONS_OPENAI_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: OPENAI_HEADERS,
    body: JSON.stringify(body)
  });

  if (!response.ok || !response.body) {
    const payload = await response.text();
    throw new Error(`OpenAI chat stream error: ${response.status} ${payload}`);
  }

  return response.body;
}

export async function createCompletion(body: Record<string, unknown>) {
  const response = await fetch(`${env.AI_INTEGRATIONS_OPENAI_BASE_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: OPENAI_HEADERS,
    body: JSON.stringify(body)
  });

  const payload = await response.text();
  if (!response.ok) {
    throw new Error(`OpenAI completion error: ${response.status} ${payload}`);
  }

  return payload;
}

export function parseJsonResponse(raw: string) {
  const trimmed = raw.trim();
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  const jsonString = match ? match[1] : trimmed;
  return JSON.parse(jsonString);
}
