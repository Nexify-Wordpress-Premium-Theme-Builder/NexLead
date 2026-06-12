"use client";

import Link from "next/link";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { ConfirmAction } from "@/components/ui/confirm-action";
import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import type { LeadWithPrimaryContact } from "@/features/leads/lead.types";
import { archiveLeadAction } from "@/features/leads/lead.actions";
import { formatLeadDate } from "@/features/leads/lead.utils";

type LeadsTableProps = {
  leads: LeadWithPrimaryContact[];
  onEdit: (lead: LeadWithPrimaryContact) => void;
};

function PrimaryContactCell({ lead }: { lead: LeadWithPrimaryContact }) {
  const { primaryContact } = lead;

  if (!primaryContact.name && !primaryContact.email) {
    return <span className="text-text-muted">—</span>;
  }

  return (
    <div className="min-w-0">
      {primaryContact.name ? (
        <p className="truncate font-medium text-text-primary">{primaryContact.name}</p>
      ) : null}
      {primaryContact.email ? (
        <p className="truncate text-sm text-text-secondary">{primaryContact.email}</p>
      ) : null}
    </div>
  );
}

function LeadActions({
  lead,
  onEdit,
}: {
  lead: LeadWithPrimaryContact;
  onEdit: (lead: LeadWithPrimaryContact) => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/dashboard/leads/${lead.id}`}
        className="inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-soft hover:text-text-primary"
      >
        Detay
      </Link>
      <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(lead)}>
        Düzenle
      </Button>
      <ConfirmAction
        title="Lead arşivlensin mi?"
        description={`${lead.company_name} kaydı listeden kaldırılacak ve arşivlenecek.`}
        confirmLabel="Arşivle"
        loading={pending}
        onConfirm={() => {
          startTransition(async () => {
            await archiveLeadAction(lead.id);
          });
        }}
      >
        {(open) => (
          <Button type="button" variant="ghost" size="sm" onClick={open}>
            Arşivle
          </Button>
        )}
      </ConfirmAction>
    </div>
  );
}

export function LeadsTable({ leads, onEdit }: LeadsTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-soft md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-soft/80">
              <tr>
                <th className="px-4 py-3 font-medium text-text-secondary">Şirket</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Domain</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Sektör</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Konum</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Durum</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Birincil kişi</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Oluşturulma</th>
                <th className="px-4 py-3 font-medium text-text-secondary">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-surface-soft/50">
                  <td className="px-4 py-4">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="font-medium text-text-primary transition-colors hover:text-accent"
                    >
                      {lead.company_name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-text-secondary">
                    {lead.normalizedDomain ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-text-secondary">{lead.industry ?? "—"}</td>
                  <td className="px-4 py-4 text-text-secondary">{lead.displayLocation ?? "—"}</td>
                  <td className="px-4 py-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="max-w-[180px] px-4 py-4">
                    <PrimaryContactCell lead={lead} />
                  </td>
                  <td className="px-4 py-4 text-text-secondary">{formatLeadDate(lead.created_at)}</td>
                  <td className="px-4 py-4">
                    <LeadActions lead={lead} onEdit={onEdit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {leads.map((lead) => (
          <article
            key={lead.id}
            className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/dashboard/leads/${lead.id}`}
                  className="block truncate text-base font-semibold text-text-primary transition-colors hover:text-accent"
                >
                  {lead.company_name}
                </Link>
                <p className="mt-1 text-sm text-text-secondary">
                  {lead.normalizedDomain ?? lead.industry ?? "—"}
                </p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-text-muted">Konum</dt>
                <dd className="mt-0.5 text-text-primary">{lead.displayLocation ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Oluşturulma</dt>
                <dd className="mt-0.5 text-text-primary">{formatLeadDate(lead.created_at)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-text-muted">Birincil kişi</dt>
                <dd className="mt-0.5">
                  <PrimaryContactCell lead={lead} />
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex gap-2">
              <LeadActions lead={lead} onEdit={onEdit} />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
