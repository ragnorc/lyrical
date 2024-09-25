import { useState, useEffect } from 'react';
import { ArabicAnalysis } from "@/app/api/analyze/schema";

type RevealState = "arabic" | "transliteration" | "part_of_speech" | "translation";

export function useTokenNavigation(sentences: ArabicAnalysis["tokens"][]) {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [revealState, setRevealState] = useState<RevealState>("arabic");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (sentences.length > 0) {
        const flatTokens = sentences.flatMap((sentence) =>
          sentence.filter(
            (token): token is NonNullable<typeof token> =>
              !!token && "arabic" in token,
          ),
        );
        const totalTokens = flatTokens.length;

        switch (event.key) {
          case "ArrowRight":
            setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            setRevealState("arabic");
            break;
          case "ArrowLeft":
            setFocusedIndex((prev) => (prev < totalTokens - 1 ? prev + 1 : prev));
            setRevealState("arabic");
            break;
          case "ArrowDown":
            setRevealState((prev) => {
              switch (prev) {
                case "arabic":
                  return "transliteration";
                case "transliteration":
                  return "part_of_speech";
                case "part_of_speech":
                  return "translation";
                case "translation":
                  return "arabic";
                default:
                  return "arabic";
              }
            });
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sentences]);

  return { focusedIndex, setFocusedIndex, revealState, setRevealState };
}