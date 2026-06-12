"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const AUDIT_DETAIL_REFRESH_INTERVAL_MS = 6000;
export const AUDIT_LIST_REFRESH_INTERVAL_MS = 9000;

type AuditStatusRefreshProps = {
  isActive: boolean;
  intervalMs?: number;
  message?: string;
};

function isDocumentVisible(): boolean {
  return typeof document === "undefined" || document.visibilityState === "visible";
}

export function AuditStatusRefresh({
  isActive,
  intervalMs = AUDIT_DETAIL_REFRESH_INTERVAL_MS,
  message = "Durum otomatik güncelleniyor",
}: AuditStatusRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const refreshIfVisible = () => {
      if (isDocumentVisible()) {
        router.refresh();
      }
    };

    const intervalId = setInterval(refreshIfVisible, intervalMs);

    const handleVisibilityChange = () => {
      if (isDocumentVisible()) {
        router.refresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, intervalMs, router]);

  if (!isActive) {
    return null;
  }

  return <p className="text-xs text-text-muted">{message}</p>;
}
