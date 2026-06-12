import { assertSafeFetchUrl } from "../../utils/url-safety";
import { normalizeDomain } from "../../utils/normalize-domain";

import type {
  FetchRedirectResult,
  WebsiteFetchErrorCode,
  WebsiteFetchSnapshot,
  WebsiteHtmlSignals,
} from "./website-fetch.types";

export const FETCH_TIMEOUT_MS = 5000;
export const FETCH_MAX_BODY_BYTES = 256 * 1024;
export const FETCH_MAX_REDIRECTS = 3;
const USER_AGENT = "NexLead-AuditBot/1.0";

const MAX_TITLE_LENGTH = 160;
const MAX_META_DESCRIPTION_LENGTH = 320;
const MAX_CANONICAL_LENGTH = 500;
const MAX_ROBOTS_LENGTH = 160;

export function normalizeWebsiteUrl(input: string): string | null {
  const trimmed = input.trim();

  if (!trimmed) {
    return null;
  }

  try {
    if (!trimmed.includes("://")) {
      return new URL(`https://${trimmed}`).toString();
    }

    return new URL(trimmed).toString();
  } catch {
    const domain = normalizeDomain(trimmed).normalized;

    if (!domain) {
      return null;
    }

    try {
      return new URL(`https://${domain}`).toString();
    } catch {
      return null;
    }
  }
}

export function truncateHtmlBody(value: string, maxBytes = FETCH_MAX_BODY_BYTES): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(value);

  if (bytes.length <= maxBytes) {
    return value;
  }

  const decoder = new TextDecoder("utf-8", { fatal: false });
  return decoder.decode(bytes.slice(0, maxBytes));
}

function clampText(value: string | null, maxLength: number): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.replace(/\s+/g, " ").trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ");
}

function extractAttribute(tag: string, attribute: string): string | null {
  const pattern = new RegExp(`${attribute}\\s*=\\s*["']([^"']*)["']`, "i");
  const match = tag.match(pattern);
  return match?.[1] ?? null;
}

function extractHeadSection(html: string): string {
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  return headMatch?.[1] ?? html.slice(0, 50_000);
}

export function extractHtmlSignals(html: string, finalUrl: string | null): WebsiteHtmlSignals {
  const head = extractHeadSection(html);
  const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const htmlTitle = clampText(
    titleMatch?.[1] ? decodeHtmlEntities(titleMatch[1]) : null,
    MAX_TITLE_LENGTH,
  );

  let metaDescription: string | null = null;
  let hasViewportMeta = false;
  let robotsMeta: string | null = null;

  const metaTags = head.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of metaTags) {
    const name = extractAttribute(tag, "name")?.toLowerCase();
    const content = extractAttribute(tag, "content");

    if (name === "description") {
      metaDescription = clampText(content ? decodeHtmlEntities(content) : null, MAX_META_DESCRIPTION_LENGTH);
    }

    if (name === "viewport") {
      hasViewportMeta = Boolean(content?.trim());
    }

    if (name === "robots") {
      robotsMeta = clampText(content ? decodeHtmlEntities(content) : null, MAX_ROBOTS_LENGTH);
    }
  }

  let canonicalUrl: string | null = null;
  const linkTags = head.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of linkTags) {
    const rel = extractAttribute(tag, "rel")?.toLowerCase();

    if (rel === "canonical") {
      const href = extractAttribute(tag, "href");

      if (href) {
        try {
          const resolved = finalUrl ? new URL(href, finalUrl).toString() : href;
          canonicalUrl = clampText(resolved, MAX_CANONICAL_LENGTH);
        } catch {
          canonicalUrl = clampText(href, MAX_CANONICAL_LENGTH);
        }
      }
    }
  }

  return {
    htmlTitle,
    metaDescription,
    canonicalUrl,
    hasViewportMeta,
    robotsMeta,
  };
}

function isHtmlContentType(contentType: string | null): boolean {
  if (!contentType) {
    return false;
  }

  const normalized = contentType.toLowerCase().split(";")[0]?.trim() ?? "";
  return normalized === "text/html" || normalized === "application/xhtml+xml";
}

async function readResponseBody(response: Response): Promise<{ text: string; bytesRead: number }> {
  const reader = response.body?.getReader();

  if (!reader) {
    return { text: "", bytesRead: 0 };
  }

  const chunks: Uint8Array[] = [];
  let bytesRead = 0;
  let done = false;

  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    const value = readResult.value;

    if (done || !value) {
      continue;
    }

    if (bytesRead + value.length > FETCH_MAX_BODY_BYTES) {
      const remaining = FETCH_MAX_BODY_BYTES - bytesRead;

      if (remaining > 0) {
        chunks.push(value.slice(0, remaining));
      }

      bytesRead = FETCH_MAX_BODY_BYTES;
      await reader.cancel();
      done = true;
      continue;
    }

    chunks.push(value);
    bytesRead += value.length;
  }

  const combined = new Uint8Array(bytesRead);
  let offset = 0;

  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  const decoder = new TextDecoder("utf-8", { fatal: false });
  return { text: decoder.decode(combined), bytesRead };
}

function buildSnapshotError(
  requestedUrl: string,
  code: WebsiteFetchErrorCode,
  message: string,
): WebsiteFetchSnapshot {
  return {
    requestedUrl,
    finalUrl: null,
    statusCode: null,
    ok: false,
    redirected: false,
    redirectCount: 0,
    contentType: null,
    responseTimeMs: null,
    bodyBytesRead: 0,
    htmlTitle: null,
    metaDescription: null,
    canonicalUrl: null,
    hasViewportMeta: false,
    robotsMeta: null,
    fetchErrorCode: code,
    fetchErrorMessage: message,
  };
}

