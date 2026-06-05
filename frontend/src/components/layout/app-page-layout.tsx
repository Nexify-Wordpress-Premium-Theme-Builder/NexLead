import { AppShell } from "./app-shell";

export default function AppPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell>{children}</AppShell>;
}
