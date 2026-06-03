import { Bell, ChevronDown, Filter, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function TopHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-4 border-b border-border bg-surface px-6 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative hidden min-w-0 flex-1 sm:block sm:max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="search"
            placeholder="Search leads, companies, domains..."
            className="h-11 w-full rounded-xl border border-border bg-slate-50/50 pl-10 pr-20 text-sm text-text-primary placeholder:text-text-muted focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-text-muted sm:inline">
            ⌘ K
          </kbd>
        </div>
        <Button variant="secondary" size="md" className="hidden shrink-0 gap-2 rounded-xl sm:inline-flex">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="flex shrink-0 items-center gap-3 md:gap-4">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary transition-all duration-200 hover:bg-slate-50"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface py-1.5 pl-1.5 pr-3">
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
