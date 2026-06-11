import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getActiveWorkspace } from "@/features/workspaces/workspace.service";
import { ensureServerBootstrap, getServerAuthSessionUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getServerAuthSessionUser();

  if (!user) {
    redirect("/login");
  }

  await ensureServerBootstrap(user.id);

  const workspace = await getActiveWorkspace();

  return (
    <DashboardShell userEmail={user.email} workspaceName={workspace?.name ?? null}>
      {children}
    </DashboardShell>
  );
}
