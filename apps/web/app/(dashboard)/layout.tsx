import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DashboardUnavailable } from "@/components/layout/dashboard-unavailable";
import { ensureServerBootstrap, getServerAuthSessionUser } from "@/lib/auth";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

function isNextRedirectError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: string }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  try {
    const user = await getServerAuthSessionUser();

    if (!user) {
      redirect("/login");
    }

    const workspace = await requireWorkspace();

    if (!workspace) {
      redirect("/login");
    }

    await ensureServerBootstrap(workspace.userId);

    return (
      <DashboardShell userEmail={user.email} workspaceName={workspace.workspaceName}>
        {children}
      </DashboardShell>
    );
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error;
    }

    return <DashboardUnavailable />;
  }
}
