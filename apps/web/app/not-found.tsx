import Link from "next/link";

import { Button } from "@/components/ui/button";
import { IconLayout } from "@/components/ui/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="nx-card w-full max-w-lg p-8 text-center">
        <div className="nx-icon-badge nx-icon-badge--blue mx-auto h-14 w-14">
          <IconLayout size={26} />
        </div>
        <h1 className="mt-5 text-[22px] font-extrabold tracking-[-0.03em] text-text-primary sm:text-[26px]">
          Sayfa bulunamadı
        </h1>
        <p className="mt-3 text-[14px] font-medium leading-[1.45] text-text-muted">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <Link href="/dashboard">
            <Button type="button" variant="secondary" className="w-full sm:w-auto">
              Genel Bakışa Dön
            </Button>
          </Link>
          <Link href="/login">
            <Button type="button" className="w-full sm:w-auto">
              Giriş Sayfası
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
