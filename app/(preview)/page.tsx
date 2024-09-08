/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */

"use client";

import { experimental_useObject } from "ai/react";
import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { arabicAnalysisSchema } from "@/app/api/chat/schema";
import { useHotkeys } from "@/hooks/use-hotkey";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const notoNaskhArabic = Noto_Naskh_Arabic({ subsets: ["arabic"] });

type ArabicAnalysis = {
  original_sentence: string;
  transliteration: string;
  translation: string;
  tokens: Array<{
    arabic: string;
    transliteration: string;
    translation: string;
    part_of_speech: string;
  }>;
  syntax: Array<
    { type: string; index: number } | { type: string; indices: number[] }
  >;
  grammatical_notes: string[];
};

type RevealState =
  | "arabic"
  | "transliteration"
  | "part_of_speech"
  | "translation";

const AnimatedText = ({
  text,
  className,
  isArabic,
}: {
  text: string;
  className?: string;
  isArabic: boolean;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={`${className} ${
        isArabic ? `${notoNaskhArabic.className}` : `${inter.className} text-sm`
      }`}
    >
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
        return token.transliteration;
      case "part_of_speech":
        return token.part_of_speech;
      case "translation":
        return token.translation;
    }
  };

  const getBadgeText = () => {
    switch (revealState) {
      case "arabic":
        return "";
      case "transliteration":
        return "TL";
      case "part_of_speech":
        return "POS";
      case "translation":
        return "TR";
    }
  };

  const isArabic = revealState === "arabic";

  return (
    <motion.div
      layout
      className={`relative inline-flex items-center px-3 py-0.5 rounded-lg text-center overflow-hidden ${
        isFocused
          ? "bg-white text-black shadow-[0px_0px_1px_rgba(0,0,0,0.04),0px_1px_1px_rgba(0,0,0,0.04),0px_3px_3px_rgba(0,0,0,0.04),0px_6px_6px_rgba(0,0,0,0.04),0px_12px_12px_rgba(0,0,0,0.04),0px_24px_24px_rgba(0,0,0,0.04)]"
          : "bg-zinc-200 text-zinc-500"
      }`}
      initial={false}
      animate={{ width: "auto" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {!isArabic && (
          <motion.span
            key={revealState}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mr-2 -ml-2 px-2 py-[0.17rem] text-xs bg-black text-white rounded-md"
          >
            {getBadgeText()}
          </motion.span>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <AnimatedText
          key={revealState}
          text={getRevealContent()}
          className="inline-block"
          isArabic={isArabic}
        />
      </AnimatePresence>
    </motion.div>
  );
};

const TokensContainer = ({
  tokens,
  revealState,
  focusedIndex,
}: {
  tokens: ArabicAnalysis["tokens"];
  revealState: RevealState;
  focusedIndex: number;
}) => {
  return (
    <div className="flex flex-wrap-reverse gap-2 justify-center">
      {tokens
        .slice()
        .reverse()
        .map((token, index) => (
          <TokenView
            key={index}
            token={token}
            revealState={index === focusedIndex ? revealState : "arabic"}
            isFocused={index === focusedIndex}
          />
        ))}
    </div>
  );
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [analysis, setAnalysis] = useState<ArabicAnalysis | null>(null);
  const [revealState, setRevealState] = useState<RevealState>("arabic");
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const { submit, isLoading, object } = experimental_useObject({
    api: "/api/chat",
    schema: arabicAnalysisSchema,
    onFinish({ object }) {
      if (object != null) {
        setAnalysis(object.analysis);
        setInput("");
        setFocusedIndex(object.analysis.tokens.length - 1); // Start from the rightmost token
        inputRef.current?.focus();
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
      if (analysis) {
        if (event.key === "ArrowLeft") {
          setFocusedIndex((prev) => {
            const newIndex = prev > 0 ? prev - 1 : prev;
            if (newIndex !== prev) {
              setRevealState("arabic");
            }
            return newIndex;
          });
        } else if (event.key === "ArrowRight") {
          setFocusedIndex((prev) => {
            const newIndex =
              prev < analysis.tokens.length - 1 ? prev + 1 : prev;
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
  }, [analysis]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-zinc-100 dark:bg-zinc-900 p-4 ${inter.className}`}
    >
      <form
        className="w-full max-w-md mb-8"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.target as HTMLFormElement;
          const input = form.elements.namedItem("sentence") as HTMLInputElement;
          if (input.value.trim()) {
            submit({ sentence: input.value });
          }
        }}
      >
        <input
          name="sentence"
          className="w-full bg-white dark:bg-zinc-800 rounded-md px-4 py-2 outline-none text-black dark:text-white shadow-sm"
          placeholder="Enter an Arabic sentence..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>

      {analysis && (
        <motion.div
          className="w-full max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TokensContainer
            tokens={analysis.tokens}
            revealState={revealState}
            focusedIndex={focusedIndex}
          />
        </motion.div>
      )}

      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <kbd className="px-2 py-1.5 text-xs text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          T: Toggle Transliteration
        </kbd>
        <kbd className="px-2 py-1.5 text-xs text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          R: Toggle Translation
        </kbd>
        <kbd className="px-2 py-1.5 text-xs text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          P: Toggle Part of Speech
        </kbd>
        <kbd className="px-2 py-1.5 text-xs text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          ←→: Navigate Words
        </kbd>
        <kbd className="px-2 py-1.5 text-xs text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          ↓: Cycle Through Views
        </kbd>
      </div>
    </div>
  );
}
