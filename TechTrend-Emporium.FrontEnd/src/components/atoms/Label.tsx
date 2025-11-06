import React from "react";

export default function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 font-semibold text-gray-800 text-sm md:text-base">
      {children}
    </div>
  );
}
