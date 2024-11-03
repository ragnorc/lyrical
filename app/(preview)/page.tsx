/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */

"use client";

import { experimental_useObject } from "ai/react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { TopicInput } from "@/components/TopicInput";
import { TokensContainer } from "@/components/TokensContainer";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { useTokenNavigation } from "@/hooks/useTokenNavigation";
import { languageAnalysisSchema } from "@/app/api/generate/schema";
import { FaArrowLeft, FaGithub, FaTwitter } from "react-icons/fa6";
import { GradientButton } from "@/components/GradientButton";
import { useQueryState } from "nuqs";

export default function Home() {
  const [topic, setTopic] = useQueryState("topic");
  const [showTokens, setShowTokens] = useState<boolean>(false);

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
      toast.error(`An error occurred: ${error.message}`);
    },
  });

  const handleGenerateSentences = () => {
    if (topic) {
      submit({ prompt: topic });
      setShowTokens(true);
    }
  };

  const tokens =
    object?.analysis?.map((sentence) => sentence?.tokens || []) || [];

  const hasTokens = tokens.length > 0 && showTokens;

  const { focusedIndex, revealState, cycleView, setFocusedIndex } =
    useTokenNavigation(object?.analysis, object?.rtl);

  const handleBack = useCallback(() => {
    setTopic(null);
    stop();
    setShowTokens(false);
    setFocusedIndex(0); // Reset the focused token
  }, [setTopic, stop, setFocusedIndex]);

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
          topic={topic || ""}
          setTopic={setTopic}
          isLoading={isLoadingAnalysis}
          onSubmit={handleGenerateSentences}
        />

        {hasTokens && (
          <TokensContainer
            setFocusedIndex={setFocusedIndex}
            rtl={object?.rtl}
            cycleView={cycleView}
            sentences={object?.analysis}
            revealState={revealState}
            focusedIndex={focusedIndex}
          />
        )}

        <div className="hidden md:block">
          <KeyboardShortcuts />
        </div>
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-zinc-400 dark:text-zinc-300 flex items-center space-x-2">
        <span>Made with ♥ by Ragnor</span>
        <a
          href="https://github.com/ragnorc/lyrical"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-700 dark:hover:text-gray-300"
        >
          <FaGithub />
        </a>
        <a
          href="https://twitter.com/ragnorco"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-700 dark:hover:text-gray-300"
        >
          <FaTwitter />
        </a>
      </div>
    </div>
  );
}
