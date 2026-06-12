"use client";

import { useEffect, useState } from "react";

type CircularScoreProps = {
  score: number | null;
  label: string;
  size?: number;
};

export function CircularScore({ score, label, size = 132 }: CircularScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const hasScore = score !== null && Number.isFinite(score);
  const clampedScore = hasScore ? Math.max(0, Math.min(100, score)) : 0;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = hasScore ? (animatedScore / 100) * circumference : 0;

  useEffect(() => {
    if (!hasScore) {
      setAnimatedScore(0);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setAnimatedScore(clampedScore);
      return;
    }

    let frameId = 0;
    const start = performance.now();
    const duration = 800;

    const tick = (now: number) => {
      const progressValue = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progressValue) ** 3;
      setAnimatedScore(clampedScore * eased);

      if (progressValue < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [clampedScore, hasScore]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F2F4F7"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2563EB"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums text-text-primary">
            {hasScore ? Math.round(animatedScore) : "—"}
          </span>
          <span className="text-xs text-text-muted">/ 100</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-text-secondary">{label}</p>
      {!hasScore ? (
        <p className="mt-1 text-xs text-text-muted">Henüz analiz sonucu bulunmuyor</p>
      ) : null}
    </div>
  );
}
