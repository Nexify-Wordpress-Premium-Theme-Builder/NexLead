import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface PageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-[30px] font-extrabold leading-tight tracking-[-0.02em] text-text-primary md:text-[32px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 text-[15px] leading-relaxed text-[#64748B]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
