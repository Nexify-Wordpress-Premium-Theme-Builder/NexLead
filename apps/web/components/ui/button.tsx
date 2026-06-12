import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "md" | "sm";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover border border-accent active:scale-[0.98] disabled:opacity-60",
  secondary:
    "bg-surface text-text-primary hover:bg-surface-soft border active:scale-[0.98] disabled:opacity-60",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-soft active:scale-[0.98] disabled:opacity-60",
  danger:
    "bg-error/10 text-error hover:bg-error/15 border border-error/20 active:scale-[0.98] disabled:opacity-60",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-[14px] font-bold",
  sm: "h-9 px-3 text-[13px] font-bold",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/15 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={variant === "secondary" ? { borderColor: "var(--nx-border)" } : undefined}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
