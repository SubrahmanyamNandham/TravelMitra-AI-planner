import { type Response } from 'express';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '../lib/db/client.js';
import { chatMessagesTable, tripsTable } from '../lib/db/schema-sqlite.js';
import { AuthRequest } from '../types/express.js';
import { createChatStream, createCompletion, parseJsonResponse } from '../services/openai.js';
import { sendSuccess, sendError } from '../lib/response.js';

const SYSTEM_PROMPT = `You are an expert AI travel planning assistant for Travel.io. You specialize in creating personalized, detailed, and practical travel recommendations. Answer in a friendly and concise tone. Always focus on reality, local culture, and safety.`;

export async function chat(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const { message } = req.body as { message: string };
    const recentMessages = await db.query.chatMessagesTable.findMany({
      where: eq(chatMessagesTable.userId, userId),
      orderBy: [desc(chatMessagesTable.createdAt)],
      limit: 20
    });

    const history = recentMessages.reverse().map((item) => ({ role: item.role, content: item.content }));
    await db.insert(chatMessagesTable).values({ userId, role: 'user', content: message });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const stream = await createChatStream({
      model: 'gpt-5.4',
      stream: true,
      max_completion_tokens: 8192,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history,
        { role: 'user', content: message }
      ]
    });

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        const chunk = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf('\n\n');

        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data:')) {
            continue;
          }
          const data = line.slice(5).trim();
          if (data === '[DONE]') {
            await db.insert(chatMessagesTable).values({ userId, role: 'assistant', content: fullResponse });
            res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
            res.end();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (typeof content === 'string') {
              fullResponse += content;
              res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
          } catch {
            // ignore individual parse failures; continue streaming
          }
        }
      }
    }

    if (buffer.length > 0) {
      try {
        const parsed = JSON.parse(buffer.replace(/^data:\s*/u, '').trim());
        const content = parsed.choices?.[0]?.delta?.content;
        if (typeof content === 'string') {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      } catch {
        // no-op
      }
    }

    await db.insert(chatMessagesTable).values({ userId, role: 'assistant', content: fullResponse });
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    req.log.error({ err: error }, 'AI chat error');
    if (!res.headersSent) {
      sendError(res, 'AI request failed', 500, 'AI_ERROR');
      return;
    }
    res.write(`data: ${JSON.stringify({ error: 'AI request failed' })}\n\n`);
    res.end();
  }
}

export async function history(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(100, Math.max(1, Number(req.query.limit ?? 20)));
    const offset = (page - 1) * limit;

    const messages = await db.query.chatMessagesTable.findMany({
      where: eq(chatMessagesTable.userId, userId),
      orderBy: [desc(chatMessagesTable.createdAt)],
      limit,
      offset
    });

    const [{ count }] = await db.select({ count: sql`count(*)` }).from(chatMessagesTable).where(eq(chatMessagesTable.userId, userId));

    sendSuccess(res, {
      messages,
      page,
      limit,
      total: Number(count ?? 0)
    });
  } catch (error) {
    req.log.error({ err: error }, 'Chat history error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

export async function clearHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    await db.delete(chatMessagesTable).where(eq(chatMessagesTable.userId, userId));
    sendSuccess(res, undefined, 'Chat history deleted');
  } catch (error) {
    req.log.error({ err: error }, 'Clear chat history error');
    sendError(res, 'Internal server error', 500, 'INTERNAL_ERROR');
  }
}

