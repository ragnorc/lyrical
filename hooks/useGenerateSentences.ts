import { toast } from "sonner";

export function useGenerateSentences(submit: (data: { sentence: string }) => void) {
  return async (topic: string) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate sentences");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get reader from response");
      }

      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        accumulatedText += chunk;

        const sentences = accumulatedText.match(/[^.!?]+[.!?]+/g) || [];

        for (const sentence of sentences) {
          await submit({ sentence: sentence.trim() });
        }

        accumulatedText = accumulatedText.replace(/[^.!?]+[.!?]+/g, "");
      }
    } catch (error) {
      console.error("Error generating sentences:", error);
      toast.error("Failed to generate sentences. Please try again.");
    }
  };
}