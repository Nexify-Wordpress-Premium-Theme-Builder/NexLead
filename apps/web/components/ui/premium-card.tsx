import type { ReactNode } from "react";

type PremiumCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "kpi" | "chart" | "panel";
  hover?: boolean;
};

const PADDING_MAP = {
  kpi: "p-[18px]",
  chart: "p-6",
  panel: "p-[22px]",
} as const;

export function PremiumCard({
  children,
  className = "",
  padding = "panel",
  hover = true,
}: PremiumCardProps) {
  return (
    <div
      className={`premium-card rounded-[22px] border border-[rgba(15,23,42,0.08)] bg-white ${PADDING_MAP[padding]} ${
        hover ? "premium-card-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
