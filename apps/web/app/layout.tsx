import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

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
    <html lang="tr">
      <body className={`${sans.variable} font-sans`}>{children}</body>
    </html>
  );
}
