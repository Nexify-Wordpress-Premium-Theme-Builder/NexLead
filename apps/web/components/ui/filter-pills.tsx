"use client";

type FilterPillOption<T extends string> = {
  value: T;
  label: string;
};

type FilterPillsProps<T extends string> = {
  options: FilterPillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
};

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  ariaLabel = "Filtre",
}: FilterPillsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
              active
                ? "border-accent bg-accent-soft text-accent"
                : "border-[var(--nx-border)] bg-surface text-text-secondary hover:bg-surface-soft"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
