"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { NexLeadLogo } from "@/components/brand/nexlead-logo";
import { LogoutButton } from "@/components/dashboard/logout-button";
import { IconClose, IconLayout, IconMenu } from "@/components/ui/icons";

type DashboardShellProps = {
  userEmail: string | null;
  children: ReactNode;
};

const NAV_ITEMS = [{ label: "Genel Bakış", href: "/dashboard", active: true }] as const;

export function DashboardShell({ userEmail, children }: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <NexLeadLogo />
          <button
            type="button"
            className="rounded-lg p-2 text-text-secondary hover:bg-surface-soft lg:hidden"
            aria-label="Menüyü kapat"
            onClick={() => setMobileOpen(false)}
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-surface-soft text-text-primary"
                  : "text-text-secondary hover:bg-surface-soft hover:text-text-primary"
              }`}
            >
              <IconLayout className="h-[18px] w-[18px]" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="mb-3 rounded-lg bg-surface-soft px-3 py-2.5">
            <p className="text-xs text-text-muted">Oturum</p>
            <p className="truncate text-sm font-medium text-text-primary">{userEmail ?? "Kullanıcı"}</p>
          </div>
          <LogoutButton compact />
        </div>
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/90 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-text-secondary hover:bg-surface-soft lg:hidden"
              aria-label="Menüyü aç"
              onClick={() => setMobileOpen(true)}
            >
              <IconMenu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm text-text-muted">Çalışma Alanı</p>
              <p className="text-sm font-medium text-text-primary">Genel Bakış</p>
            </div>
          </div>

          <div className="hidden sm:block">
            <LogoutButton />
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
