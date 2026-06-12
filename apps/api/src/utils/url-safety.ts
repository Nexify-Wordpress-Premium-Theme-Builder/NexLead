import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export type UrlSafetyErrorCode =
  | "invalid_url"
  | "unsupported_protocol"
  | "private_ip_blocked"
  | "dns_failed";

export type UrlSafetyResult =
  | { ok: true; url: URL }
  | { ok: false; code: UrlSafetyErrorCode; message: string };

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal",
]);

const METADATA_IPV4 = "169.254.169.254";

function parseIpv4(ip: string): [number, number, number, number] | null {
  if (isIP(ip) !== 4) {
    return null;
  }

  const parts = ip.split(".").map((part) => Number.parseInt(part, 10));

  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) {
    return null;
  }

  return parts as [number, number, number, number];
}

export function isPrivateOrLocalIp(ip: string): boolean {
  const normalized = ip.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  if (normalized === METADATA_IPV4) {
    return true;
  }

  const ipv4 = parseIpv4(normalized);

  if (ipv4) {
    const [a, b] = ipv4;

    if (a === 10) {
      return true;
    }

    if (a === 127) {
      return true;
    }

    if (a === 0) {
      return true;
    }

    if (a === 169 && b === 254) {
      return true;
    }

    if (a === 192 && b === 168) {
      return true;
    }

    if (a === 172 && b >= 16 && b <= 31) {
      return true;
    }

    return false;
  }

  if (isIP(normalized) !== 6) {
    return false;
  }

  if (normalized === "::1" || normalized === "::") {
    return true;
  }

  if (normalized.startsWith("fe80:")) {
    return true;
  }

  if (normalized.startsWith("fc") || normalized.startsWith("fd")) {
    return true;
  }

  if (normalized.startsWith("::ffff:")) {
    const mapped = normalized.slice("::ffff:".length);
    return isPrivateOrLocalIp(mapped);
  }

  return false;
}

function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.toLowerCase().replace(/\.$/, "");

  if (BLOCKED_HOSTNAMES.has(lower)) {
    return true;
  }

  if (lower.endsWith(".localhost")) {
    return true;
  }

  return false;
}

export async function resolveHostnameSafely(hostname: string): Promise<UrlSafetyResult> {
  const normalizedHost = hostname.toLowerCase().replace(/\.$/, "");

  if (isBlockedHostname(normalizedHost)) {
    return {
      ok: false,
      code: "private_ip_blocked",
      message: "Yerel veya özel ağ adreslerine erişim engellendi.",
    };
  }

  const ipVersion = isIP(normalizedHost);

  if (ipVersion === 4 || ipVersion === 6) {
    if (isPrivateOrLocalIp(normalizedHost)) {
      return {
        ok: false,
        code: "private_ip_blocked",
        message: "Yerel veya özel IP adreslerine erişim engellendi.",
      };
    }

    return { ok: true, url: new URL(`https://${normalizedHost}`) };
  }

  try {
    const records = await lookup(normalizedHost, { all: true, verbatim: true });

    if (records.length === 0) {
      return {
        ok: false,
        code: "dns_failed",
        message: "Alan adı çözümlenemedi.",
      };
    }

    for (const record of records) {
      if (isPrivateOrLocalIp(record.address)) {
        return {
          ok: false,
          code: "private_ip_blocked",
          message: "Alan adı özel veya yerel bir IP adresine çözümlendi.",
        };
      }
    }

    return { ok: true, url: new URL(`https://${normalizedHost}`) };
  } catch {
    return {
      ok: false,
      code: "dns_failed",
      message: "Alan adı çözümlenemedi.",
    };
  }
}

export async function assertSafeFetchUrl(input: string): Promise<UrlSafetyResult> {
  let parsed: URL;

  try {
    parsed = new URL(input);
  } catch {
    return {
      ok: false,
      code: "invalid_url",
      message: "Geçersiz URL.",
    };
  }

  const protocol = parsed.protocol.toLowerCase();

  if (protocol !== "http:" && protocol !== "https:") {
    return {
      ok: false,
      code: "unsupported_protocol",
      message: "Desteklenmeyen URL protokolü.",
    };
  }

  if (!parsed.hostname) {
    return {
      ok: false,
      code: "invalid_url",
      message: "URL host bilgisi eksik.",
    };
  }

  const hostSafety = await resolveHostnameSafely(parsed.hostname);

  if (!hostSafety.ok) {
    return hostSafety;
  }

  return { ok: true, url: parsed };
}
