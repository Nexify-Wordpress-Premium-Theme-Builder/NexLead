import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function LoginPage() {
  return (
    <main className="app-premium-bg flex min-h-screen items-center justify-center p-6">
      <div className="panel-premium max-w-md p-8 text-center">
        <h1 className="text-2xl font-bold text-text-primary">Giriş Yap</h1>
        <p className="mt-2 text-text-secondary">NexLead çalışma alanınıza ve satış sürecinize erişin.</p>
        <p className="mt-4 text-sm text-text-muted">
          <Link href={ROUTES.app.dashboard} className="font-semibold text-primary hover:text-primary-hover">
            Panele devam et
          </Link>
        </p>
      </div>
    </main>
  );
}
