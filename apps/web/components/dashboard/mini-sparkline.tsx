"use client";

import { useId } from "react";

type MiniSparklineProps = {
  values: number[];
  color?: string;
  className?: string;
};

type Point = { x: number; y: number };

function buildPoints(values: number[], width: number, height: number): Point[] {
  if (values.length === 0) return [];

  const max = Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x: index * step,
    y: height - (value / max) * (height - 6) - 3,
  }));
}

function buildSmoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;
    path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
  }

  return path;
}

export function MiniSparkline({
  values,
  color = "#2563EB",
  className,
}: MiniSparklineProps) {
  const gradientId = useId();
  const width = 64;
  const height = 24;
  const points = buildPoints(values, width, height);
  const hasData = values.some((value) => value > 0);
  const path = buildSmoothPath(points);

  if (!hasData) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#E2E8F0"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {points.length > 1 ? (
        <path
          d={`${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
          fill={`url(#${gradientId})`}
        />
      ) : null}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
