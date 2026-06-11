import type { SVGProps } from "react";

type NexLeadLogoProps = SVGProps<SVGSVGElement> & {
  showWordmark?: boolean;
};

export function NexLeadLogo({ showWordmark = true, className, ...props }: NexLeadLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-8 w-8 shrink-0"
        {...props}
      >
        <rect x="2" y="2" width="28" height="28" rx="8" fill="#111827" />
        <path
          d="M10 22V10L16 17.5L22 10V22"
          stroke="#FFFFFF"
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark ? (
        <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-text-primary">
          NexLead
        </span>
      ) : null}
    </div>
  );
}
