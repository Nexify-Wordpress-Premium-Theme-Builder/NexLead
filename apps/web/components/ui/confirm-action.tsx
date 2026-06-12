"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type ConfirmActionProps = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  children: (open: () => void) => ReactNode;
};

export function ConfirmAction({
  title,
  description,
  confirmLabel = "Onayla",
  cancelLabel = "Vazgeç",
  loading = false,
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
      <Modal open={open} title={title} description={description} onClose={() => setOpen(false)}>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button type="button" variant="primary" loading={loading} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </Modal>
    </>
  );
}
