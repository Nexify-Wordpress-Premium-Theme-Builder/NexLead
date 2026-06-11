"use client";

type WebsiteDetailErrorProps = {
  reset: () => void;
};

export default function WebsiteDetailError({ reset }: WebsiteDetailErrorProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-surface p-8 text-center shadow-soft">
      <h1 className="text-xl font-semibold text-text-primary">Web site detayı yüklenemedi</h1>
      <p className="mt-3 text-sm text-text-secondary">
        Web site bilgileri gösterilirken beklenmeyen bir sorun oluştu.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-primary shadow-sm transition-colors hover:bg-surface-soft"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
