"use client";

import { useEffect, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  durationMs?: number;
  className?: string;
};

function formatValue(value: number): string {
  return new Intl.NumberFormat("tr-TR").format(Math.round(value));
}

export function AnimatedNumber({
  value,
  durationMs = 900,
  className,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    let frameId = 0;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayValue(from + (value - from) * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [durationMs, value]);

  return <span className={className ?? "font-bold"}>{formatValue(displayValue)}</span>;
}
