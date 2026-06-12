"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { IconAlertTriangle } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";

type ConfirmActionProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  tone?: "default" | "danger";
  onConfirm: () => void | Promise<void>;
  children: (open: () => void) => ReactNode;
};

export function ConfirmAction({
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  loading = false,
  tone = "default",
  onConfirm,
  children,
}: ConfirmActionProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <>
      {children(() => setOpen(true))}
      <Modal
        open={open}
        size="sm"
        title={title}
        description={description}
        onClose={() => !loading && setOpen(false)}
        footer={
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
            {tone === "danger" ? (
              <Button
                type="button"
                className="w-full border border-error bg-error text-white hover:bg-[#b91c1c] sm:w-auto"
                loading={loading}
                onClick={handleConfirm}
              >
                {confirmLabel}
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                className="w-full sm:w-auto"
                loading={loading}
                onClick={handleConfirm}
              >
                {confirmLabel}
              </Button>
            )}
          </div>
        }
      >
        <div className="flex items-center gap-3 rounded-2xl border bg-surface-soft px-4 py-3.5" style={{ borderColor: "var(--nx-border)" }}>
          <div className={`nx-icon-badge shrink-0 ${tone === "danger" ? "nx-icon-badge--red h-10 w-10" : "nx-icon-badge--amber h-10 w-10"}`}>
            <IconAlertTriangle size={20} />
          </div>
          <p className="text-[13px] font-medium leading-[1.45] text-text-muted sm:text-[14px]">
            Onayladığınızda işlem hemen uygulanır.
          </p>
        </div>
      </Modal>
    </>
  );
}
