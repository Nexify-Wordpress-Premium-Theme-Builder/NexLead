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
    <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Ana menü">
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-muted">
        Menü
      </p>
      {NAV_ITEMS.map((item) => {
        const active = item.href ? isActive(pathname, item.href) : false;

        if (!item.href || item.disabled) {
          return (
            <span
              key={item.label}
              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-muted"
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
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-accent/10 text-accent shadow-sm"
                : "text-text-secondary hover:bg-surface-soft hover:text-text-primary"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <NavIcon label={item.label} />
            {item.label}
          </Link>
        );
      })}
    </nav>
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
