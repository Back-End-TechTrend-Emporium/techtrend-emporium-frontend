import React, { useId } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  label?: string;
  error?: string | null;
};

export default function Input({
  leftIcon,
  rightSlot,
  className = "",
  label,
  error,
  id,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="mb-4">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-800 mb-1">
          {label}
        </label>
      ) : null}

      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full rounded-md border border-neutral-300 bg-white py-2 pl-10 pr-12 text-sm outline-none ring-offset-2 placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-black/20 ${className}`}
          {...(rest as any)}
        />
        {rightSlot && (
          <span className="absolute right-1 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
