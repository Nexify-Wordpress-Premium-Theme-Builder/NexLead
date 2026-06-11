"use client";

import { useActionState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { LeadOption, WebsiteActionState, WebsiteWithRelations } from "@/features/websites/website.types";
import { createWebsiteAction, updateWebsiteAction } from "@/features/websites/website.actions";

type WebsiteFormProps = {
  mode: "create" | "edit";
  website?: WebsiteWithRelations;
  leads: LeadOption[];
  defaultLeadId?: string;
  onSuccess: () => void;
  onCancel: () => void;
};

const initialState: WebsiteActionState = {};

function websiteToDefaults(
  website?: WebsiteWithRelations,
  defaultLeadId?: string,
  leads: LeadOption[] = [],
) {
  const selectedLead = defaultLeadId ? leads.find((lead) => lead.id === defaultLeadId) : undefined;

  return {
    websiteUrl: website?.url ?? website?.domain ?? selectedLead?.suggestedUrl ?? "",
    leadId: website?.lead_id ?? defaultLeadId ?? "",
    description: website?.description ?? "",
  };
}

export function WebsiteForm({
  mode,
  website,
  leads,
  defaultLeadId,
  onSuccess,
  onCancel,
}: WebsiteFormProps) {
  const action = mode === "create" ? createWebsiteAction : updateWebsiteAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const defaults = websiteToDefaults(website, defaultLeadId, leads);
  const fillFromSelectedLead = () => {
    const leadSelect = document.getElementById("leadId") as HTMLSelectElement | null;
    const urlInput = document.getElementById("websiteUrl") as HTMLInputElement | null;
    const leadId = leadSelect?.value;

    if (!leadId) {
      return;
    }

    const lead = leads.find((item) => item.id === leadId);

    if (!lead?.suggestedUrl || !urlInput) {
      return;
    }

    urlInput.value = lead.suggestedUrl;
  };

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-6">
      {mode === "edit" && website ? <input type="hidden" name="websiteId" value={website.id} /> : null}

      {state.error ? (
        <div className="rounded-lg border border-error/20 bg-red-50 px-4 py-3 text-sm text-error">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Web sitesi URL veya domain *"
            id="websiteUrl"
            name="websiteUrl"
            defaultValue={defaults.websiteUrl}
            required
            minLength={3}
            placeholder="example.com"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block space-y-2" htmlFor="leadId">
            <span className="text-sm font-medium text-text-primary">Bağlı lead</span>
            <select
              id="leadId"
              name="leadId"
              defaultValue={defaults.leadId}
              className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            >
              <option value="">Lead seç (opsiyonel)</option>
              {leads.map((lead) => (
                <option key={lead.id} value={lead.id} data-suggested-url={lead.suggestedUrl ?? ""}>
                  {lead.companyName}
                </option>
              ))}
            </select>
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={fillFromSelectedLead}>
              Lead domaininden doldur
            </Button>
            <span className="text-xs text-text-muted">Manuel website ekle veya lead ile ilişkilendir.</span>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block space-y-2" htmlFor="description">
            <span className="text-sm font-medium text-text-primary">Açıklama</span>
            <textarea
              id="description"
              name="description"
              defaultValue={defaults.description}
              rows={3}
              placeholder="Kısa not veya açıklama"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={pending}>
          Vazgeç
        </Button>
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Web Sitesi Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </form>
  );
}