function buildFallbackItinerary(params: {
  destination: string;
  country?: string;
  duration_days: number;
  budget?: number;
  currency: string;
  interests: string[];
  travel_style: string;
}) {
  const normalizedInterests = params.interests.length > 0 ? params.interests : ['culture', 'food'];
  const budgetAmount = params.budget ?? 1500;
  const destinationLabel = params.country ? `${params.destination}, ${params.country}` : params.destination;

  return {
    title: `AI-generated ${params.travel_style} itinerary for ${destinationLabel}`,
    summary: `A ${params.duration_days}-day ${params.travel_style} plan for ${destinationLabel} built around ${normalizedInterests.join(', ')}.`,
    highlights: [
      `Top ${normalizedInterests[0]} spots`,
      `Local dining and neighborhood exploration`,
      `Scenic highlights and practical planning tips`
    ],
    estimated_total_cost: {
      amount: budgetAmount,
      currency: params.currency
    },
    best_time_to_visit: 'Flexible with good weather in the primary travel season',
    days: Array.from({ length: params.duration_days }, (_, index) => ({
      day: index + 1,
      theme: `${params.travel_style[0].toUpperCase()}${params.travel_style.slice(1)} day plan`,
      morning: {
        activity: `Explore ${params.destination} highlights`,
        description: `A balanced morning activity centered on ${normalizedInterests[0]}.`,
        location: destinationLabel,
        duration: '3-4 hours',
        cost: 'Flexible',
        tip: 'Leave room for spontaneous discoveries.'
      },
      afternoon: {
        activity: `Local food and relaxation`,
        description: `Spend the afternoon discovering local places that match your travel style.`,
        location: destinationLabel,
        duration: '4-5 hours',
        cost: 'Flexible',
        tip: 'Keep your budget aligned with your preferred pace.'
      },
      evening: {
        activity: 'Wind down with a neighborhood walk or local nightlife',
        description: 'A gentle evening plan that helps you recharge for the next day.',
        location: destinationLabel,
        duration: '2-3 hours',
        cost: 'Optional',
        tip: 'Book your transport and any reservations in advance.'
      },
      accommodation: {
        name: 'Recommended stay in the city center',
        type: params.travel_style,
        estimated_cost: `${params.currency} ${Math.max(80, Math.round(budgetAmount / Math.max(1, params.duration_days)))}`
      },
      transport: 'Use local transit, rideshares, or a rental car based on your pace and distance.',
      daily_budget: {
        amount: Math.max(100, Math.round(budgetAmount / Math.max(1, params.duration_days))),
        currency: params.currency
      }
    })),
    practical_tips: {
      transport: 'Use local transit, taxis, or rideshares depending on the destination and travel style.',
      currency: `Keep a small cash buffer and estimate daily expenses in ${params.currency}.`,
      language: 'Learn a few local phrases and save emergency numbers in your phone.',
      safety: 'Stay aware of local transit, weather, and neighborhood conditions.',
      must_pack: ['Comfortable walking shoes', 'Travel adapter', 'Water bottle']
    }
  };
}

export async function generateTrip(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      sendError(res, 'Unauthorized', 401, 'UNAUTHORIZED');
      return;
    }

    const {
      destination,
      country,
      duration_days,
      budget,
      currency,
      interests,
      travel_style,
      save_trip
    } = req.body as {
      destination: string;
      country?: string;
      duration_days: number;
      budget?: number;
      currency: string;
      interests: string[];
      travel_style: string;
      save_trip: boolean;
    };

    const prompt = `Create a detailed ${duration_days}-day trip itinerary for ${destination} ${country ? `in ${country}` : ''}. Traveler preferences:\n- Travel style: ${travel_style}\n- Interests: ${interests.join(', ')}\n- Budget: ${budget ? `${currency} ${budget}` : 'flexible'}\nReturn ONLY a valid JSON object with this exact structure (no markdown, no explanation):\n{\n  "title": "Trip title",\n  "summary": "2-3 sentence overview",\n  "highlights": ["top attraction 1", "top attraction 2", "top attraction 3"],\n  "estimated_total_cost": { "amount": 0, "currency": "USD" },\n  "best_time_to_visit": "Month range",\n  "days": [\n    {\n      "day": 1,\n      "theme": "Arrival & First Impressions",\n      "morning": { "activity": "", "description": "", "location": "", "duration": "", "cost": "", "tip": "" },\n      "afternoon": { "activity": "", "description": "", "location": "", "duration": "", "cost": "", "tip": "" },\n      "evening": { "activity": "", "description": "", "location": "", "duration": "", "cost": "", "tip": "" },\n      "accommodation": { "name": "", "type": "", "estimated_cost": "" },\n      "transport": "How to get around today",\n      "daily_budget": { "amount": 0, "currency": "USD" }\n    }\n  ],\n  "practical_tips": {\n    "transport": "Getting around advice",\n    "currency": "Money tips",\n    "language": "Language tips",\n    "safety": "Safety advice",\n    "must_pack": ["item1", "item2"]\n  }\n}`;

    let itinerary = buildFallbackItinerary({
      destination,
      country,
      duration_days,
      budget,
      currency,
      interests,
      travel_style
    });

    try {
      const rawResponse = await createCompletion({
        model: 'gpt-5.4',
        max_completion_tokens: 8192,
        messages: [
          { role: 'system', content: 'You are a world-class travel planner. Always respond with valid JSON only — no markdown, no explanation.' },
          { role: 'user', content: prompt }
        ]
      });

      itinerary = parseJsonResponse(rawResponse);
    } catch (error) {
      req.log.warn({ err: error }, 'Falling back to local itinerary generation');
    }

    let savedTrip = null;

    if (save_trip) {
      const [trip] = await db.insert(tripsTable).values({
        userId,
        title: `AI-generated trip to ${destination}`,
        destination,
        country: country ?? null,
        budget: budget === undefined ? null : budget,
        currency,
        interests: JSON.stringify(interests),
        itinerary: JSON.stringify(itinerary),
        status: 'planned'
      }).returning();
      savedTrip = trip;
    }

    sendSuccess(res, { itinerary, trip: savedTrip }, 'Trip itinerary generated');
  } catch (error) {
    req.log.error({ err: error }, 'AI itinerary generation error');
    sendError(res, 'Unable to generate itinerary', 500, 'AI_ERROR');
  }
}
