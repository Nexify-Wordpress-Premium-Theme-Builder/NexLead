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
      <aside className="relative hidden overflow-hidden border-r bg-surface-soft lg:flex lg:flex-col lg:justify-between" style={{ borderColor: "var(--nx-border)" }}>
        <div className="auth-grid absolute inset-0 opacity-60" />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
          <NexLeadLogo variant="full" priority />

          <div className="max-w-md space-y-5">
            <h1 className="text-[2rem] font-bold leading-tight tracking-[-0.03em] text-text-primary xl:text-[2.2rem]">
              Lead keşfi ve web analiz operasyonlarınızı tek merkezden yönetin.
            </h1>
            <p className="text-[15px] font-medium leading-relaxed text-text-secondary">
              NexLead; potansiyel müşteri yönetimi, site analizi ve satış sürecinizi profesyonel bir çalışma alanında bir araya getirir.
            </p>
          </div>

          <p className="text-[13px] font-medium text-text-muted">Güvenli oturum · Workspace tabanlı erişim</p>
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 lg:hidden">
            <NexLeadLogo variant="full" />
          </div>

          <div className="auth-stagger nx-card p-7 sm:p-8">
            <div className="mb-7 space-y-2">
              <h2 className="text-[24px] font-bold tracking-[-0.02em] text-text-primary">{title}</h2>
              <p className="text-[14px] font-medium leading-relaxed text-text-muted">{subtitle}</p>
            </div>
            {children}
          </div>

          {footer ? <div className="auth-stagger mt-6 text-center text-[14px] font-medium text-text-muted">{footer}</div> : null}
        </div>
      </section>
    </div>
  );
}
