"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/cn";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface px-2 py-2 md:hidden">
      <ul className="flex items-center justify-between gap-1 overflow-x-auto">
        {MAIN_NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-md px-2 py-1 text-[10px]",
                  isActive ? "text-primary" : "text-text-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
