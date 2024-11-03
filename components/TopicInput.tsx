import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";
import { GradientButton } from "./GradientButton";

interface TopicInputProps {
  showInput: boolean;
  topic: string;
  setTopic: (topic: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
}

const suggestedQueries = [
  "Birth of the Roman Empire in Arabic",
  "History of Jazz in Beginner Spanish",
  "Artificial Intelligence Ethics in Intermediate Japanese",
  "Climate Change Solutions in Advanced French",
  "Modern Cooking Techniques in Egyptian Arabic",
];

export function TopicInput({
  showInput,
  topic,
  setTopic,
  isLoading,
  onSubmit,
}: TopicInputProps) {
  return (
    <AnimatePresence>
      {showInput && (
        <motion.form
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full mb-8 mx-auto relative flex flex-col items-center"
          onSubmit={(event) => {
            event.preventDefault();
            if (topic.trim()) {
              onSubmit();
            }
          }}
        >
          <div className="relative w-full sm:w-2/3 md:w-1/2 lg:w-1/3 mx-auto">
            <input
              name="topic"
              className="font-inter text-sm w-full bg-[#e9e9e9] border-[0.5px] border-zinc-300 dark:bg-zinc-800 rounded-full px-4 py-3 pr-12 outline-none text-black dark:text-white"
              placeholder="Enter a topic..."
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              disabled={isLoading}
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <GradientButton
                onClick={onSubmit}
                disabled={isLoading}
                icon={
                  <>
                    <FaArrowRight className="absolute z-10 text-white/90" />
                    <FaArrowRight className="absolute text-black translate-y-[-0.2px]" />
                  </>
                }
              />
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-2 w-full sm:w-5/6 md:w-3/4 lg:w-2/3 xl:w-1/2">
            {suggestedQueries.map((query, index) => (
              <motion.button
                key={index}
                onClick={() => setTopic(query)}
                className="px-2 py-1 sm:px-2.5 sm:py-1 bg-white text-gray-800 rounded-lg text-xs shadow-[0px_0px_1px_rgba(0,0,0,0.04),0px_1px_1px_rgba(0,0,0,0.04),0px_3px_3px_rgba(0,0,0,0.04),0px_6px_6px_rgba(0,0,0,0.04),0px_12px_12px_rgba(0,0,0,0.04),0px_24px_24px_rgba(0,0,0,0.04)] hover:bg-gray-900 hover:text-gray-200 hover:shadow-[0px_0px_1px_rgba(255,255,255,0.1),0px_1px_1px_rgba(255,255,255,0.1),0px_3px_3px_rgba(255,255,255,0.1),0px_6px_6px_rgba(255,255,255,0.1),0px_12px_12px_rgba(255,255,255,0.1),0px_24px_24px_rgba(255,255,255,0.1)] transition-all duration-200"
                initial={{ opacity: 0, y: 20, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.01, delay: index * 0.1 }}
                whileTap={{ y: 0, boxShadow: "0px 5px 10px rgba(0,0,0,0.05)" }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className="line-clamp-1"
                >
                  {query}
                </motion.span>
              </motion.button>
            ))}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
