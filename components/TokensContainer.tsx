import { motion } from "framer-motion";
import { PartialLanguageAnalysis } from "@/app/api/generate/schema";
import { TokenView } from "@/components/TokenView";
import { useRef, useEffect, useMemo } from "react";

interface TokensContainerProps {
  sentences: PartialLanguageAnalysis | undefined;
  revealState:
    | "original"
    | "transliteration"
    | "part_of_speech"
    | "translation";
  focusedIndex: number;
  rtl: boolean | undefined;
  cycleView: (direction: 1 | -1) => void;
  setFocusedIndex: (index: number) => void;
}

export function TokensContainer({
  sentences,
  revealState,
  focusedIndex,
  cycleView,
  rtl = false,
  setFocusedIndex,
}: TokensContainerProps) {
  const flatTokens = useMemo(
    () =>
      sentences?.flatMap(
        (sentence) =>
          sentence?.tokens?.filter(
            (token): token is NonNullable<typeof token> =>
              !!token && "original" in token
          ) ?? []
      ) ?? [],
    [sentences]
  );

  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const currentSentenceIndex = sentences?.findIndex((sentence) =>
      sentence?.tokens?.some(
        (token) => token && flatTokens.indexOf(token) === focusedIndex
      )
    );

    if (currentSentenceIndex !== undefined && currentSentenceIndex !== -1) {
      const container = containerRefs.current[currentSentenceIndex];
      const focusedElement = container?.querySelector(
        `[data-index="${focusedIndex}"]`
      );

      if (focusedElement) {
        focusedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }
  }, [focusedIndex, sentences, flatTokens]);

  const handleTokenClick = (globalIndex: number) => {
    setFocusedIndex(globalIndex);
    cycleView(1);
  };

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-h-[60vh] py-4 px-2 overflow-y-auto">
        <div className={`flex flex-col ${rtl ? "items-end" : "items-start"}`}>
          {sentences?.map((sentence, sentenceIndex) => (
            <div
              key={sentenceIndex}
              ref={(el: HTMLDivElement | null) => {
                if (el) containerRefs.current[sentenceIndex] = el;
              }}
              className={`flex flex-wrap ${
                rtl ? "flex-row-reverse" : "flex-row"
              } gap-x-1.5 w-full`}
            >
              {sentence?.tokens
                ?.filter(
                  (token): token is NonNullable<typeof token> =>
                    !!token && "original" in token
                )
                .map((token, tokenIndex) => {
                  const globalIndex = flatTokens.findIndex((t) => t === token);
                  return (
                    <div
                      key={tokenIndex}
                      className="mb-2 cursor-pointer"
                      data-index={globalIndex}
                      onClick={() => handleTokenClick(globalIndex)}
                    >
                      <TokenView
                        token={token}
                        revealState={
                          globalIndex === focusedIndex
                            ? revealState
                            : "original"
                        }
                        isFocused={globalIndex === focusedIndex}
                      />
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
