"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export interface LoadingButtonStateProps {
  isLoading?: boolean;
  loadingText?: string;
  children: ReactNode;
  className?: string;
}

export function LoadingButtonState({
  isLoading = false,
  loadingText = "Yükleniyor...",
  children,
  className,
}: LoadingButtonStateProps) {
  return (
    <span className={cn("inline-flex items-center justify-center gap-2", className)}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      <span>{isLoading ? loadingText : children}</span>
    </span>
  );
}
