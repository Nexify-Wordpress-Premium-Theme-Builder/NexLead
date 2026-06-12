"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { NexLeadLogo } from "@/components/brand/nexlead-logo";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { IconClose } from "@/components/ui/icons";

type DashboardShellProps = {
  userEmail: string | null;
  workspaceName: string | null;
  children: ReactNode;
};

export function DashboardShell({ userEmail, workspaceName, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-40 bg-primary/15 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-4">
          <div className="min-w-0 flex-1">
            <NexLeadLogo variant="full" className="max-w-full" />
          </div>
          <button
            type="button"
            className="rounded-lg p-2 text-text-secondary transition-colors hover:bg-surface-soft lg:hidden"
            aria-label="Menüyü kapat"
            onClick={() => setMobileOpen(false)}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <DashboardSidebar onNavigate={() => setMobileOpen(false)} />

        <div className="mt-auto border-t border-border p-3">
          <div className="mb-3 rounded-xl border border-border bg-surface-soft/50 px-3 py-2.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-text-muted">Oturum</p>
            <p className="truncate text-sm font-medium text-text-primary">{userEmail ?? "Kullanıcı"}</p>
            <p className="mt-0.5 text-xs text-text-muted">Pro Plan</p>
          </div>
          <LogoutButton compact />
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <DashboardHeader
          workspaceName={workspaceName}
          userEmail={userEmail}
          showMenuButton
          onMenuOpen={() => setMobileOpen(true)}
        />

        <main className="overflow-x-hidden px-4 py-5 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
