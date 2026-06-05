"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useEffect, type ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  footer?: ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export function Modal({
  open,
  title,
  children,
  className,
  onClose,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    if (!open || !onClose) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlayClick && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[1px]"
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={cn(
          "panel-premium animate-fade-up w-full max-w-lg rounded-2xl border border-border p-6",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          {showCloseButton && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-primary"
              aria-label="Kapat"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="mt-4">{children}</div>
        {footer ? <div className="mt-6 flex items-center justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}
