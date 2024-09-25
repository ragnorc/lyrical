import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

interface TopicInputProps {
  showInput: boolean;
  topic: string;
  setTopic: (topic: string) => void;
  isLoadingAnalysis: boolean;
  onSubmit: () => void;
}

export function TopicInput({
  showInput,
  topic,
  setTopic,
  isLoadingAnalysis,
  onSubmit,
}: TopicInputProps) {
  return (
    <AnimatePresence>
      {showInput && (
        <motion.form
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-md mb-8 mx-auto relative"
          onSubmit={(event) => {
            event.preventDefault();
            if (topic.trim()) {
              onSubmit();
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
  );
}
