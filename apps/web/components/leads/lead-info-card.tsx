import type { ReactNode } from "react";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import type { LeadWithPrimaryContact } from "@/features/leads/lead.types";
import { formatLeadDate, parseLeadMetadata } from "@/features/leads/lead.utils";

const SOURCE_TYPE_LABELS: Record<LeadWithPrimaryContact["source_type"], string> = {
  manual: "Manuel",
  import: "İçe aktarma",
  discovery: "Keşif",
  referral: "Referans",
  inbound: "Gelen",
};

type InfoRowProps = {
  label: string;
  value: ReactNode;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div>
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-text-primary">{value}</dd>
    </div>
  );
}

type LeadInfoCardProps = {
  lead: LeadWithPrimaryContact;
};

export function LeadInfoCard({ lead }: LeadInfoCardProps) {
  const metadata = parseLeadMetadata(lead.metadata);

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Lead Bilgileri</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <InfoRow label="Şirket adı" value={lead.company_name} />
        <InfoRow label="Domain" value={lead.normalizedDomain ?? "—"} />
        <InfoRow label="Sektör" value={lead.industry ?? "—"} />
        <InfoRow label="Ülke" value={metadata.country ?? "—"} />
        <InfoRow label="Şehir" value={metadata.city ?? "—"} />
        <InfoRow
          label="Durum"
          value={<LeadStatusBadge status={lead.status} />}
        />
        <InfoRow
          label="Kaynak tipi"
          value={SOURCE_TYPE_LABELS[lead.source_type] ?? lead.source_type}
        />
        <InfoRow label="Oluşturulma tarihi" value={formatLeadDate(lead.created_at)} />
        <div className="sm:col-span-2">
          <InfoRow label="Notlar" value={lead.notes_summary?.trim() || "—"} />
        </div>
      </dl>
    </section>
  );
}
