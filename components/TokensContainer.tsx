import { motion } from "framer-motion";
import { ArabicAnalysis } from "@/app/api/analyze/schema";
import { TokenView } from "@/components/TokenView";
import { useRef, useEffect } from "react";

interface TokensContainerProps {
  sentences: ArabicAnalysis["tokens"][];
  revealState: "arabic" | "transliteration" | "part_of_speech" | "translation";
  focusedIndex: number;
}

export function TokensContainer({
  sentences,
  revealState,
  focusedIndex,
}: TokensContainerProps) {
  const flatTokens = sentences.flatMap((sentence) =>
    sentence.filter(
      (token): token is NonNullable<typeof token> =>
        !!token && "arabic" in token
    )
  );

  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const currentSentenceIndex = sentences.findIndex((sentence) =>
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

          if (elementRect.right > containerRect.right - 100) {
            container.scrollTo({
              left:
                container.scrollLeft +
                elementRect.right -
                containerRect.right +
                100,
              behavior: "smooth",
            });
          } else if (elementRect.left < containerRect.left + 100) {
            container.scrollTo({
              left:
                container.scrollLeft +
                elementRect.left -
                containerRect.left -
                100,
              behavior: "smooth",
            });
          }
        }
      }
    }
  }, [focusedIndex, sentences, flatTokens]);

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
        <div className="flex flex-col items-end gap-1">
          {sentences.map((sentence, sentenceIndex) => (
            <div
              key={sentenceIndex}
              ref={(el) => {
                containerRefs.current[sentenceIndex] = el;
              }}
              className="flex flex-row-reverse gap-2 overflow-x-auto justify-start w-full -m-5 p-5"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {sentence
                .filter(
                  (token): token is NonNullable<typeof token> =>
                    !!token && "arabic" in token
                )
                .map((token, tokenIndex) => {
                  const globalIndex = flatTokens.findIndex((t) => t === token);
                  return (
                    <div
                      key={tokenIndex}
                      className="mb-2 flex-shrink-0"
                      data-index={globalIndex}
                    >
                      <TokenView
                        token={token}
                        revealState={
                          globalIndex === focusedIndex ? revealState : "arabic"
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
