"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconGlobe, IconLayout, IconUsers } from "@/components/ui/icons";

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
  { label: "Outreach", disabled: true },
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

  return <IconLayout className="h-[18px] w-[18px]" />;
}

export function DashboardSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const active = item.href ? isActive(pathname, item.href) : false;

        if (!item.href || item.disabled) {
          return (
            <span
              key={item.label}
              className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted"
              aria-disabled="true"
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
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-surface-soft text-text-primary"
                : "text-text-secondary hover:bg-surface-soft hover:text-text-primary"
            }`}
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
