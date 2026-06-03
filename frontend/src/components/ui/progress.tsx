import { cn } from "@/lib/cn";

export interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, className }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-border", className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
