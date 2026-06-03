import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-40 hidden md:block">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col md:pl-[260px]">
        <TopHeader />
        <main className="flex-1 px-6 py-6 pb-24 md:px-8 md:py-8 md:pb-8">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
