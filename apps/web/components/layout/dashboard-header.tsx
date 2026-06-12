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
    <header className="sticky top-0 z-30 border-b border-border/70 bg-surface/90 shadow-[0_1px_0_rgba(15,23,42,0.03)] backdrop-blur-xl">
      <div className="flex h-[4.25rem] items-center gap-3 px-4 sm:px-6">
        {showMenuButton ? (
          <button
            type="button"
            className="rounded-xl border border-border/80 p-2 text-text-secondary transition-colors hover:bg-surface-soft lg:hidden"
            aria-label="Menüyü aç"
            onClick={onMenuOpen}
          >
            <span className="block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
          </button>
        ) : null}

        <div className="hidden min-w-0 shrink-0 lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-text-muted">
            Çalışma Alanı
          </p>
          <p className="truncate text-[13px] font-bold text-text-heading">
            {getWorkspaceDisplayName(workspaceName)}
          </p>
        </div>

        <label className="relative mx-auto hidden min-w-0 max-w-2xl flex-1 md:block">
          <span className="sr-only">Ara</span>
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            disabled
            placeholder="Ara: lead, şirket, web site..."
            className="h-10 w-full rounded-xl border border-border/80 bg-[#F8FAFC] pl-10 pr-14 text-[13px] font-medium text-text-primary shadow-inner shadow-black/[0.02] placeholder:font-normal placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/15 disabled:cursor-not-allowed disabled:opacity-90"
            aria-disabled="true"
          />
          <span className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border/80 bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-text-muted sm:inline">
            ⌘K
          </span>
        </label>

        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            disabled
            className="hidden h-9 items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 text-[12px] font-semibold text-text-secondary shadow-sm disabled:cursor-not-allowed disabled:opacity-90 lg:inline-flex"
            aria-disabled="true"
          >
            <IconCalendar className="h-3.5 w-3.5" />
            <span>Son 30 gün</span>
          </button>

          <button
            type="button"
            disabled
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-surface text-text-secondary shadow-sm disabled:cursor-not-allowed disabled:opacity-90"
            aria-label="Bildirimler yakında"
            aria-disabled="true"
          >
            <IconBell className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-sm">
              3
            </span>
          </button>

          <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border/80 bg-surface py-1 pl-1 pr-2.5 shadow-sm sm:pr-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/15 to-accent-purple/15 text-sm font-bold text-accent">
              {getUserInitials(userEmail)}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-[13px] font-bold text-text-heading">
                {getUserDisplayName(userEmail)}
              </p>
              <p className="flex items-center gap-1 truncate text-[11px] font-medium text-text-muted">
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
