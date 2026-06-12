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
      <span className="text-[14px] font-semibold text-text-primary">{label}</span>
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          className={`nx-input ${icon ? "pl-10" : ""} ${error ? "border-error focus:border-error focus:ring-error/10" : ""} ${className}`}
          {...props}
        />
      </div>
      {error ? <span className="text-[13px] font-medium text-error">{error}</span> : null}
    </label>
  );
}
