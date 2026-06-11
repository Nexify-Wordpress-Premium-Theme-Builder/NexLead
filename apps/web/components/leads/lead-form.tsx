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
    <form action={formAction} className="space-y-8">
      {mode === "edit" && lead ? <input type="hidden" name="leadId" value={lead.id} /> : null}

      {state.error ? (
        <div className="rounded-lg border border-error/20 bg-red-50 px-4 py-3 text-sm text-error">
          {state.error}
        </div>
      ) : null}

      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Şirket bilgileri</h3>
          <p className="mt-1 text-sm text-text-secondary">Temel firma ve konum bilgileri.</p>
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
          <h3 className="text-sm font-semibold text-text-primary">Birincil kişi</h3>
          <p className="mt-1 text-sm text-text-secondary">İletişim kuracağınız ana kişi.</p>
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
          <h3 className="text-sm font-semibold text-text-primary">Notlar</h3>
          <p className="mt-1 text-sm text-text-secondary">Kısa özet veya hatırlatmalar.</p>
        </div>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-primary">Notlar</span>
          <textarea
            name="notes"
            defaultValue={defaults.notes}
            rows={4}
            placeholder="Lead ile ilgili kısa notlar..."
            className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
        </label>
      </section>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={pending}>
          Vazgeç
        </Button>
        <Button type="submit" loading={pending}>
          {mode === "create" ? "Lead Oluştur" : "Değişiklikleri Kaydet"}
        </Button>
      </div>
    </form>
  );
}
