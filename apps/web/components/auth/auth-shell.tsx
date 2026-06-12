import type { ReactNode } from "react";

import { NexLeadLogo } from "@/components/brand/nexlead-logo";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden overflow-hidden border-r border-border bg-surface-soft lg:flex lg:flex-col lg:justify-between">
        <div className="auth-grid absolute inset-0 opacity-60" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <div className="animate-fade-in max-w-full">
            <NexLeadLogo variant="full" priority />
          </div>

          <div className="max-w-md space-y-6">
            <div className="h-px w-12 origin-left bg-primary animate-line-grow" />
            <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.03em] text-text-primary xl:text-[2.35rem]">
              Müşteri bulma ve web denetim operasyonlarınızı tek merkezden yönetin.
            </h1>
            <p className="text-base leading-relaxed text-text-secondary">
              NexLead; lead keşfi, web sitesi denetimi ve satış sürecinizi profesyonel bir
              çalışma alanında bir araya getirir.
            </p>
          </div>

          <p className="text-sm text-text-muted">Güvenli oturum · Workspace tabanlı erişim</p>
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 max-w-full lg:hidden">
            <NexLeadLogo variant="full" />
          </div>

          <div className="auth-stagger rounded-2xl border border-border bg-surface p-7 shadow-card sm:p-8">
            <div className="mb-7 space-y-2">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-text-primary">{title}</h2>
              <p className="text-sm leading-relaxed text-text-secondary">{subtitle}</p>
            </div>

            {children}
          </div>

          {footer ? <div className="auth-stagger mt-6 text-center text-sm text-text-secondary">{footer}</div> : null}
        </div>
      </section>
    </div>
  );
}
