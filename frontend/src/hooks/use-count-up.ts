"use client";

import { useEffect, useState } from "react";

type UseCountUpOptions = {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
};

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function useCountUp({
  end,
  start = 0,
  duration = 1100,
  delay = 0,
}: UseCountUpOptions) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(end);
      return;
    }

    let frameId = 0;
    let startTime: number | null = null;
    const timeoutId = window.setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;

        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);

        setValue(Math.round(start + (end - start) * eased));

        if (progress < 1) {
          frameId = requestAnimationFrame(animate);
        } else {
          setValue(end);
        }
      };

      frameId = requestAnimationFrame(animate);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [end, start, duration, delay]);

  return value;
}
