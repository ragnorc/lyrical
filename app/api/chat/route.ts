import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { z } from "zod";
import { arabicAnalysisSchema } from "./schema";


export async function POST(req: Request) {
  const { sentence }: { sentence: string } = await req.json();

  const result = await streamObject({
    model: openai("gpt-4o"),
    system: "You are an Arabic language expert. Analyze the given Arabic sentence and provide detailed grammatical information.",
    prompt: `Please analyze the following Arabic sentence: "${sentence}"`,
    schema: arabicAnalysisSchema,
  });

  return result.toTextStreamResponse();
}
