import type { CSSProperties, ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
  style?: CSSProperties;
};

const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
} as const;

export function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
  style,
}: CardProps) {
  return (
    <div
      className={`nx-card ${PADDING[padding]} ${hover ? "nx-card-hover" : ""} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
