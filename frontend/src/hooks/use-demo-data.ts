"use client";

import { useContext } from "react";
import { DemoDataContext } from "@/components/providers/demo-data-provider";

export function useDemoData() {
  const context = useContext(DemoDataContext);

  if (!context) {
    throw new Error("useDemoData must be used inside DemoDataProvider.");
  }

  return context;
}
