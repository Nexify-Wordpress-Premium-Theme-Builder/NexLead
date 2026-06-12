"use client";

import Link from "next/link";
import { useTransition } from "react";

import { AuditStatusBadge } from "@/components/websites/audit-status-badge";
import { WebsiteStatusBadge } from "@/components/websites/website-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmAction } from "@/components/ui/confirm-action";
import type { WebsiteWithRelations } from "@/features/websites/website.types";
import { archiveWebsiteAction, startWebsiteAuditAction } from "@/features/websites/website.actions";
import {
  formatLastAuditAt,
  formatWebsiteDate,
  getAuditStartButtonLabel,
} from "@/features/websites/website.utils";

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
  const startButton = getAuditStartButtonLabel(website.latestAudit?.status ?? null, pending);

  return (
    <div className="flex flex-wrap items-center gap-1">
      <Link href={`/dashboard/websites/${website.id}`}>
        <Button type="button" variant="ghost" size="sm">
          Detay
        </Button>
      </Link>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        loading={pending}
        disabled={startButton.disabled}
        onClick={() => {
          startTransition(async () => {
            await startWebsiteAuditAction(website.id);
            onActionComplete();
          });
        }}
      >
        {startButton.label}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(website)}>
        Düzenle
      </Button>
      <ConfirmAction
        title="Web site arşivlensin mi?"
        description={`${displayUrl} kaydı listeden kaldırılacak ve arşivlenecek.`}
        confirmLabel="Arşivle"
        tone="danger"
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
      <div className="nx-table-wrap hidden md:block">
        <div className="overflow-x-auto">
          <table className="nx-table">
            <thead>
              <tr>
                <th>Web site</th>
                <th>Bağlı lead</th>
                <th>Site durumu</th>
                <th>Analiz durumu</th>
                <th>Son analiz</th>
                <th>Oluşturulma</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {websites.map((website, index) => (
                <tr key={website.id} className="nx-row-enter" style={{ animationDelay: `${index * 0.04}s` }}>
                  <td>
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/websites/${website.id}`}
                        className="block truncate font-semibold text-text-primary hover:text-accent"
                      >
                        {website.url ?? website.domain}
                      </Link>
                    </div>
                  </td>
                  <td>{website.leadCompanyName ?? "—"}</td>
                  <td>
                    <WebsiteStatusBadge status={website.status} />
                  </td>
                  <td>
                    <AuditStatusBadge status={website.latestAudit?.status ?? null} />
                  </td>
                  <td>{formatLastAuditAt(website)}</td>
                  <td>{formatWebsiteDate(website.created_at)}</td>
                  <td>
                    <WebsiteActions website={website} onEdit={onEdit} onActionComplete={onActionComplete} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {websites.map((website, index) => (
          <Card key={website.id} padding="md" className="nx-row-enter" style={{ animationDelay: `${index * 0.04}s` }}>
            <Link
              href={`/dashboard/websites/${website.id}`}
              className="block truncate text-[16px] font-bold text-text-primary hover:text-accent"
            >
              {website.url ?? website.domain}
            </Link>
            <p className="mt-1 truncate text-[13px] text-text-muted">{website.leadCompanyName ?? "Bağlı lead yok"}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
              <div>
                <dt className="text-text-muted">Site durumu</dt>
                <dd className="mt-1">
                  <WebsiteStatusBadge status={website.status} />
                </dd>
              </div>
              <div>
                <dt className="text-text-muted">Analiz</dt>
                <dd className="mt-1">
                  <AuditStatusBadge status={website.latestAudit?.status ?? null} />
                </dd>
              </div>
            </dl>
            <div className="mt-4">
              <WebsiteActions website={website} onEdit={onEdit} onActionComplete={onActionComplete} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
