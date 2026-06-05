import Link from "next/link";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/routes";

export default function HomePage() {
  if (process.env.NODE_ENV === "production") {
    redirect(ROUTES.app.dashboard);
  }

  return (
    <main className="app-premium-bg flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-3xl font-semibold text-text-primary">NexLead</h1>
      <p className="max-w-lg text-center text-text-secondary">
        AI-powered client acquisition, website audit, outreach, and meeting preparation
        for agencies and B2B service providers.
      </p>
      <div className="flex gap-3">
        <Link
          href={ROUTES.app.dashboard}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Go to Dashboard
        </Link>
        <Link
          href={ROUTES.auth.login}
          className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary"
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
