import Link from "next/link";
import { ROUTES } from "@/lib/routes";

export default function NotFound() {
  return (
    <main className="app-premium-bg flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold text-text-primary">Page not found</h1>
      <p className="max-w-md text-center text-text-secondary">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link href={ROUTES.app.dashboard} className="btn-campaign inline-flex h-10 items-center px-4">
        Back to Dashboard
      </Link>
    </main>
  );
}
