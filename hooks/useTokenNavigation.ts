import { useState } from 'react';
import { ArabicAnalysis } from "@/app/api/analyze/schema";
import { useHotkeys } from '@/hooks/useHotkey';

type RevealState = "arabic" | "transliteration" | "part_of_speech" | "translation";

export function useTokenNavigation(sentences: ArabicAnalysis["tokens"][]) {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [revealState, setRevealState] = useState<RevealState>("arabic");

  const flatTokens = sentences.flatMap((sentence) =>
    sentence.filter(
      (token): token is NonNullable<typeof token> =>
        !!token && "arabic" in token,
    ),
  );
  const totalTokens = flatTokens.length;

  const navigate = (direction: 1 | -1) => {
    setFocusedIndex((prev) => {
      const newIndex = prev + direction;
      return newIndex >= 0 && newIndex < totalTokens ? newIndex : prev;
    });
    setRevealState("arabic");
  };

  const toggleState = (state: RevealState) => {
    setRevealState((prev) => prev === state ? "arabic" : state);
  };

  const cycleView = (direction: 1 | -1) => {
    const states: RevealState[] = ["arabic", "transliteration", "part_of_speech", "translation"];
    setRevealState((prev) => {
      const currentIndex = states.indexOf(prev);
      const newIndex = (currentIndex + direction + states.length) % states.length;
      return states[newIndex];
    });
  };

  useHotkeys("ArrowLeft", () => navigate(1), [totalTokens]);
  useHotkeys("ArrowRight", () => navigate(-1), [totalTokens]);
  useHotkeys("ArrowDown", () => cycleView(1));
  useHotkeys("ArrowUp", () => cycleView(-1));
  useHotkeys("T", () => toggleState("transliteration"));
  useHotkeys("R", () => toggleState("translation"));
  useHotkeys("P", () => toggleState("part_of_speech"));

  return { focusedIndex, setFocusedIndex, revealState, setRevealState };
}