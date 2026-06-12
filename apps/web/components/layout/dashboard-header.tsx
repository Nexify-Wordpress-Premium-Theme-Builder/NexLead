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

function getUserDisplayName(userEmail: string | null): string {
  if (!userEmail) {
    return "Kullanıcı";
  }

  const localPart = userEmail.split("@")[0] ?? userEmail;
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
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

        <div className="hidden min-w-0 shrink-0 lg:block">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-text-muted">
            Çalışma Alanı
          </p>
          <p className="truncate text-sm font-semibold text-text-primary">
            {getWorkspaceDisplayName(workspaceName)}
          </p>
        </div>

        <label className="relative mx-auto hidden min-w-0 max-w-xl flex-1 md:block">
          <span className="sr-only">Ara</span>
          <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            disabled
            placeholder="Ara: lead, şirket, web site..."
            className="h-10 w-full rounded-xl border border-border bg-surface-soft/70 pl-10 pr-16 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-80"
            aria-disabled="true"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] text-text-muted sm:inline">
            ⌘K
          </span>
        </label>

        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            disabled
            className="hidden h-9 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-xs text-text-secondary disabled:cursor-not-allowed disabled:opacity-80 lg:inline-flex"
            aria-disabled="true"
          >
            <IconCalendar className="h-3.5 w-3.5" />
            <span>Son 30 gün</span>
          </button>

          <button
            type="button"
            disabled
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary disabled:cursor-not-allowed disabled:opacity-80"
            aria-label="Bildirimler yakında"
            aria-disabled="true"
          >
            <IconBell className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white">
              3
            </span>
          </button>

          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-surface py-1 pl-1 pr-2.5 sm:pr-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
              {getUserInitials(userEmail)}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-medium text-text-primary">
                {getUserDisplayName(userEmail)}
              </p>
              <p className="flex items-center gap-1 truncate text-[11px] text-text-muted">
                <IconUser className="h-3 w-3 shrink-0" />
                <span className="truncate">{userEmail ?? "Aktif oturum"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
