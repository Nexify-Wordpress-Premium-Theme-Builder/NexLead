"use client";

import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";

import { IconClose } from "@/components/ui/icons";

type ModalSize = "sm" | "md" | "lg";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
};

const SIZE_CLASS: Record<ModalSize, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-2xl",
  lg: "sm:max-w-3xl",
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Kapat"
        className="nx-modal-backdrop absolute inset-0 bg-[rgba(15,23,42,0.38)] backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={`nx-modal-panel relative z-10 flex min-h-0 w-full max-h-[92dvh] flex-col overflow-hidden border bg-surface rounded-t-[24px] sm:max-h-[min(90dvh,calc(100dvh-48px))] sm:rounded-[24px] ${SIZE_CLASS[size]}`}
        style={{ borderColor: "var(--nx-border)" }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header
          className="flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4 sm:px-6"
          style={{ borderColor: "var(--nx-border)" }}
        >
          <div className="min-w-0 pr-2">
            <h2 id={titleId} className="text-[17px] font-bold tracking-[-0.02em] text-text-primary sm:text-[18px]">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-[13px] font-medium leading-[1.45] text-text-muted sm:text-[14px]">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl p-2 text-text-muted transition-colors hover:bg-surface-soft hover:text-text-primary"
            aria-label="Kapat"
          >
            <IconClose size={20} />
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {footer ? (
            <>
              <div className="nx-modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
                {children}
              </div>
              <footer
                className="nx-modal-footer shrink-0 border-t px-5 py-4 sm:px-6"
                style={{ borderColor: "var(--nx-border)" }}
              >
                {footer}
              </footer>
            </>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
