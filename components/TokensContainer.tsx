import { motion } from "framer-motion";
import { LanguageAnalysis } from "@/app/api/generate/schema";
import { TokenView } from "@/components/TokenView";
import { useRef, useEffect } from "react";

interface TokensContainerProps {
  tokens: LanguageAnalysis[0]["tokens"][];
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
  tokens,
  revealState,
  focusedIndex,
  cycleView,
  rtl = false,
  setFocusedIndex,
}: TokensContainerProps) {
  const flatTokens = tokens.flatMap((sentence) =>
    sentence.filter(
      (token): token is NonNullable<typeof token> =>
        !!token && "original" in token
    )
  );

  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    console.log(focusedIndex);
    const currentSentenceIndex = tokens.findIndex((sentence) =>
      sentence.some(
        (token, index) => flatTokens.indexOf(token) === focusedIndex
      )
    );

    if (currentSentenceIndex !== -1) {
      const container = containerRefs.current[currentSentenceIndex];
      if (container) {
        const focusedElement = container.querySelector(
          `[data-index="${focusedIndex}"]`
        );
        if (focusedElement) {
          const containerRect = container.getBoundingClientRect();
          const elementRect = focusedElement.getBoundingClientRect();

          const scrollThreshold = 300; // Increased threshold for earlier scrolling

          if (elementRect.right > containerRect.right - scrollThreshold) {
            container.scrollTo({
              left:
                container.scrollLeft +
                elementRect.right -
                containerRect.right +
                scrollThreshold,
              behavior: "smooth",
            });
          } else if (elementRect.left < containerRect.left + scrollThreshold) {
            container.scrollTo({
              left:
                container.scrollLeft +
                elementRect.left -
                containerRect.left -
                scrollThreshold,
              behavior: "smooth",
            });
          }
        }
      }
    }
  }, [focusedIndex, tokens, flatTokens]);

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
      <div
        className="w-full overflow-y-auto max-h-[60vh] py-4 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div
          className={`flex flex-col ${rtl ? "items-end" : "items-start"} gap-1`}
        >
          {tokens.map((sentence, sentenceIndex) => (
            <div
              key={sentenceIndex}
              ref={(el) => {
                containerRefs.current[sentenceIndex] = el;
              }}
              className={`flex ${
                rtl ? "flex-row-reverse" : "flex-row"
              } gap-1.5 overflow-x-auto justify-start w-full -m-5 p-5`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {sentence
                .filter(
                  (token): token is NonNullable<typeof token> =>
                    !!token && "original" in token
                )
                .map((token, tokenIndex) => {
                  const globalIndex = flatTokens.findIndex((t) => t === token);
                  return (
                    <div
                      key={tokenIndex}
                      className="mb-2 flex-shrink-0 cursor-pointer"
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
