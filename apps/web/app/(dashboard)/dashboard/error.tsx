"use client";

type DashboardErrorProps = {
  reset: () => void;
};

export default function DashboardError({ reset }: DashboardErrorProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 text-center">
      <h1 className="text-xl font-semibold text-text-primary">Genel bakış yüklenemedi</h1>
      <p className="mt-3 text-sm text-text-secondary">
        Dashboard verileri gösterilirken beklenmeyen bir sorun oluştu.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-soft"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
