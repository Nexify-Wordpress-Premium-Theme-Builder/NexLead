import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div>
        <h1>Sign in</h1>
        <p>Access your NexLead workspace and pipeline.</p>
        <p className="mt-4 text-sm text-text-muted">
          <Link href={ROUTES.app.dashboard}>Continue to dashboard</Link>
        </p>
      </div>
    </main>
  );
}
