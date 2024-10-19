import { openai } from "@ai-sdk/openai";
import { streamObject, generateText } from "ai";
import { languageAnalysisSchema } from "./schema";
import {kv} from '@vercel/kv';
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest } from 'next/server';

export const maxDuration = 60;

// Create Rate limit
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.tokenBucket(30, '1 d', 30)
});

export async function POST(req: NextRequest) {
  // Call ratelimit with request ip
  const ip = req.ip ?? '127.0.0.1'

  const {success} = await ratelimit.limit(ip);

  // Block the request if unsuccessful
  if (!success) {
    return new Response('You have reached the maximum number of requests. Please try again in an hour.', { status: 429 });
  }

  const { prompt }: { prompt: string } = await req.json();

  // First, generate the text
  const { text } = await generateText({
    system: "You are a language expert. Generate a text for the given prompt that is optimized for learning in the language specified. Not too complex and use frequently used words.",
    model: openai('gpt-4o-mini'),
    prompt,
  });

  // Analyze the entire generated text
  const analysisResult = await streamObject({
    model: openai("gpt-4o"), 
    schema: languageAnalysisSchema,
    messages: [
      { role: "system", content: "You are a language expert. Analyze the given text and provide detailed grammatical information for each sentence. Provide an array such that element represents a sentence. Make sure the tokenization is correct and does not split words." },
      { role: "user", content: `Please analyze the following text: "${text}"` }
    ],
  });

  return analysisResult.toTextStreamResponse();
}