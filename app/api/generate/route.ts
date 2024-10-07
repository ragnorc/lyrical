import { openai } from "@ai-sdk/openai";
import { streamText, streamObject, generateText } from "ai";
import { languageAnalysisSchema } from "./schema";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt }: { prompt: string } = await req.json();

  // First, generate the Arabic text
  const {text} = await generateText({
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