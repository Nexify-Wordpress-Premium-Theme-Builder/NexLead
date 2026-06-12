"use client";

import { IconBell, IconSearch } from "@/components/ui/icons";

type DashboardHeaderProps = {
  workspaceName: string | null;
  userEmail: string | null;
  onMenuOpen?: () => void;
  showMenuButton?: boolean;
};

function getWorkspaceDisplayName(workspaceName: string | null): string {
  if (workspaceName?.trim()) return workspaceName.trim();
  return "Çalışma alanı";
}

function getUserInitials(userEmail: string | null): string {
  if (!userEmail) return "K";
  return userEmail.slice(0, 1).toUpperCase();
}

export function DashboardHeader({
  workspaceName,
  userEmail,
  onMenuOpen,
  showMenuButton = false,
}: DashboardHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 border-b bg-surface/90 backdrop-blur-xl"
      style={{ borderColor: "var(--nx-border)" }}
    >
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        {showMenuButton ? (
          <button
            type="button"
            className="rounded-xl border p-2.5 text-text-muted transition-colors hover:bg-surface-soft lg:hidden"
            style={{ borderColor: "var(--nx-border)" }}
            aria-label="Menüyü aç"
            onClick={onMenuOpen}
          >
            <span className="block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
          </button>
        ) : null}

        <div className="hidden min-w-0 lg:block">
          <p className="text-[11px] font-bold uppercase tracking-wide text-text-muted">Çalışma Alanı</p>
          <p className="truncate text-[15px] font-bold text-text-primary">
            {getWorkspaceDisplayName(workspaceName)}
          </p>
        </div>

        <label className="relative mx-auto hidden min-w-0 max-w-md flex-1 lg:block">
          <span className="sr-only">Ara</span>
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="search"
            disabled
            placeholder="Lead, şirket veya web sitesi ara..."
            className="nx-input h-10 pl-10 pr-3 disabled:cursor-not-allowed"
            aria-disabled="true"
          />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            disabled
            className="hidden h-10 w-10 items-center justify-center rounded-xl border bg-surface text-text-muted disabled:cursor-not-allowed sm:inline-flex"
            style={{ borderColor: "var(--nx-border)" }}
            aria-label="Bildirimler"
            aria-disabled="true"
          >
            <IconBell size={20} />
          </button>

          <div
            className="flex items-center gap-2 rounded-xl border py-1 pl-1 pr-3"
            style={{ borderColor: "var(--nx-border)" }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-xs font-bold text-accent">
              {getUserInitials(userEmail)}
            </div>
            <span className="hidden max-w-[140px] truncate text-[13px] font-semibold text-text-primary sm:block">
              {userEmail?.split("@")[0] ?? "Kullanıcı"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
