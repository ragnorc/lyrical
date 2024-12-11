import { useState, useCallback } from "react";
import { PartialLanguageAnalysis } from "@/app/api/generate/schema";
import { useHotkeys } from "@/hooks/useHotkey";

type RevealState =
  | "original"
  | "transliteration"
  | "part_of_speech"
  | "translation";

export function useTokenNavigation(
  sentences: PartialLanguageAnalysis | undefined,
  rtl: boolean | undefined,
) {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [revealState, setRevealState] = useState<RevealState>("original");

  const flatTokens =
    sentences?.flatMap(
      (sentence) =>
        sentence?.tokens?.filter(
          (token): token is NonNullable<typeof token> =>
            !!token && "original" in token,
        ) ?? [],
    ) ?? [];

  const totalTokens = flatTokens.length;

  const navigate = useCallback(
    (direction: 1 | -1) => {
      setFocusedIndex((prev) => {
        const newIndex = prev + (rtl ? -direction : direction);
        return newIndex >= 0 && newIndex < totalTokens ? newIndex : prev;
      });

      setRevealState("original");
    },
    [rtl, totalTokens],
  );

  const toggleState = useCallback(
    (state: RevealState) => {
      const currentToken = flatTokens[focusedIndex];
      if (currentToken && currentToken[state]) {
        setRevealState((prev) => (prev === state ? "original" : state));
      }
    },
    [flatTokens, focusedIndex],
  );

  const cycleView = useCallback(
    (direction: 1 | -1, reset = false) => {
      const states: RevealState[] = [
        "original",
        "transliteration",
        "part_of_speech",
        "translation",
      ];
      const currentToken = flatTokens[focusedIndex];
      console.log(focusedIndex);
      setRevealState((prev) => {
        let currentIndex = states.indexOf(prev);
        let newIndex: number;
        let newState: RevealState;
        if (reset) currentIndex = 0;
        for (let i = 0; i < states.length; i++) {
          newIndex = (currentIndex + direction + states.length) % states.length;
          newState = states[newIndex];

          if (
            newState === "original" ||
            (currentToken && currentToken[newState])
          ) {
            return newState;
          }

          currentIndex = newIndex;
        }

        return prev; // If no valid state is found, keep the current state
      });
    },
    [flatTokens, focusedIndex],
  );

  useHotkeys("ArrowLeft", () => navigate(-1), [navigate]);
  useHotkeys("ArrowRight", () => navigate(1), [navigate]);
  useHotkeys("ArrowDown", () => cycleView(1), [cycleView]);
  useHotkeys("ArrowUp", () => cycleView(-1), [cycleView]);
  useHotkeys("T", () => toggleState("transliteration"), [toggleState]);
  useHotkeys("R", () => toggleState("translation"), [toggleState]);
  useHotkeys("P", () => toggleState("part_of_speech"), [toggleState]);

  return {
    focusedIndex,
    setFocusedIndex,
    revealState,
    setRevealState,
    cycleView,
  };
}
