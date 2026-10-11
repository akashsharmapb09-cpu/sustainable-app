import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "green" | "gray" | "amber" | "blue" | "red";

const tones: Record<Tone, string> = {
  green: "bg-forest-50 text-forest-700 ring-forest-100",
  gray: "bg-gray-100 text-gray-600 ring-gray-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  red: "bg-red-50 text-red-700 ring-red-100",
};

export function Badge({ tone = "gray", className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset", tones[tone], className)} {...props} />;
}
