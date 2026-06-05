"use client";

import { useEffect, useRef, useState } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp(
  target: number,
  options?: { duration?: number; delay?: number; enabled?: boolean },
) {
  const duration = options?.duration ?? 1100;
  const delay = options?.delay ?? 0;
  const enabled = options?.enabled ?? true;
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      setValue(target);
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setValue(Math.round(eased * target));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          setValue(target);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    if (delay > 0) {
      timeoutId = setTimeout(start, delay);
    } else {
      start();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, delay, enabled]);

  return value;
}
