import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { topic }: { topic: string } = await req.json();

  const response = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      { role: "system", content: "You are an Arabic language expert. Generate a short text (3-5 sentences) about the given topic that is optimized for learning Arabic." },
      { role: "user", content: `Generate a short Arabic text about: "${topic}"` }
    ],
  });

  return response.toTextStreamResponse()
}
