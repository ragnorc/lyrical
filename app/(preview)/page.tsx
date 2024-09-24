/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */

"use client";

import { experimental_useObject } from "ai/react";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  arabicAnalysisSchema,
  PartialArabicAnalysis,
  ArabicAnalysis,
} from "@/app/api/analyze/schema";
import { useHotkeys } from "@/hooks/use-hotkey";
import { Inter, Lateef as ArabicFont, Jost } from "next/font/google";
import {
  FaKeyboard,
  FaArrowLeft,
  FaArrowRight,
  FaArrowDown,
} from "react-icons/fa";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const arabicFont = ArabicFont({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-arabic",
});
const syne = Jost({
  subsets: ["latin"],
  variable: "--font-syne",
});

type RevealState =
  | "arabic"
  | "transliteration"
  | "part_of_speech"
  | "translation";

const AnimatedText = ({
  text,
  className,
  isArabic,
  badge,
}: {
  text: string;
  className?: string;
  isArabic: boolean;
  badge?: string;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.1 }}
      className={`${className} ${
        isArabic ? `${arabicFont.className}` : `${inter.className} text-sm`
      }`}
    >
      {badge && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="mr-2 -ml-1 px-2 py-0.5 text-xs bg-black text-white rounded-md inline-block"
        >
          {badge}
        </motion.span>
      )}
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

