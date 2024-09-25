import { motion, AnimatePresence } from "framer-motion";
import { ArabicAnalysis } from "@/app/api/analyze/schema";
import { Lateef as ArabicFont, Inter } from "next/font/google";

const arabicFont = ArabicFont({
  subsets: ["arabic"],
  weight: "400",
  variable: "--font-arabic",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

interface TokenViewProps {
  token: ArabicAnalysis["tokens"][0][0];
  revealState: "arabic" | "transliteration" | "part_of_speech" | "translation";
  isFocused: boolean;
}

export function TokenView({ token, revealState, isFocused }: TokenViewProps) {
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
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  isArabic: boolean;
  badge?: string;
}

function AnimatedText({ text, className, isArabic, badge }: AnimatedTextProps) {
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
}
