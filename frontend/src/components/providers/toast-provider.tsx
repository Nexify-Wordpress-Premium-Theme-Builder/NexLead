"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Toast } from "@/components/ui/toast";
import { ToastContext, type ToastInput, type ToastItem, type ToastVariant } from "@/hooks/use-toast";

const DEFAULT_TOAST_DURATION = 2500;

export interface ToastProviderProps {
  children: ReactNode;
}

function createToastId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerMapRef = useRef<Record<string, number>>({});

  const dismissToast = useCallback((toastId: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId));

    const timerId = timerMapRef.current[toastId];
    if (timerId) {
      window.clearTimeout(timerId);
      delete timerMapRef.current[toastId];
    }
  }, []);

  const scheduleDismiss = useCallback(
    (toastId: string, durationMs: number) => {
      const timerId = window.setTimeout(() => {
        dismissToast(toastId);
      }, durationMs);

      timerMapRef.current[toastId] = timerId;
    },
    [dismissToast],
  );

  const toast = useCallback(
    (input: ToastInput): string => {
      const toastId = createToastId();
      const nextToast: ToastItem = {
        id: toastId,
        title: input.title,
        description: input.description,
        variant: input.variant ?? "info",
        durationMs: input.durationMs ?? DEFAULT_TOAST_DURATION,
      };

      setToasts((currentToasts) => [nextToast, ...currentToasts].slice(0, 5));
      scheduleDismiss(toastId, nextToast.durationMs);

      return toastId;
    },
    [scheduleDismiss],
  );

  const showByVariant = useCallback(
    (variant: ToastVariant, title: string, description?: string) =>
      toast({ title, description, variant }),
    [toast],
  );

  const clearToasts = useCallback(() => {
    Object.values(timerMapRef.current).forEach((timerId) => window.clearTimeout(timerId));
    timerMapRef.current = {};
    setToasts([]);
  }, []);

  useEffect(() => {
    return () => {
      Object.values(timerMapRef.current).forEach((timerId) => window.clearTimeout(timerId));
      timerMapRef.current = {};
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      toasts,
      toast,
      dismissToast,
      clearToasts,
      success: (title: string, description?: string) => showByVariant("success", title, description),
      info: (title: string, description?: string) => showByVariant("info", title, description),
      warning: (title: string, description?: string) => showByVariant("warning", title, description),
      error: (title: string, description?: string) => showByVariant("error", title, description),
    }),
    [dismissToast, showByVariant, toast, toasts, clearToasts],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[90] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toastItem) => (
          <Toast key={toastItem.id} toast={toastItem} onClose={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
