"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="tr">
      <body className="bg-[#f5f7fb] font-sans text-[#0f172a] antialiased">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-[20px] border border-[rgba(15,23,42,0.08)] bg-white p-8 text-center shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
            <h1 className="text-[22px] font-bold">Beklenmeyen bir hata oluştu</h1>
            <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#64748b]">
              Geliştirme sırasında bozuk önbellek veya geçici bağlantı sorunu olabilir. Sayfayı yenileyin;
              devam ederse geliştirme sunucusunu durdurup <code className="text-[13px]">pnpm dev:clean</code>{" "}
              sonrası tekrar başlatın.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#4f46e5] px-5 text-[14px] font-semibold text-white"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
