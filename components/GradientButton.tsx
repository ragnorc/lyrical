import { ReactNode } from "react";

interface GradientButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  icon: ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function GradientButton({
  onClick,
  disabled = false,
  icon,
  type = "button",
  className = "",
}: GradientButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`group relative bg-gradient-to-b h-9 w-9 rounded-full from-neutral-700 to-neutral-400 p-[0.5px] shadow-sm shadow-neutral-400 active:shadow-sm active:scale-[97%] active:translate-y-[0.5px] items-center justify-center flex transition duration-75 ${className}`}
    >
      <div
        className={`absolute z-30 h-[98%] w-[98%] rounded-full bg-gradient-to-b from-neutral-100/90 via-transparent via-40% to-neutral-100/0 p-[1.5px] transition-all duration-500 ease-in-out ${
          disabled ? "animate-spin" : "group-hover:rotate-[270deg]"
        }`}
      ></div>
      <div
        className={`absolute z-30 h-[98%] w-[98%] rounded-full bg-gradient-to-b from-transparent from-90% rotate-180 to-white p-[1.5px] transition-all duration-500 ease-in-out ${
          disabled ? "animate-spin" : "group-hover:rotate-[270deg]"
        }`}
      ></div>
      <div className="h-full z-20 w-full relative rounded-full bg-gradient-to-b from-neutral-100 via-neutral-600 to-neutral-300 p-[1.5px]"></div>
      <div className="absolute z-40 h-[90%] w-[90%] rounded-full bg-gradient-to-b from-neutral-300 to-neutral-500/90 justify-center items-center flex">
        {icon}
      </div>
    </button>
  );
}
