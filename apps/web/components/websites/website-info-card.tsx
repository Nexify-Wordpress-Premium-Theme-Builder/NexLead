import type { ReactNode } from "react";

import { WebsiteStatusBadge } from "@/components/websites/website-status-badge";
import type { WebsiteDetail } from "@/features/websites/website.types";
import { formatLastAuditAt, formatWebsiteDate } from "@/features/websites/website.utils";

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="mt-1 break-all text-sm text-text-primary sm:break-words">{value}</dd>
    </div>
  );
}

type WebsiteInfoCardProps = {
  website: WebsiteDetail;
};

export function WebsiteInfoCard({ website }: WebsiteInfoCardProps) {
  return (
    <section className="nx-card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Web Site Bilgileri</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <InfoRow label="URL" value={website.url ?? "—"} />
        <InfoRow label="Domain" value={website.domain ?? "—"} />
        <InfoRow label="Normalize domain" value={website.normalized_url ?? "—"} />
        <InfoRow label="Bağlı lead" value={website.linkedLead?.companyName ?? "—"} />
        <InfoRow
          label="Durum"
          value={<WebsiteStatusBadge status={website.status} />}
        />
        <InfoRow label="Son analiz" value={formatLastAuditAt(website)} />
        <InfoRow label="Oluşturulma tarihi" value={formatWebsiteDate(website.created_at)} />
      </dl>
    </section>
  );
}
