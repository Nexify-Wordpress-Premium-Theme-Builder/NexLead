"use client";

import type { ReactNode } from "react";
import { DemoDataProvider } from "@/components/providers/demo-data-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

export interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider>
      <DemoDataProvider>{children}</DemoDataProvider>
    </ToastProvider>
  );
}
