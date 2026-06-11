"use client";

import { useTransition } from "react";

import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import { WebsiteStatusBadge } from "@/components/websites/website-status-badge";
import { Button } from "@/components/ui/button";
import { ConfirmAction } from "@/components/ui/confirm-action";
import type { WebsiteWithRelations } from "@/features/websites/website.types";
import { archiveWebsiteAction, startWebsiteAuditAction } from "@/features/websites/website.actions";
import { formatLastAuditAt, formatWebsiteDate } from "@/features/websites/website.utils";

type WebsitesTableProps = {
  websites: WebsiteWithRelations[];
  onEdit: (website: WebsiteWithRelations) => void;
  onActionComplete: () => void;
};

function WebsiteActions({
  website,
  onEdit,
  onActionComplete,
}: {
  website: WebsiteWithRelations;
  onEdit: (website: WebsiteWithRelations) => void;
  onActionComplete: () => void;
}) {
  const [pending, startTransition] = useTransition();

  const displayUrl = website.url ?? website.domain ?? "—";
  const auditInProgress = website.isAuditRunning;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={auditInProgress || pending}
        onClick={() => {
          startTransition(async () => {
            await startWebsiteAuditAction(website.id);
            onActionComplete();
          });
        }}
      >
        {auditInProgress ? "Analiz Sürüyor" : "Analiz Başlat"}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(website)}>
        Düzenle
      </Button>
      <ConfirmAction
        title="Web site arşivlensin mi?"
        description={`${displayUrl} kaydı listeden kaldırılacak ve arşivlenecek.`}
        confirmLabel="Arşivle"
        loading={pending}
        onConfirm={() => {
          startTransition(async () => {
            await archiveWebsiteAction(website.id);
            onActionComplete();
          });
        }}
      >
        {(open) => (
          <Button type="button" variant="ghost" size="sm" onClick={open} disabled={pending}>
            Arşivle
          </Button>
        )}
      </ConfirmAction>
    </div>
  );
}

export function WebsitesTable({ websites, onEdit, onActionComplete }: WebsitesTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-soft md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-soft/80">
              <tr>
                <th className="px-4 py-3 font-medium text-text-secondary">Web site</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Bağlı lead</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Web site durumu</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Analiz durumu</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Son analiz</th>
                <th className="px-4 py-3 font-medium text-text-secondary">Oluşturulma</th>
                <th className="px-4 py-3 font-medium text-text-secondary">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {websites.map((website) => (
                <tr key={website.id} className="hover:bg-surface-soft/50">
                  <td className="px-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-text-primary">
                        {website.url ?? website.domain}
                      </p>
                      {website.domain && website.url !== website.domain ? (
                        <p className="truncate text-xs text-text-muted">{website.domain}</p>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-text-secondary">
                    {website.leadCompanyName ?? "—"}
                  </td>
                  <td className="px-4 py-4">
                    <WebsiteStatusBadge status={website.status} />
                  </td>
                  <td className="px-4 py-4">
                    <AuditStatusBadge status={website.latestAudit?.status ?? null} />
                  </td>
                  <td className="px-4 py-4 text-text-secondary">{formatLastAuditAt(website)}</td>
                  <td className="px-4 py-4 text-text-secondary">
                    {formatWebsiteDate(website.created_at)}
                  </td>
                  <td className="px-4 py-4">
                    <WebsiteActions
                      website={website}
                      onEdit={onEdit}
                      onActionComplete={onActionComplete}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {websites.map((website) => (
          <article
            key={website.id}
            className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
          >
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-text-primary">
                {website.url ?? website.domain}
              </h3>
              <p className="mt-1 truncate text-sm text-text-secondary">
                {website.leadCompanyName ?? "Bağlı lead yok"}
              </p>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-text-muted">Web site durumu</dt>
                <dd className="mt-1">
                  <WebsiteStatusBadge status={website.status} />
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Analiz durumu</dt>
                <dd className="mt-1">
                  <AuditStatusBadge status={website.latestAudit?.status ?? null} />
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Son analiz</dt>
                <dd className="mt-0.5 text-text-primary">{formatLastAuditAt(website)}</dd>
              </div>
              <div>
                <dt className="text-text-muted">Oluşturulma</dt>
                <dd className="mt-0.5 text-text-primary">{formatWebsiteDate(website.created_at)}</dd>
              </div>
            </dl>

            <div className="mt-4">
              <WebsiteActions
                website={website}
                onEdit={onEdit}
                onActionComplete={onActionComplete}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
