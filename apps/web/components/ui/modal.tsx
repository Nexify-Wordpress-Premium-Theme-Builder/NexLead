"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { IconClose } from "@/components/ui/icons";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Kapat"
        className="nx-modal-backdrop absolute inset-0 bg-[#0f172a]/25 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="nx-modal-enter relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[var(--nx-radius-lg)] border bg-surface shadow-card sm:max-h-[88vh] sm:rounded-[var(--nx-radius-lg)]"
        style={{ borderColor: "var(--nx-border)" }}
      >
        <div className="flex items-start justify-between border-b px-5 py-4 sm:px-6" style={{ borderColor: "var(--nx-border)" }}>
          <div>
            <h2 id="modal-title" className="text-[18px] font-bold tracking-[-0.02em] text-text-primary">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-[14px] font-medium text-text-muted">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-text-muted transition-colors hover:bg-surface-soft hover:text-text-primary"
            aria-label="Kapat"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
