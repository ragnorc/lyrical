/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */

"use client";

import { experimental_useObject } from "ai/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Inter, Lateef as ArabicFont, Jost } from "next/font/google";
import { TopicInput } from "@/components/TopicInput";
import { TokensContainer } from "@/components/TokensContainer";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { useTokenNavigation } from "@/hooks/useTokenNavigation";
import { useGenerateSentences } from "@/hooks/useGenerateSentences";
import { ArabicAnalysis, arabicAnalysisSchema } from "@/app/api/analyze/schema";

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

export default function Home() {
  const [topic, setTopic] = useState<string>("");
  const [sentences, setSentences] = useState<ArabicAnalysis["tokens"][]>([]);
  const [showInput, setShowInput] = useState<boolean>(true);

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
      }
    },
    onError: (error) => {
      console.error("Error occurred:", error);
      toast.error("An error occurred. Please try again later!");
    },
  });

  const { generateSentences, isLoading: isLoadingSentences } =
    useGenerateSentences(submit);

  useEffect(() => {
    if (object?.analysis?.tokens?.length) {
      setShowInput(false);
    }
  }, [object?.analysis]);

  const allSentences = [
    ...sentences,
    isLoadingAnalysis
      ? ((object?.analysis?.tokens || []) as ArabicAnalysis["tokens"])
      : [],
  ];

  const { focusedIndex, revealState } = useTokenNavigation(allSentences);

  return (
    <div
      className={`${syne.variable} font-inter flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] dark:bg-zinc-900 p-4 relative overflow-hidden`}
    >
      <div className="absolute -bottom-[2%] -right-[10%] h-40 w-40 lg:-top-[10%] lg:h-96 lg:w-96">
        <div className="relative bottom-0 left-0 h-full w-full rounded-full bg-gradient-to-b from-blue-400/30 to-red-600/30 blur-[70px] filter" />
      </div>
      <div className="relative z-10 w-full">
        <TopicInput
          showInput={showInput}
          topic={topic}
          setTopic={setTopic}
          isLoading={isLoadingSentences}
          onSubmit={() => generateSentences(topic)}
        />

        {allSentences.length > 0 && (
          <TokensContainer
            sentences={allSentences}
            revealState={revealState}
            focusedIndex={focusedIndex}
          />
        )}

        <KeyboardShortcuts />
      </div>
    </div>
  );
}
