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
    } else if (value.includes("/") || value.includes("?") || value.includes("#")) {
      const parsed = new URL(`https://${value}`);
      value = parsed.hostname;
    } else {
      value = value.split("/")[0]?.split("?")[0]?.split("#")[0] ?? value;
    }

    value = value.replace(/^www\./, "").trim();

    if (!value || !value.includes(".") || value.startsWith(".") || value.endsWith(".")) {
      return {
        normalized: null,
        warning: "Web sitesi adresi tanınamadı.",
      };
    }

    return { normalized: value };
  } catch {
    return {
      normalized: null,
      warning: "Web sitesi adresi tanınamadı.",
    };
  }
}

export function buildWebsiteUrl(domain: string): string {
  return `https://${domain}`;
}
