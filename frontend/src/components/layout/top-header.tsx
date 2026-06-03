import { Bell, ChevronDown, Filter, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export function TopHeader() {
  return (
    <header className="animate-fade-down sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-border-soft bg-[rgba(255,255,255,0.9)] px-6 backdrop-blur-md md:px-7">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-[520px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            placeholder="Search leads, companies, domains..."
            className="h-11 w-full rounded-[14px] border border-border-soft bg-surface pl-10 pr-[4.5rem] text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border-soft bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted sm:inline">
            ⌘ K
          </kbd>
        </div>
        <button
          type="button"
          className="hidden h-11 shrink-0 items-center gap-2 rounded-[14px] border border-border-soft bg-surface px-4 text-sm font-medium text-text-secondary transition-all duration-200 hover:bg-surface-muted sm:inline-flex"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-[10px] border border-border-soft bg-surface text-text-secondary transition-all duration-200 hover:bg-surface-muted"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red px-1 text-[10px] font-bold leading-none text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-2.5 rounded-[14px] border border-border-soft bg-surface py-1.5 pl-1.5 pr-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <Avatar name="John Carter" className="h-9 w-9" />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight text-text-primary">John Carter</p>
            <p className="text-xs text-text-muted">Acme Marketing</p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-text-muted sm:block" />
        </div>
      </div>
    </header>
  );
}
