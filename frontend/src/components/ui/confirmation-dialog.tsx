"use client";

import { Modal } from "@/components/ui/modal";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { cn } from "@/lib/cn";

export interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-60",
              destructive ? "bg-red hover:bg-red/90" : "btn-campaign",
            )}
          >
            <LoadingButtonState isLoading={loading} loadingText="Processing...">
              {confirmLabel}
            </LoadingButtonState>
          </button>
        </>
      }
    >
      {description ? <p className="text-sm leading-relaxed text-text-secondary">{description}</p> : null}
    </Modal>
  );
}
