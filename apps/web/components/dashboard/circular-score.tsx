"use client";

import { useEffect, useId, useState } from "react";

type CircularScoreProps = {
  score: number | null;
  label: string;
  qualityLabel?: string;
  size?: "sm" | "md";
  color?: string;
};

const SIZE_MAP = {
  sm: { size: 80, stroke: 6.5, scoreText: "text-lg", qualityText: "text-[10px]" },
  md: { size: 132, stroke: 10, scoreText: "text-3xl", qualityText: "text-xs" },
} as const;

export function CircularScore({
  score,
  label,
  qualityLabel,
  size = "md",
  color = "#2563EB",
}: CircularScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const gradientId = useId();
  const hasScore = score !== null && Number.isFinite(score);
  const clampedScore = hasScore ? Math.max(0, Math.min(100, score)) : 0;
  const { size: dimension, stroke, scoreText, qualityText } = SIZE_MAP[size];
  const radius = (dimension - stroke) / 2;
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
    const duration = 850;

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
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg width={dimension} height={dimension} className="-rotate-90" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.72" />
            </linearGradient>
          </defs>
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke="#EEF2F7"
            strokeWidth={stroke}
          />
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${scoreText} font-bold tabular-nums tracking-[-0.04em] text-text-primary`}>
            {hasScore ? Math.round(animatedScore) : "—"}
          </span>
          {size === "md" ? <span className="text-[11px] font-medium text-text-muted">/ 100</span> : null}
        </div>
      </div>
      <p className={`mt-2 text-center font-semibold text-text-heading ${size === "sm" ? "text-[11px]" : "text-sm"}`}>
        {label}
      </p>
      {qualityLabel ? (
        <p className={`mt-0.5 text-center font-medium text-text-secondary ${qualityText}`}>{qualityLabel}</p>
      ) : !hasScore ? (
        <p className={`mt-0.5 text-center text-text-muted ${qualityText}`}>Henüz ölçülmedi</p>
      ) : null}
    </div>
  );
}
