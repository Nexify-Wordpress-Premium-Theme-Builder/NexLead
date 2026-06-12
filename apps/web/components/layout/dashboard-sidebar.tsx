"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  IconFileText,
  IconGlobe,
  IconLayout,
  IconSettings,
  IconUsers,
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

function NavIcon({ label }: { label: string }) {
  if (label === "Leadler") {
    return <IconUsers className="h-[18px] w-[18px]" />;
  }

  if (label === "Web Site Analizleri") {
    return <IconGlobe className="h-[18px] w-[18px]" />;
  }

  if (label === "Raporlar") {
    return <IconFileText className="h-[18px] w-[18px]" />;
  }

  if (label === "Ayarlar") {
    return <IconSettings className="h-[18px] w-[18px]" />;
  }

  return <IconLayout className="h-[18px] w-[18px]" />;
}

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col">
      <nav className="flex-1 space-y-0.5 px-3 py-3" aria-label="Ana menü">
        <p className="px-3 pb-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-text-muted">
          Menü
        </p>
        {NAV_ITEMS.map((item) => {
          const active = item.href ? isActive(pathname, item.href) : false;

          if (!item.href || item.disabled) {
            return (
              <span
                key={item.label}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-text-muted"
                aria-disabled="true"
                title="Yakında"
              >
                <NavIcon label={item.label} />
                {item.label}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                active
                  ? "bg-gradient-to-r from-accent/12 to-accent-purple/10 text-accent shadow-sm ring-1 ring-accent/10"
                  : "text-text-secondary hover:bg-surface-soft hover:text-text-heading"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <NavIcon label={item.label} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <div className="rounded-xl border border-border/80 bg-gradient-to-br from-surface-soft to-surface p-3.5 shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-bold text-text-heading">NexLead Asistan</p>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
              Yakında
            </span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-text-secondary">
            Analiz ve lead süreçleriniz için akıllı öneriler yakında burada olacak.
          </p>
        </div>
      </div>
    </div>
  );
}

export function getDashboardSectionTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard/leads")) {
    return "Leadler";
  }

  if (pathname.startsWith("/dashboard/websites")) {
    return "Web Site Analizleri";
  }

  return "Genel Bakış";
}
