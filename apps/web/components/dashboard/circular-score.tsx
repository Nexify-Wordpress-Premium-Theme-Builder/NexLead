"use client";

import { useEffect, useId, useState } from "react";

type CircularScoreProps = {
  score: number | null;
  label: string;
  qualityLabel?: string;
  size?: "xs" | "sm" | "md" | "hero";
  color?: string;
};

const SIZE_MAP = {
  xs: { size: 68, stroke: 7, scoreText: "text-base", qualityText: "text-[10px]", labelText: "text-[12px]" },
  sm: { size: 80, stroke: 8, scoreText: "text-xl", qualityText: "text-[11px]", labelText: "text-[13px]" },
  md: { size: 100, stroke: 9, scoreText: "text-2xl", qualityText: "text-xs", labelText: "text-sm" },
  hero: { size: 112, stroke: 9, scoreText: "text-[28px]", qualityText: "text-xs", labelText: "text-sm" },
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
  const { size: dimension, stroke, scoreText, qualityText, labelText } = SIZE_MAP[size];
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
    const duration = 1000;

    const tick = (now: number) => {
      const progressValue = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progressValue) ** 3;
      setAnimatedScore(clampedScore * eased);
      if (progressValue < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [clampedScore, hasScore]);

  return (
    <div className={`flex flex-col items-center ${size === "hero" ? "" : ""}`}>
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg width={dimension} height={dimension} className="-rotate-90" aria-hidden="true">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={color} stopOpacity="0.7" />
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
          <span className={`${scoreText} font-extrabold tabular-nums tracking-[-0.05em] text-[#0B1220]`}>
            {hasScore ? Math.round(animatedScore) : "—"}
          </span>
        </div>
      </div>
      <p className={`mt-2 text-center font-bold text-[#0F172A] ${labelText}`}>{label}</p>
      {qualityLabel ? (
        <p className={`mt-0.5 text-center font-semibold text-[#64748B] ${qualityText}`}>{qualityLabel}</p>
      ) : null}
    </div>
  );
}
