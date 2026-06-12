"use client";

import { useActionState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LeadActionState, LeadWithPrimaryContact } from "@/features/leads/lead.types";
import { createLeadAction, updateLeadAction } from "@/features/leads/lead.actions";
import { parseLeadMetadata } from "@/features/leads/lead.utils";

type LeadFormProps = {
  mode: "create" | "edit";
  lead?: LeadWithPrimaryContact;
  onSuccess: () => void;
  onCancel: () => void;
};

const initialState: LeadActionState = {};

function leadToDefaults(lead?: LeadWithPrimaryContact) {
  const metadata = lead ? parseLeadMetadata(lead.metadata) : {};

  return {
    companyName: lead?.company_name ?? "",
    website: metadata.website ?? "",
    industry: lead?.industry ?? "",
    country: metadata.country ?? "",
    city: metadata.city ?? "",
    notes: lead?.notes_summary ?? "",
    contactName: lead?.contact_name ?? "",
    contactTitle: metadata.contact_title ?? "",
    contactEmail: lead?.contact_email ?? "",
    contactPhone: lead?.contact_phone ?? "",
    linkedinUrl: metadata.linkedin_url ?? "",
  };
}

export function LeadForm({ mode, lead, onSuccess, onCancel }: LeadFormProps) {
  const action = mode === "create" ? createLeadAction : updateLeadAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const defaults = leadToDefaults(lead);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {mode === "edit" && lead ? <input type="hidden" name="leadId" value={lead.id} /> : null}

      <div className="nx-modal-scroll min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
        {state.error ? (
          <div
            className="rounded-xl border border-error/20 bg-red-50 px-4 py-3 text-[13px] font-medium text-error sm:text-[14px]"
            role="alert"
          >
            {state.error}
          </div>
        ) : null}

        <section className="space-y-4">
          <div>
            <h3 className="text-[14px] font-bold text-text-primary">Şirket bilgileri</h3>
            <p className="mt-1 text-[13px] font-medium leading-[1.45] text-text-muted">Temel firma ve konum bilgileri.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Şirket adı *"
                name="companyName"
                defaultValue={defaults.companyName}
                required
                minLength={2}
                placeholder="Örn. Acme Teknoloji"
              />
            </div>
            <Input
              label="Web sitesi / domain"
              name="website"
              defaultValue={defaults.website}
              placeholder="example.com"
            />
            <Input
              label="Sektör"
              name="industry"
              defaultValue={defaults.industry}
              placeholder="Örn. Yazılım"
            />
            <Input label="Ülke" name="country" defaultValue={defaults.country} placeholder="Türkiye" />
            <Input label="Şehir" name="city" defaultValue={defaults.city} placeholder="İstanbul" />
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-[14px] font-bold text-text-primary">Birincil kişi</h3>
            <p className="mt-1 text-[13px] font-medium leading-[1.45] text-text-muted">İletişim kuracağınız ana kişi.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Kişi adı"
              name="contactName"
              defaultValue={defaults.contactName}
              placeholder="Ad Soyad"
            />
            <Input
              label="Ünvan"
              name="contactTitle"
              defaultValue={defaults.contactTitle}
              placeholder="Örn. Pazarlama Müdürü"
            />
            <Input
              label="E-posta"
              name="contactEmail"
              type="email"
              defaultValue={defaults.contactEmail}
              placeholder="ornek@sirket.com"
            />
            <Input
              label="Telefon"
              name="contactPhone"
              defaultValue={defaults.contactPhone}
              placeholder="+90 5XX XXX XX XX"
            />
            <div className="sm:col-span-2">
              <Input
                label="LinkedIn URL"
                name="linkedinUrl"
                defaultValue={defaults.linkedinUrl}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h3 className="text-[14px] font-bold text-text-primary">Notlar</h3>
            <p className="mt-1 text-[13px] font-medium leading-[1.45] text-text-muted">Kısa özet veya hatırlatmalar.</p>
          </div>
          <label className="block space-y-2">
            <span className="text-[13px] font-semibold text-text-primary sm:text-[14px]">Notlar</span>
            <textarea
              name="notes"
              defaultValue={defaults.notes}
              rows={4}
              placeholder="Lead ile ilgili kısa notlar..."
              className="nx-input nx-textarea min-h-[112px]"
            />
          </label>
        </section>
      </div>

      <div
        className="nx-modal-footer flex shrink-0 flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end sm:px-6"
        style={{ borderColor: "var(--nx-border)" }}
      >
        <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={onCancel} disabled={pending}>
          Vazgeç
        </Button>
        <Button type="submit" className="w-full sm:w-auto" loading={pending}>
          {mode === "create" ? "Lead Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </form>
  );
}
