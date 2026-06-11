import type { InputHTMLAttributes, ReactNode } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: ReactNode;
  error?: string;
};

export function Input({ label, icon, error, className = "", id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="text-sm font-medium text-text-primary">{label}</span>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={`h-11 w-full rounded-lg border bg-surface text-sm text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15 ${icon ? "pl-10 pr-3" : "px-3"} ${error ? "border-error" : "border-border"} ${className}`}
          {...props}
        />
      </div>
      {error ? <span className="text-sm text-error">{error}</span> : null}
    </label>
  );
}
