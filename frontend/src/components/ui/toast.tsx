"use client";

import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ToastItem, ToastVariant } from "@/hooks/use-toast";

export interface ToastProps {
  toast: ToastItem;
  onClose: (toastId: string) => void;
}

const iconByVariant: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

const variantClass: Record<ToastVariant, string> = {
  success: "border-green/20 bg-green-soft/35 text-green",
  info: "border-primary/20 bg-primary-soft/35 text-primary",
  warning: "border-orange/20 bg-orange-soft/35 text-orange",
  error: "border-red/20 bg-red-soft/35 text-red",
};

export function Toast({ toast, onClose }: ToastProps) {
  const Icon = iconByVariant[toast.variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-auto w-full rounded-2xl border p-4 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-sm animate-fade-up",
        "panel-premium",
        variantClass[toast.variant],
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{toast.title}</p>
          {toast.description && (
            <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
              {toast.description}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onClose(toast.id)}
          className="rounded-md p-1 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
          aria-label="Dismiss toast"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
