import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "NexLead",
  description: "AI destekli müşteri bulma ve web sitesi denetim platformu",
  icons: {
    icon: "/favicon-128.png",
    shortcut: "/favicon-128.png",
    apple: "/favicon-128.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
