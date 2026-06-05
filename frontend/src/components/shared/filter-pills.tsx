"use client";

import { cn } from "@/lib/cn";

export interface FilterPillsProps {
  items: string[];
  active: string;
  onChange: (item: string) => void;
  className?: string;
}

export function FilterPills({ items, active, onChange, className }: FilterPillsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-all duration-200",
            active === item
              ? "border border-primary/15 bg-primary-soft text-primary"
              : "border border-border-soft bg-surface text-text-secondary hover:border-border hover:bg-surface-muted",
          )}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
