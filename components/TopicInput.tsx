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
          className="w-full max-w-sm mb-8 mx-auto relative"
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
        </motion.form>
      )}
    </AnimatePresence>
  );
}
