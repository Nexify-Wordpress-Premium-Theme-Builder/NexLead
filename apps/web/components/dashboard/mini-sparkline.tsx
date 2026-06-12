"use client";

type MiniSparklineProps = {
  values: number[];
  color?: string;
  className?: string;
};

function buildPoints(values: number[], width: number, height: number): string {
  if (values.length === 0) {
    return "";
  }

  const max = Math.max(...values, 1);
  const step = values.length > 1 ? width / (values.length - 1) : 0;

  return values
    .map((value, index) => {
      const x = index * step;
      const y = height - (value / max) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
}

export function MiniSparkline({
  values,
  color = "#2563EB",
  className,
}: MiniSparklineProps) {
  const width = 72;
  const height = 28;
  const points = buildPoints(values, width, height);
  const hasData = values.some((value) => value > 0);

  if (!hasData) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        aria-hidden="true"
      >
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#E5E7EB"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chart-line-draw"
      />
    </svg>
  );
}
