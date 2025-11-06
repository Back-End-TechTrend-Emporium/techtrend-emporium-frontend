// src/components/atoms/Select.tsx
import type { ComponentProps } from "react";

export default function Select(props: ComponentProps<"select">) {
  const { className, ...rest } = props;
  return (
    <div className="relative">
      <select
        {...rest}
        className={`w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 ${className || ""}`}
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
    </div>
  );
}
