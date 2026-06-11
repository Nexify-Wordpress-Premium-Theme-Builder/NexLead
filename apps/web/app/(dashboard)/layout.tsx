import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ensureServerBootstrap, getServerAuthSessionUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getServerAuthSessionUser();

  if (!user) {
    redirect("/login");
  }

  await ensureServerBootstrap(user.id);

  return <DashboardShell userEmail={user.email}>{children}</DashboardShell>;
}
