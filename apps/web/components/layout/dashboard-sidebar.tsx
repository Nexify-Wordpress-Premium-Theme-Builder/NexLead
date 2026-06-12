"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/dashboard/logout-button";
import { IconFileText, IconGlobe, IconLayout, IconSettings, IconUsers } from "@/components/ui/icons";

type NavItem = {
  label: string;
  href?: string;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Genel Bakış", href: "/dashboard" },
  { label: "Leadler", href: "/dashboard/leads" },
  { label: "Web Site Analizleri", href: "/dashboard/websites" },
  { label: "Raporlar", disabled: true },
  { label: "Ayarlar", disabled: true },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ label, active }: { label: string; active: boolean }) {
  const className = `h-5 w-5 ${active ? "text-accent" : "text-text-muted"}`;

  if (label === "Leadler") return <IconUsers className={className} size={20} />;
  if (label === "Web Site Analizleri") return <IconGlobe className={className} size={20} />;
  if (label === "Raporlar") return <IconFileText className={className} size={20} />;
  if (label === "Ayarlar") return <IconSettings className={className} size={20} />;
  return <IconLayout className={className} size={20} />;
}

function getUserInitials(userEmail: string | null): string {
  if (!userEmail) return "K";
  return userEmail.slice(0, 1).toUpperCase();
}

type DashboardSidebarProps = {
  userEmail: string | null;
  onNavigate?: () => void;
};

export function DashboardSidebar({ userEmail, onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col px-3 pb-4">
      <nav className="mt-4 flex-1" aria-label="Ana menü">
        <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.08em] text-text-muted">
          Menü
        </p>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href ? isActive(pathname, item.href) : false;

            if (!item.href || item.disabled) {
              return (
                <span
                  key={item.label}
                  className="nx-nav-item cursor-not-allowed opacity-50"
                  aria-disabled="true"
                  title="Yakında"
                >
                  <NavIcon label={item.label} active={false} />
                  {item.label}
                </span>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`nx-nav-item ${active ? "nx-nav-item-active" : "nx-nav-item-inactive"}`}
                aria-current={active ? "page" : undefined}
              >
                <NavIcon label={item.label} active={active} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-4 rounded-[var(--nx-radius)] border bg-surface-soft p-3" style={{ borderColor: "var(--nx-border)" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
            {getUserInitials(userEmail)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-text-primary">{userEmail ?? "Kullanıcı"}</p>
            <p className="text-[11px] font-medium text-text-muted">Aktif oturum</p>
          </div>
        </div>
        <div className="mt-3">
          <LogoutButton compact />
        </div>
      </div>
    </div>
  );
}

export function getDashboardSectionTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard/leads")) return "Leadler";
  if (pathname.startsWith("/dashboard/websites")) return "Web Site Analizleri";
  return "Genel Bakış";
}
