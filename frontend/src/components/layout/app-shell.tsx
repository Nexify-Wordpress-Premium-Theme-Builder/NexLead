import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-premium-bg flex min-h-screen">
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col md:pl-[260px]">
        <TopHeader />
        <main className="flex-1 overflow-x-hidden px-6 py-7 pb-24 md:px-8 md:py-[28px] md:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
