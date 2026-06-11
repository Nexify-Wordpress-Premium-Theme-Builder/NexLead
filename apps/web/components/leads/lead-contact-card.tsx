import type { LeadWithPrimaryContact } from "@/features/leads/lead.types";

type ContactRowProps = {
  label: string;
  value: string | null;
  href?: string;
};

function ContactRow({ label, value, href }: ContactRowProps) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="mt-1 text-sm text-text-primary">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-accent hover:underline"
          >
            {value}
          </a>
        ) : (
          <span className="break-words">{value}</span>
        )}
      </dd>
    </div>
  );
}

type LeadContactCardProps = {
  lead: LeadWithPrimaryContact;
};

export function LeadContactCard({ lead }: LeadContactCardProps) {
  const { primaryContact } = lead;
  const hasContact =
    primaryContact.name ||
    primaryContact.email ||
    primaryContact.phone ||
    primaryContact.title ||
    primaryContact.linkedinUrl;

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-soft sm:p-6">
      <h2 className="text-base font-semibold text-text-primary">Birincil Kişi</h2>

      {hasContact ? (
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <ContactRow label="Ad Soyad" value={primaryContact.name} />
          <ContactRow label="Ünvan" value={primaryContact.title} />
          <ContactRow
            label="E-posta"
            value={primaryContact.email}
            href={primaryContact.email ? `mailto:${primaryContact.email}` : undefined}
          />
          <ContactRow
            label="Telefon"
            value={primaryContact.phone}
            href={primaryContact.phone ? `tel:${primaryContact.phone}` : undefined}
          />
          <ContactRow
            label="LinkedIn"
            value={primaryContact.linkedinUrl}
            href={primaryContact.linkedinUrl ?? undefined}
          />
        </dl>
      ) : (
        <p className="mt-4 text-sm text-text-secondary">Birincil kişi bilgisi eklenmemiş.</p>
      )}
    </section>
  );
}
