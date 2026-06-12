"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/dashboard/logout-button";
import {
  IconFileText,
  IconGlobe,
  IconLayout,
  IconSettings,
  IconUsers,
  IconZap,
} from "@/components/ui/icons";

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
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ label, active }: { label: string; active: boolean }) {
  const className = `h-5 w-5 ${active ? "text-[#2563EB]" : "text-[#64748B]"}`;

  if (label === "Leadler") return <IconUsers className={className} strokeWidth={2.2} />;
  if (label === "Web Site Analizleri") return <IconGlobe className={className} strokeWidth={2.2} />;
  if (label === "Raporlar") return <IconFileText className={className} strokeWidth={2.2} />;
  if (label === "Ayarlar") return <IconSettings className={className} strokeWidth={2.2} />;
  return <IconLayout className={className} strokeWidth={2.2} />;
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
    <div className="flex flex-1 flex-col px-[14px] pb-[18px]">
      <nav className="mt-[18px] flex-1" aria-label="Ana menü">
        <p className="mb-3 ml-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
          Menü
        </p>
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = item.href ? isActive(pathname, item.href) : false;

            if (!item.href || item.disabled) {
              return (
                <span
                  key={item.label}
                  className="sidebar-nav-item cursor-not-allowed text-[#94A3B8] opacity-70"
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
                className={`sidebar-nav-item ${active ? "sidebar-nav-item-active" : "sidebar-nav-item-inactive"}`}
                aria-current={active ? "page" : undefined}
              >
                <NavIcon label={item.label} active={active} />
                <span className="text-[14px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-4 space-y-3">
        <div
          className="rounded-[18px] border p-3.5"
          style={{
            background: "linear-gradient(135deg, #F8FAFF, #F4F0FF)",
            borderColor: "rgba(37,99,235,0.12)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-[#2563EB] shadow-sm">
                <IconZap className="h-4 w-4" strokeWidth={2.2} />
              </span>
              <p className="text-[13px] font-bold text-[#0F172A]">NexLead Asistan</p>
            </div>
            <span className="rounded-full bg-[#2563EB]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#2563EB]">
              Yakında
            </span>
          </div>
          <p className="mt-2 text-[12px] leading-relaxed text-[#64748B]">
            Akıllı öneriler ve analiz yardımcısı yakında burada.
          </p>
        </div>

        <div className="rounded-[18px] border border-[rgba(15,23,42,0.08)] bg-[#F8FAFC] p-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB]/15 to-[#7C3AED]/15 text-sm font-extrabold text-[#2563EB]">
              {getUserInitials(userEmail)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-bold text-[#0F172A]">{userEmail ?? "Kullanıcı"}</p>
              <p className="text-[11px] font-medium text-[#64748B]">Pro Plan · Aktif oturum</p>
            </div>
          </div>
          <div className="mt-3">
            <LogoutButton compact />
          </div>
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
