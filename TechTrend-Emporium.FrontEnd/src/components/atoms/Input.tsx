import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export default function Input({
  leftIcon,
  rightSlot,
  className = "",
  ...rest
}: InputProps) {
  return (
    <div className="relative">
      {leftIcon && (
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
          {leftIcon}
        </span>
      )}
      <input
        className={`w-full rounded-full border border-neutral-300 bg-white py-2 pl-10 pr-12 text-sm outline-none ring-offset-2 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-black/20 ${className}`}
        {...rest}
      />
      {rightSlot && (
        <span className="absolute right-1 top-1/2 -translate-y-1/2">
          {rightSlot}
        </span>
      )}
    </div>
  );
}
