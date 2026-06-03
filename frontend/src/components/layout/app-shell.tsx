import { MobileNav } from "./mobile-nav";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex min-h-screen flex-1 flex-col">
        <TopHeader />
        <main className="flex-1 p-6 pb-24 md:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
