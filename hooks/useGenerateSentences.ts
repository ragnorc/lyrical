import { toast } from "sonner";
import { useCompletion } from 'ai/react';
import { useEffect, useRef } from "react";

export function useGenerateSentences(submit: (data: { sentence: string }) => void) {
  const submittedSentences = useRef<Set<string>>(new Set());

  const { complete, isLoading, completion } = useCompletion({
    api: '/api/generate',
    onError: (error) => {
      console.error("Error generating sentences:", error);
      toast.error("Failed to generate sentences. Please try again.");
    }
  });

  useEffect(() => {
    if (completion) {
      const sentences = completion.match(/[^.!?]+[.!?]+/g) || [];
      sentences.forEach(sentence => {
        const trimmedSentence = sentence.trim();
        if (!submittedSentences.current.has(trimmedSentence)) {
          submit({ sentence: trimmedSentence });
          
          console.log("sentence", trimmedSentence)
          submittedSentences.current.add(trimmedSentence);
        }
      });
    }
  }, [completion, submit]);

  const generateSentences = (topic: string) => {
    complete(topic);
  };

  return { generateSentences, isLoading };
}