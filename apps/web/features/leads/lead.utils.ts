import type { LeadFormInput, LeadMetadata, LeadRow, LeadWithPrimaryContact } from "./lead.types";

export type DomainNormalizeResult = {
  normalized: string | null;
  warning?: string;
};

export function normalizeDomain(input: string | undefined): DomainNormalizeResult {
  const raw = input?.trim();

  if (!raw) {
    return { normalized: null };
  }

  try {
    let value = raw.toLowerCase();

    if (value.includes("://")) {
      const parsed = new URL(value);
      value = parsed.hostname;
    } else if (value.includes("/")) {
      const parsed = new URL(`https://${value}`);
      value = parsed.hostname;
    } else {
      value = value.split("/")[0]?.split("?")[0]?.split("#")[0] ?? value;
    }

    value = value.replace(/^www\./, "").trim();

    if (!value || !value.includes(".") || value.startsWith(".") || value.endsWith(".")) {
      return {
        normalized: null,
        warning: "Web sitesi adresi tanınamadı. Lead yine de kaydedilebilir.",
      };
    }

    return { normalized: value };
  } catch {
    return {
      normalized: null,
      warning: "Web sitesi adresi tanınamadı. Lead yine de kaydedilebilir.",
    };
  }
}

export function buildLocation(city?: string, country?: string): string | null {
  const parts = [city?.trim(), country?.trim()].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : null;
}

export function parseLeadMetadata(metadata: LeadRow["metadata"]): LeadMetadata {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return {};
  }

  const record = metadata as Record<string, unknown>;

  return {
    website: typeof record.website === "string" ? record.website : null,
    normalized_domain:
      typeof record.normalized_domain === "string" ? record.normalized_domain : null,
    country: typeof record.country === "string" ? record.country : null,
    city: typeof record.city === "string" ? record.city : null,
    contact_title: typeof record.contact_title === "string" ? record.contact_title : null,
    linkedin_url: typeof record.linkedin_url === "string" ? record.linkedin_url : null,
  };
}

export function toLeadMetadata(input: LeadFormInput, website?: string | null): LeadMetadata {
  const domain = normalizeDomain(input.website);

  return {
    website: website ?? (input.website?.trim() || null),
    normalized_domain: domain.normalized,
    country: input.country?.trim() || null,
    city: input.city?.trim() || null,
    contact_title: input.contactTitle?.trim() || null,
    linkedin_url: input.linkedinUrl?.trim() || null,
  };
}

export function mapLeadRow(row: LeadRow): LeadWithPrimaryContact {
  const metadata = parseLeadMetadata(row.metadata);

  return {
    ...row,
    normalizedDomain: metadata.normalized_domain ?? null,
    displayLocation: row.location ?? buildLocation(metadata.city ?? undefined, metadata.country ?? undefined),
    primaryContact: {
      name: row.contact_name,
      email: row.contact_email,
      phone: row.contact_phone,
      title: metadata.contact_title ?? null,
      linkedinUrl: metadata.linkedin_url ?? null,
    },
  };
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLeadForm(input: LeadFormInput): { valid: true } | { valid: false; error: string } {
  const companyName = input.companyName?.trim() ?? "";

  if (!companyName) {
    return { valid: false, error: "Şirket adı zorunludur." };
  }

  if (companyName.length < 2) {
    return { valid: false, error: "Şirket adı en az 2 karakter olmalıdır." };
  }

  const email = input.contactEmail?.trim();

  if (email && !EMAIL_PATTERN.test(email)) {
    return { valid: false, error: "E-posta formatı geçerli değil." };
  }

  return { valid: true };
}

export function formDataToLeadInput(formData: FormData): LeadFormInput {
  return {
    companyName: String(formData.get("companyName") ?? ""),
    website: String(formData.get("website") ?? "") || undefined,
    industry: String(formData.get("industry") ?? "") || undefined,
    country: String(formData.get("country") ?? "") || undefined,
    city: String(formData.get("city") ?? "") || undefined,
    notes: String(formData.get("notes") ?? "") || undefined,
    contactName: String(formData.get("contactName") ?? "") || undefined,
    contactTitle: String(formData.get("contactTitle") ?? "") || undefined,
    contactEmail: String(formData.get("contactEmail") ?? "") || undefined,
    contactPhone: String(formData.get("contactPhone") ?? "") || undefined,
    linkedinUrl: String(formData.get("linkedinUrl") ?? "") || undefined,
  };
}

export function formatLeadDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
