import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight } from "react-icons/fa6";

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
            <button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              disabled={isLoading}
            >
              <div className="group relative bg-gradient-to-b h-9 w-9 rounded-full from-neutral-700 to-neutral-400 p-[0.5px] shadow-sm shadow-neutral-400 active:shadow-sm active:scale-[97%] active:translate-y-[0.5px] items-center justify-center flex transition duration-75">
                <div
                  className={`absolute z-30 h-[98%] w-[98%] rounded-full bg-gradient-to-b from-neutral-100/90 via-transparent via-40% to-neutral-100/0 p-[1.5px] transition-all duration-500 ease-in-out ${
                    isLoading ? "animate-spin" : "group-hover:rotate-[270deg]"
                  }`}
                ></div>
                <div
                  className={`absolute z-30 h-[98%] w-[98%] rounded-full bg-gradient-to-b from-transparent from-90% rotate-180 to-white p-[1.5px] transition-all duration-500 ease-in-out ${
                    isLoading ? "animate-spin" : "group-hover:rotate-[270deg]"
                  }`}
                ></div>
                <div className="h-full z-20 w-full relative rounded-full bg-gradient-to-b from-neutral-100 via-neutral-600 to-neutral-300 p-[1.5px]"></div>
                <div className="absolute z-40 h-[90%] w-[90%] rounded-full bg-gradient-to-b from-neutral-300 to-neutral-500/90 justify-center items-center flex">
                  <FaArrowRight className="absolute z-10 text-white/90" />
                  <FaArrowRight className="absolute text-black translate-y-[-0.2px]" />
                </div>
              </div>
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