const TokenView = ({
  token,
  revealState,
  isFocused,
}: {
  token: ArabicAnalysis["tokens"][0];
  revealState: RevealState;
  isFocused: boolean;
}) => {
  const getRevealContent = () => {
    switch (revealState) {
      case "arabic":
        return token.arabic;
      case "transliteration":
        return token.transliteration || "Loading...";
      case "part_of_speech":
        return token.part_of_speech || "Loading...";
      case "translation":
        return token.translation || "Loading...";
    }
  };

  const getBadgeText = () => {
    switch (revealState) {
      case "arabic":
        return "";
      case "transliteration":
        return token.transliteration ? "TL" : "...";
      case "part_of_speech":
        return token.part_of_speech ? "POS" : "...";
      case "translation":
        return token.translation ? "TR" : "...";
    }
  };

  const isArabic = revealState === "arabic";
  const isLoading = !token[revealState];

  return (
    <motion.div
      layout
      className={`relative flex items-center px-2.5 h-[1.8rem] rounded-lg text-center overflow-hidden ${
        isFocused
          ? "bg-white text-black shadow-[0px_0px_1px_rgba(0,0,0,0.04),0px_1px_1px_rgba(0,0,0,0.04),0px_3px_3px_rgba(0,0,0,0.04),0px_6px_6px_rgba(0,0,0,0.04),0px_12px_12px_rgba(0,0,0,0.04),0px_24px_24px_rgba(0,0,0,0.04)]"
          : "bg-zinc-200 text-zinc-500"
      } ${isLoading ? "opacity-50" : ""}`}
      initial={false}
      animate={{ width: "auto" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        <AnimatedText
          key={revealState}
          text={getRevealContent()}
          className="inline-block whitespace-nowrap"
          isArabic={isArabic}
          badge={!isArabic ? getBadgeText() : undefined}
        />
      </AnimatePresence>
    </motion.div>
  );
};

const TokensContainer = ({
  sentences,
  revealState,
  focusedIndex,
}: {
  sentences: ArabicAnalysis["tokens"][];
  revealState: RevealState;
  focusedIndex: number;
}) => {
  const flatTokens = sentences.flatMap((sentence) =>
    sentence.filter(
      (token): token is NonNullable<typeof token> =>
        !!token && "arabic" in token,
    ),
  );

  return (
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
                  !!token && "arabic" in token,
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
  );
};

export default function Home() {
  const [topic, setTopic] = useState<string>("");
  const [sentences, setSentences] = useState<ArabicAnalysis["tokens"][]>([]);
  const [revealState, setRevealState] = useState<RevealState>("arabic");
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [showInput, setShowInput] = useState<boolean>(true);

  const inputRef = useRef<HTMLInputElement>(null);

  const {
    submit,
    isLoading: isLoadingAnalysis,
    object,
  } = experimental_useObject({
    api: "/api/analyze",
    schema: arabicAnalysisSchema,
    onFinish({ object }) {
      if (object != null) {
        setSentences((prevSentences) => [
          ...prevSentences,
          object.analysis.tokens,
        ]);
        setFocusedIndex(0);
      }
    },
    onError: (error) => {
      console.error("Error occurred:", error);
      toast.error("An error occurred. Please try again later!");
    },
  });

  useHotkeys("t", () => setRevealState("transliteration"));
  useHotkeys("r", () => setRevealState("translation"));
  useHotkeys("p", () => setRevealState("part_of_speech"));

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

        if (event.key === "ArrowRight") {
          setFocusedIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : prev;
            if (newIndex !== prev) {
              setRevealState("arabic");
            }
            return newIndex;
          });
        } else if (event.key === "ArrowLeft") {
          setFocusedIndex((prev) => {
            const newIndex = prev < totalTokens - 1 ? prev + 1 : prev;
            if (newIndex !== prev) {
              setRevealState("arabic");
            }
            return newIndex;
          });
        } else if (event.key === "ArrowDown") {
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
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sentences]);

  useEffect(() => {
    if (object?.analysis?.tokens?.length) {
      setShowInput(false);
    }
  }, [object?.analysis]);

  const generateSentences = async (topic: string) => {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const allSentences = [
    ...sentences,
    isLoadingAnalysis ? object?.analysis?.tokens || [] : [],
  ];
  return (
    <div
      className={`${syne.variable} font-inter flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] dark:bg-zinc-900 p-4 relative overflow-hidden`}
    >
      <div className="absolute -bottom-[2%] -right-[10%] h-40 w-40 lg:-top-[10%] lg:h-96 lg:w-96">
        <div className="relative bottom-0 left-0 h-full w-full rounded-full bg-gradient-to-b from-blue-400/30 to-red-600/30 blur-[70px] filter" />
      </div>
      <div className="relative z-10 w-full">
        <AnimatePresence>
          {showInput && (
            <motion.form
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md mb-8 mx-auto relative"
              onSubmit={(event) => {
                event.preventDefault();
                if (topic.trim()) {
                  generateSentences(topic);
                }
              }}
            >
              <div className="relative">
                <input
                  name="topic"
                  className={`font-inter text-sm w-full bg-[#e9e9e9] border-[0.5px] border-zinc-300 dark:bg-zinc-800 rounded-xl px-4 py-3 pr-12 outline-none text-black dark:text-white`}
                  placeholder="Enter a topic..."
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  disabled={isLoadingAnalysis}
                  ref={inputRef}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-zinc-700 rounded-lg px-3 py-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100 dark:hover:bg-zinc-600 transition-colors duration-200 shadow-[0_2px_4px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_4px_rgba(255,255,255,0.05),0_1px_2px_rgba(255,255,255,0.03)]"
                  disabled={isLoadingAnalysis}
                >
                  <FaArrowRight className="w-3 h-3 font-light" />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {allSentences.length > 0 && (
          <motion.div
            className="w-full max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <TokensContainer
              sentences={allSentences}
              revealState={revealState}
              focusedIndex={focusedIndex}
            />
          </motion.div>
        )}
        <div className="fixed bottom-8 right-10 flex flex-col gap-2">
          <div className="flex items-center">
            <kbd className="flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-gradient-to-b from-[#72829A] to-[#444E62] rounded-lg shadow-[inset_0_-3px_0_#2D3444,inset_0_-4px_0_#5A6374,0_5px_8px_rgba(0,0,0,0.25),0_0_1px_#131720] border border-[#69778E] border-b-0">
              <span
                className="relative"
                style={{ textShadow: "0 0.4px 0 #FFFFFF" }}
              >
                T
              </span>
            </kbd>
            <span className="ml-2 text-xs text-gray-600 dark:text-gray-200">
              Toggle Transliteration
            </span>
          </div>
          <div className="flex items-center">
            <kbd className="flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-gradient-to-b from-[#72829A] to-[#444E62] rounded-lg shadow-[inset_0_-3px_0_#2D3444,inset_0_-4px_0_#5A6374,0_5px_8px_rgba(0,0,0,0.25),0_0_1px_#131720] border border-[#69778E] border-b-0">
              <span
                className="relative"
                style={{ textShadow: "0 0.4px 0 #FFFFFF" }}
              >
                R
              </span>
            </kbd>
            <span className="ml-2 text-xs text-gray-600 dark:text-gray-200">
              Toggle Translation
            </span>
          </div>
          <div className="flex items-center">
            <kbd className="flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-gradient-to-b from-[#72829A] to-[#444E62] rounded-lg shadow-[inset_0_-3px_0_#2D3444,inset_0_-4px_0_#5A6374,0_5px_8px_rgba(0,0,0,0.25),0_0_1px_#131720] border border-[#69778E] border-b-0">
              <span
                className="relative"
                style={{ textShadow: "0 0.4px 0 #FFFFFF" }}
              >
                P
              </span>
            </kbd>
            <span className="ml-2 text-xs text-gray-600 dark:text-gray-200">
              Toggle Part of Speech
            </span>
          </div>
          <div className="flex items-center">
            <kbd className="flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-gradient-to-b from-[#72829A] to-[#444E62] rounded-lg shadow-[inset_0_-3px_0_#2D3444,inset_0_-4px_0_#5A6374,0_5px_8px_rgba(0,0,0,0.25),0_0_1px_#131720] border border-[#69778E] border-b-0">
              <FaArrowLeft
                className="relative"
                style={{ filter: "drop-shadow(0 0.4px 0 #FFFFFF)" }}
              />
            </kbd>
            <kbd className="flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-gradient-to-b from-[#72829A] to-[#444E62] rounded-lg shadow-[inset_0_-3px_0_#2D3444,inset_0_-4px_0_#5A6374,0_5px_8px_rgba(0,0,0,0.25),0_0_1px_#131720] border border-[#69778E] border-b-0 ml-1">
              <FaArrowRight
                className="relative"
                style={{ filter: "drop-shadow(0 0.4px 0 #FFFFFF)" }}
              />
            </kbd>
            <span className="ml-2 text-xs text-gray-600 dark:text-gray-200">
              Navigate Words
            </span>
          </div>
          <div className="flex items-center">
            <kbd className="flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-gradient-to-b from-[#72829A] to-[#444E62] rounded-lg shadow-[inset_0_-3px_0_#2D3444,inset_0_-4px_0_#5A6374,0_5px_8px_rgba(0,0,0,0.25),0_0_1px_#131720] border border-[#69778E] border-b-0">
              <FaArrowDown
                className="relative"
                style={{ filter: "drop-shadow(0 0.4px 0 #FFFFFF)" }}
              />
            </kbd>
            <span className="ml-2 text-xs text-gray-600 dark:text-gray-200">
              Cycle Through Views
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
