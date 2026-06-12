"use client";

import { IconBell, IconCalendar, IconSearch, IconUser } from "@/components/ui/icons";

type DashboardHeaderProps = {
  workspaceName: string | null;
  userEmail: string | null;
  onMenuOpen?: () => void;
  showMenuButton?: boolean;
};

function getWorkspaceDisplayName(workspaceName: string | null): string {
  if (workspaceName?.trim()) return workspaceName.trim();
  return "Çalışma alanı hazırlanıyor";
}

function getUserDisplayName(userEmail: string | null): string {
  if (!userEmail) return "Kullanıcı";
  const localPart = userEmail.split("@")[0] ?? userEmail;
  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
    <header className="sticky top-0 z-30 border-b border-[rgba(15,23,42,0.06)] bg-white/[0.86] backdrop-blur-xl">
      <div className="flex h-[72px] items-center gap-4 px-6">
        {showMenuButton ? (
          <button
            type="button"
            className="rounded-xl border border-[rgba(15,23,42,0.08)] p-2.5 text-[#64748B] transition-colors hover:bg-[#F8FAFC] lg:hidden"
            aria-label="Menüyü aç"
            onClick={onMenuOpen}
          >
            <span className="block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
            <span className="mt-1 block h-0.5 w-4 bg-current" />
          </button>
        ) : null}

        <div className="hidden min-w-0 shrink-0 lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
            Çalışma Alanı
          </p>
          <p className="truncate text-[15px] font-extrabold text-[#0F172A]">
            {getWorkspaceDisplayName(workspaceName)}
          </p>
        </div>

        <label className="relative mx-auto hidden min-w-0 max-w-[520px] flex-1 lg:block">
          <span className="sr-only">Ara</span>
          <IconSearch
            className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94A3B8]"
            strokeWidth={2.2}
          />
          <input
            type="search"
            disabled
            placeholder="Ara: lead, şirket, web site..."
            className="h-11 w-full rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] pl-11 pr-14 text-[14px] font-medium text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15 disabled:cursor-not-allowed"
            aria-disabled="true"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-lg border border-[rgba(15,23,42,0.08)] bg-white px-2 py-0.5 text-[11px] font-bold text-[#64748B]">
            ⌘K
          </span>
        </label>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            type="button"
            disabled
            className="hidden h-11 items-center gap-2 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white px-4 text-[13px] font-bold text-[#475569] shadow-sm disabled:cursor-not-allowed lg:inline-flex"
            aria-disabled="true"
          >
            <IconCalendar className="h-[18px] w-[18px]" strokeWidth={2.2} />
            <span>Son 30 gün</span>
          </button>

          <button
            type="button"
            disabled
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white text-[#64748B] shadow-sm disabled:cursor-not-allowed"
            aria-label="Bildirimler yakında"
            aria-disabled="true"
          >
            <IconBell className="h-5 w-5" strokeWidth={2.2} />
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#2563EB] px-1 text-[10px] font-extrabold text-white">
              3
            </span>
          </button>

          <div className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white py-1.5 pl-1.5 pr-3 shadow-sm">
            <div className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB]/12 to-[#7C3AED]/12 text-sm font-extrabold text-[#2563EB]">
              {getUserInitials(userEmail)}
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#16A34A]" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-[14px] font-extrabold text-[#0F172A]">
                {getUserDisplayName(userEmail)}
              </p>
              <p className="flex items-center gap-1 truncate text-[11px] font-medium text-[#64748B]">
                <IconUser className="h-3 w-3 shrink-0" strokeWidth={2.2} />
                <span className="truncate">{userEmail ?? "Aktif oturum"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
