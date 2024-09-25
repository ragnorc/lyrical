import { motion } from "framer-motion";
import { ArabicAnalysis } from "@/app/api/analyze/schema";
import { TokenView } from "@/components/TokenView";

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

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full overflow-y-auto max-h-[60vh] py-4 px-2">
        <div className="flex flex-col items-end gap-2">
          {sentences.map((sentence, sentenceIndex) => (
            <div
              key={sentenceIndex}
              className="flex flex-row-reverse gap-2 justify-start"
            >
              {sentence
                .filter(
                  (token): token is NonNullable<typeof token> =>
                    !!token && "arabic" in token
                )
                .map((token, tokenIndex) => {
                  const globalIndex = flatTokens.findIndex((t) => t === token);
                  return (
                    <div key={tokenIndex} className="mb-2">
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
