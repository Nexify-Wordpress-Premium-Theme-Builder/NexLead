"use client";

import Link from "next/link";
import { useTransition } from "react";

import { LeadStatusBadge } from "@/components/leads/lead-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmAction } from "@/components/ui/confirm-action";
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
        <p className="truncate font-semibold text-text-primary">{primaryContact.name}</p>
      ) : null}
      {primaryContact.email ? (
        <p className="truncate text-[13px] text-text-muted">{primaryContact.email}</p>
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
    <div className="flex flex-wrap items-center gap-1">
      <Link href={`/dashboard/leads/${lead.id}`}>
        <Button type="button" variant="ghost" size="sm">
          Detay
        </Button>
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
      <div className="nx-table-wrap hidden md:block">
        <div className="overflow-x-auto">
          <table className="nx-table">
            <thead>
              <tr>
                <th>Şirket</th>
                <th>Domain</th>
                <th>Sektör</th>
                <th>Konum</th>
                <th>Durum</th>
                <th>Birincil kişi</th>
                <th>Oluşturulma</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, index) => (
                <tr key={lead.id} className="nx-row-enter" style={{ animationDelay: `${index * 0.04}s` }}>
                  <td>
                    <Link href={`/dashboard/leads/${lead.id}`} className="font-semibold text-text-primary hover:text-accent">
                      {lead.company_name}
                    </Link>
                  </td>
                  <td>{lead.normalizedDomain ?? "—"}</td>
                  <td>{lead.industry ?? "—"}</td>
                  <td>{lead.displayLocation ?? "—"}</td>
                  <td>
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  <td className="max-w-[180px]">
                    <PrimaryContactCell lead={lead} />
                  </td>
                  <td>{formatLeadDate(lead.created_at)}</td>
                  <td>
                    <LeadActions lead={lead} onEdit={onEdit} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {leads.map((lead, index) => (
          <Card
            key={lead.id}
            padding="md"
            className="nx-row-enter"
            style={{ animationDelay: `${index * 0.04}s` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/dashboard/leads/${lead.id}`} className="block truncate text-[16px] font-bold text-text-primary hover:text-accent">
                  {lead.company_name}
                </Link>
                <p className="mt-1 truncate text-[13px] text-text-muted">
                  {lead.normalizedDomain ?? lead.industry ?? "—"}
                </p>
              </div>
              <LeadStatusBadge status={lead.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <dt className="text-text-muted">Konum</dt>
                <dd className="mt-0.5 font-medium text-text-primary">{lead.displayLocation ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Oluşturulma</dt>
                <dd className="mt-0.5 font-medium text-text-primary">{formatLeadDate(lead.created_at)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-text-muted">Birincil kişi</dt>
                <dd className="mt-0.5">
                  <PrimaryContactCell lead={lead} />
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <LeadActions lead={lead} onEdit={onEdit} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
