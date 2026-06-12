import Link from "next/link";

import { getAuditReportPath } from "@/features/reports/report.utils";

type AuditReportLinkProps = {
  auditId: string;
  className?: string;
};

export function AuditReportLink({ auditId, className }: AuditReportLinkProps) {
  return (
    <Link
      href={getAuditReportPath(auditId)}
      className={
        className ??
        "inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary"
      }
    >
      Raporu Gör
    </Link>
  );
}
