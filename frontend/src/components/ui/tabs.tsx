"use client";

import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ items, activeId, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-1 border-b border-border", className)}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors",
            activeId === item.id
              ? "border-b-2 border-primary text-primary"
              : "text-text-secondary hover:text-text-primary",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("pt-4", className)}>{children}</div>;
}
