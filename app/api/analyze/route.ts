import { openai } from "@ai-sdk/openai";
import { streamObject } from "ai";
import { arabicAnalysisSchema } from "./schema";

export async function POST(req: Request) {
  const { sentence }: { sentence: string } = await req.json();

  const result = await streamObject({
    model: openai("gpt-4o-mini"),
    schema: arabicAnalysisSchema,
    messages: [
      { role: "system", content: "You are an Arabic language expert. Analyze the given Arabic sentence and provide detailed grammatical information." },
      { role: "user", content: `Please analyze the following Arabic sentence: "${sentence}"` }
    ],
  });

  return result.toTextStreamResponse();
}