/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */

"use client";

import { experimental_useObject } from "ai/react";
import { useState } from "react";
import { toast } from "sonner";
import { Inter, Lateef as ArabicFont, Jost } from "next/font/google";
import { TopicInput } from "@/components/TopicInput";
import { TokensContainer } from "@/components/TokensContainer";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { useTokenNavigation } from "@/hooks/useTokenNavigation";
import { languageAnalysisSchema } from "@/app/api/generate/schema";
import { FaArrowLeft } from "react-icons/fa6";
import { GradientButton } from "@/components/GradientButton";

export default function Home() {
  const [topic, setTopic] = useState<string>("");

  const {
    submit,
    isLoading: isLoadingAnalysis,
    object,
    stop,
  } = experimental_useObject({
    api: "/api/generate",
    schema: languageAnalysisSchema,
    onError: (error) => {
      console.error("Error occurred:", error);
      toast.error("An error occurred. Please try again later!");
    },
  });

  const handleGenerateSentences = (topic: string) => {
    submit({ prompt: topic });
  };

  const tokens =
    object?.analysis?.map((sentence) => sentence?.tokens || []) || [];

  const hasTokens = tokens.length > 0;

  const { focusedIndex, revealState, cycleView, setFocusedIndex } =
    useTokenNavigation(object?.analysis, object?.rtl);

  const handleBack = () => {
    setTopic("");
    stop();
  };

  return (
    <div
      className={`font-inter flex flex-col items-center justify-center min-h-screen bg-[#F5F5F5] dark:bg-zinc-900 p-4 relative overflow-hidden`}
    >
      <div className="absolute -bottom-[2%] -right-[10%] h-40 w-40 lg:-top-[10%] lg:h-96 lg:w-96">
        <div className="relative bottom-0 left-0 h-full w-full rounded-full bg-gradient-to-b from-blue-400/30 to-red-600/30 blur-[70px] filter" />
      </div>
      <div className="absolute top-10 left-10">
        {hasTokens && (
          <GradientButton
            onClick={handleBack}
            icon={
              <>
                <FaArrowLeft className="absolute z-10 text-white/90" />
                <FaArrowLeft className="absolute text-black translate-y-[-0.2px]" />
              </>
            }
          />
        )}
      </div>
      <div className="relative z-10 w-full">
        <TopicInput
          showInput={!hasTokens || !topic}
          topic={topic}
          setTopic={setTopic}
          isLoading={isLoadingAnalysis}
          onSubmit={() => handleGenerateSentences(topic)}
        />

        {tokens.length > 0 && (
          <TokensContainer
            setFocusedIndex={setFocusedIndex}
            rtl={object?.rtl}
            cycleView={cycleView}
            tokens={tokens}
            revealState={revealState}
            focusedIndex={focusedIndex}
          />
        )}

        <KeyboardShortcuts />
      </div>
    </div>
  );
}