export async function fetchWithRedirectLimit(
  startUrl: string,
  method: "GET" | "HEAD",
): Promise<FetchRedirectResult> {
  let currentUrl = startUrl;
  let redirectCount = 0;
  const startedAt = Date.now();

  for (let attempt = 0; attempt <= FETCH_MAX_REDIRECTS; attempt += 1) {
    const safety = await assertSafeFetchUrl(currentUrl);

    if (!safety.ok) {
      throw new Error(safety.code);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(currentUrl, {
        method,
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
        },
      });

      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");

        if (!location) {
          return {
            response,
            finalUrl: currentUrl,
            redirectCount,
            responseTimeMs: Date.now() - startedAt,
          };
        }

        if (redirectCount >= FETCH_MAX_REDIRECTS) {
          throw new Error("too_many_redirects");
        }

        currentUrl = new URL(location, currentUrl).toString();
        redirectCount += 1;
        continue;
      }

      return {
        response,
        finalUrl: currentUrl,
        redirectCount,
        responseTimeMs: Date.now() - startedAt,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("timeout");
      }

      if (error instanceof Error && error.message === "too_many_redirects") {
        throw error;
      }

      if (
        error instanceof Error &&
        (error.message === "private_ip_blocked" ||
          error.message === "dns_failed" ||
          error.message === "invalid_url" ||
          error.message === "unsupported_protocol")
      ) {
        throw error;
      }

      throw new Error("fetch_failed");
    } finally {
      clearTimeout(timeoutId);
    }
  }

  throw new Error("too_many_redirects");
}

export async function fetchWebsiteSnapshot(inputUrl: string): Promise<WebsiteFetchSnapshot> {
  const requestedUrl = normalizeWebsiteUrl(inputUrl);

  if (!requestedUrl) {
    return buildSnapshotError(inputUrl, "invalid_url", "Geçersiz web sitesi adresi.");
  }

  const initialSafety = await assertSafeFetchUrl(requestedUrl);

  if (!initialSafety.ok) {
    return buildSnapshotError(
      requestedUrl,
      initialSafety.code as WebsiteFetchErrorCode,
      initialSafety.message,
    );
  }

  try {
    try {
      await fetchWithRedirectLimit(requestedUrl, "HEAD");
    } catch {
      // HEAD is best-effort; GET is used for the actual snapshot.
    }

    const getResult = await fetchWithRedirectLimit(requestedUrl, "GET");
    const contentType = getResult.response.headers.get("content-type");
    const statusCode = getResult.response.status;
    const redirected = getResult.redirectCount > 0;
    const finalUrl = getResult.finalUrl;

    if (!isHtmlContentType(contentType)) {
      return {
        requestedUrl,
        finalUrl,
        statusCode,
        ok: false,
        redirected,
        redirectCount: getResult.redirectCount,
        contentType,
        responseTimeMs: getResult.responseTimeMs,
        bodyBytesRead: 0,
        htmlTitle: null,
        metaDescription: null,
        canonicalUrl: null,
        hasViewportMeta: false,
        robotsMeta: null,
        fetchErrorCode: "non_html_response",
        fetchErrorMessage: "Yanıt HTML içeriği değil.",
      };
    }

    const { text, bytesRead } = await readResponseBody(getResult.response);
    const limitedHtml = truncateHtmlBody(text);
    const signals = extractHtmlSignals(limitedHtml, finalUrl);

    return {
      requestedUrl,
      finalUrl,
      statusCode,
      ok: statusCode >= 200 && statusCode < 400,
      redirected,
      redirectCount: getResult.redirectCount,
      contentType,
      responseTimeMs: getResult.responseTimeMs,
      bodyBytesRead: bytesRead,
      htmlTitle: signals.htmlTitle,
      metaDescription: signals.metaDescription,
      canonicalUrl: signals.canonicalUrl,
      hasViewportMeta: signals.hasViewportMeta,
      robotsMeta: signals.robotsMeta,
      fetchErrorCode: null,
      fetchErrorMessage: null,
    };
  } catch (error) {
    const code =
      error instanceof Error &&
      [
        "invalid_url",
        "unsupported_protocol",
        "private_ip_blocked",
        "dns_failed",
        "timeout",
        "too_many_redirects",
      ].includes(error.message)
        ? (error.message as WebsiteFetchErrorCode)
        : "fetch_failed";

    const messages: Record<WebsiteFetchErrorCode, string> = {
      invalid_url: "Geçersiz web sitesi adresi.",
      unsupported_protocol: "Desteklenmeyen URL protokolü.",
      private_ip_blocked: "Güvenlik nedeniyle bu adrese erişim engellendi.",
      dns_failed: "Alan adı çözümlenemedi.",
      timeout: "Web sitesi zaman aşımına uğradı.",
      fetch_failed: "Web sitesine erişilemedi.",
      non_html_response: "Yanıt HTML içeriği değil.",
      too_many_redirects: "Çok fazla yönlendirme algılandı.",
      response_too_large: "Yanıt boyutu limiti aşıldı.",
    };

    return buildSnapshotError(requestedUrl, code, messages[code]);
  }
}
