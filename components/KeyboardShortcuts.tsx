import React from "react";
import { FaArrowLeft, FaArrowRight, FaArrowDown } from "react-icons/fa";

export function KeyboardShortcuts() {
  return (
    <div className="fixed bottom-8 right-10 flex flex-col gap-2">
      <ShortcutKey label="T" description="Toggle Transliteration" />
      <ShortcutKey label="R" description="Toggle Translation" />
      <ShortcutKey label="P" description="Toggle Part of Speech" />
      <div className="flex items-center">
        <ShortcutKey icon={<FaArrowLeft />} />
        <ShortcutKey icon={<FaArrowRight />} className="ml-1" />
        <span className="ml-2 text-xs text-gray-600 dark:text-gray-200">
          Navigate Words
        </span>
      </div>
      <ShortcutKey icon={<FaArrowDown />} description="Cycle Through Views" />
    </div>
  );
}

function ShortcutKey({
  label,
  icon,
  description,
  className = "",
}: {
  label?: string;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <kbd className="flex items-center justify-center w-7 h-7 text-xs font-bold text-white bg-gradient-to-b from-[#72829A] to-[#444E62] rounded-lg shadow-[inset_0_-3px_0_#2D3444,inset_0_-4px_0_#5A6374,0_5px_8px_rgba(0,0,0,0.25),0_0_1px_#131720] border border-[#69778E] border-b-0">
        {label ? (
          <span
            className="relative"
            style={{ textShadow: "0 0.4px 0 #FFFFFF" }}
          >
            {label}
          </span>
        ) : (
          icon &&
          React.cloneElement(icon as React.ReactElement, {
            className: "relative",
            style: { filter: "drop-shadow(0 0.4px 0 #FFFFFF)" },
          })
        )}
      </kbd>
      {description && (
        <span className="ml-2 text-xs text-gray-600 dark:text-gray-200">
          {description}
        </span>
      )}
    </div>
  );
}
