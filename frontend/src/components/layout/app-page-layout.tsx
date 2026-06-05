import { AppShell } from "./app-shell";
import { AppProviders } from "@/components/providers/app-providers";

export default function AppPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppProviders>
      <AppShell>{children}</AppShell>
    </AppProviders>
  );
}
