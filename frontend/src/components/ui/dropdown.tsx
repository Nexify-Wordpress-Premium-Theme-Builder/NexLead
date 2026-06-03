"use client";

import { cn } from "@/lib/cn";
import type { HTMLAttributes, ReactNode } from "react";

export interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Dropdown({ trigger, children, className }: DropdownProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      {trigger}
      <div className="absolute right-0 z-20 mt-2 min-w-40 rounded-lg border border-border bg-surface p-1 shadow-lg">
        {children}
      </div>
    </div>
  );
}

export function DropdownItem({
  className,
  ...props
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full rounded-md px-3 py-2 text-left text-sm text-text-primary hover:bg-primary-soft",
        className,
      )}
      {...props}
    />
  );
}
