import type { ReactNode } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "kpi" | "chart" | "panel";
  hover?: boolean;
  radius?: "default" | "chart";
};

const PADDING_MAP = {
  kpi: "p-[18px]",
  chart: "p-[26px]",
  panel: "p-[22px]",
} as const;

const RADIUS_MAP = {
  default: "rounded-[24px]",
  chart: "rounded-[26px]",
} as const;

export function PremiumCard({
  children,
  className = "",
  padding = "panel",
  hover = true,
  radius = "default",
}: PremiumCardProps) {
  return (
    <div
      className={`nx-card ${RADIUS_MAP[radius]} ${PADDING_MAP[padding]} ${
        hover ? "nx-card-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
