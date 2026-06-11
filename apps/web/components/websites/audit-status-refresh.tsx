"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const DEFAULT_INTERVAL_MS = 6000;

type AuditStatusRefreshProps = {
  isActive: boolean;
  intervalMs?: number;
};

export function AuditStatusRefresh({
  isActive,
  intervalMs = DEFAULT_INTERVAL_MS,
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

  return <p className="text-xs text-text-muted">Durum otomatik güncelleniyor</p>;
}
