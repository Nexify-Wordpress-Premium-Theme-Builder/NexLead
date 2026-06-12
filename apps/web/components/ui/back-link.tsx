import Link from "next/link";
import type { ReactNode } from "react";

type BackLinkProps = {
  href: string;
  children: ReactNode;
};

export function BackLink({ href, children }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-text-muted transition-colors hover:text-accent"
    >
      <span aria-hidden="true">←</span>
      {children}
    </Link>
  );
}
