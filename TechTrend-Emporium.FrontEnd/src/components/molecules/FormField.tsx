import type { ReactNode } from "react";
import { Label } from "../atoms";   // <-- antes era ../atoms/Label

export default function FormField({
  label, helper, children,
}: { label: string; helper?: ReactNode; children: ReactNode }) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {children}
      {helper && <div className="mt-2 text-sm">{helper}</div>}
    </label>
  );
}
