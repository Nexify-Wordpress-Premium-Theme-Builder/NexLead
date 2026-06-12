"use client";

import { IconBell, IconCalendar, IconSearch, IconUser } from "@/components/ui/icons";

type DashboardHeaderProps = {
  workspaceName: string | null;
  userEmail: string | null;
  onMenuOpen?: () => void;
  showMenuButton?: boolean;
};

function getWorkspaceDisplayName(workspaceName: string | null): string {
  if (workspaceName?.trim()) {
    return workspaceName.trim();
  }

  return "Çalışma alanı hazırlanıyor";
}

function getUserInitials(userEmail: string | null): string {
  if (!userEmail) {
    return "K";
  }

  return userEmail.slice(0, 1).toUpperCase();
}

export function DashboardHeader({
  workspaceName,
  userEmail,
  onMenuOpen,
  showMenuButton = false,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-md">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {showMenuButton ? (
            <button
              type="button"
              className="rounded-lg border border-border p-2 text-text-secondary transition-colors hover:bg-surface-soft lg:hidden"
              aria-label="Menüyü aç"
              onClick={onMenuOpen}
            >
              <span className="block h-0.5 w-4 bg-current" />
              <span className="mt-1 block h-0.5 w-4 bg-current" />
              <span className="mt-1 block h-0.5 w-4 bg-current" />
            </button>
          ) : null}
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-text-muted">
              Çalışma Alanı
            </p>
            <p className="truncate text-sm font-semibold text-text-primary">
              {getWorkspaceDisplayName(workspaceName)}
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 lg:max-w-3xl lg:flex-row lg:items-center lg:justify-end">
          <label className="relative hidden min-w-0 flex-1 sm:block">
            <span className="sr-only">Ara</span>
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              disabled
              placeholder="Ara: lead, şirket, web site..."
              className="h-10 w-full rounded-xl border border-border bg-surface-soft/70 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-80"
              aria-disabled="true"
            />
          </label>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              disabled
              className="hidden h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-sm text-text-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-80 md:inline-flex"
              aria-disabled="true"
            >
              <IconCalendar className="h-4 w-4" />
              <span>Son 30 gün</span>
            </button>

            <button
              type="button"
              disabled
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-80"
              aria-label="Bildirimler yakında"
              aria-disabled="true"
            >
              <IconBell className="h-4 w-4" />
            </button>

            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-surface px-2.5 py-1.5 sm:px-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                {getUserInitials(userEmail)}
              </div>
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-sm font-medium text-text-primary">
                  {userEmail ?? "Kullanıcı"}
                </p>
                <p className="flex items-center gap-1 text-xs text-text-muted">
                  <IconUser className="h-3 w-3" />
                  Aktif oturum
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
