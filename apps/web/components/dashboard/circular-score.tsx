"use client";

import { useEffect, useState } from "react";

type CircularScoreProps = {
  score: number | null;
  label: string;
  qualityLabel?: string;
  size?: "sm" | "md";
  color?: string;
};

const SIZE_MAP = {
  sm: { size: 76, stroke: 7, scoreText: "text-lg", qualityText: "text-[10px]" },
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
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg width={dimension} height={dimension} className="-rotate-90" aria-hidden="true">
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke="#F2F4F7"
            strokeWidth={stroke}
          />
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${scoreText} font-semibold tabular-nums text-text-primary`}>
            {hasScore ? Math.round(animatedScore) : "—"}
          </span>
          {size === "md" ? <span className="text-xs text-text-muted">/ 100</span> : null}
        </div>
      </div>
      <p className={`mt-2 text-center font-medium text-text-secondary ${size === "sm" ? "text-xs" : "text-sm"}`}>
        {label}
      </p>
      {qualityLabel ? (
        <p className={`mt-0.5 text-center text-text-muted ${qualityText}`}>{qualityLabel}</p>
      ) : !hasScore ? (
        <p className={`mt-0.5 text-center text-text-muted ${qualityText}`}>Henüz ölçülmedi</p>
      ) : null}
    </div>
  );
}
