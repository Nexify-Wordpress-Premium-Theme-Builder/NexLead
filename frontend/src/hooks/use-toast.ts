"use client";

import { createContext, useContext } from "react";

export type ToastVariant = "success" | "info" | "warning" | "error";

export interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

export interface ToastItem extends ToastInput {
  id: string;
  variant: ToastVariant;
  durationMs: number;
}

export interface ToastContextValue {
  toasts: ToastItem[];
  toast: (input: ToastInput) => string;
  dismissToast: (toastId: string) => void;
  clearToasts: () => void;
  success: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
