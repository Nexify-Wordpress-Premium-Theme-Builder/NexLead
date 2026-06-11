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

    const intervalId = setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => clearInterval(intervalId);
  }, [isActive, intervalMs, router]);

  if (!isActive) {
    return null;
  }

  return <p className="text-xs text-text-muted">{message}</p>;
}
