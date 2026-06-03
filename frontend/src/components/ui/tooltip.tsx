import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-text-primary px-2 py-1 text-xs text-white group-hover:block">
        {content}
      </span>
    </span>
  );
}
