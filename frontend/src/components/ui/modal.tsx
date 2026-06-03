import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ open, title, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={cn("w-full max-w-lg rounded-xl border border-border bg-surface p-6", className)}>
        <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
