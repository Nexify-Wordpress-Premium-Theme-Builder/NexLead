import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ensureServerBootstrap, getServerAuthSessionUser } from "@/lib/auth";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
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
}
