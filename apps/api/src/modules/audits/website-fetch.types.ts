export type WebsiteFetchErrorCode =
  | "invalid_url"
  | "unsupported_protocol"
  | "private_ip_blocked"
  | "dns_failed"
  | "timeout"
  | "fetch_failed"
  | "non_html_response"
  | "too_many_redirects"
  | "response_too_large";

export type WebsiteHtmlSignals = {
  htmlTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  hasViewportMeta: boolean;
  robotsMeta: string | null;
};

export type WebsiteFetchSnapshot = {
  requestedUrl: string;
  finalUrl: string | null;
  statusCode: number | null;
  ok: boolean;
  redirected: boolean;
  redirectCount: number;
  contentType: string | null;
  responseTimeMs: number | null;
  bodyBytesRead: number;
  htmlTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  hasViewportMeta: boolean;
  robotsMeta: string | null;
  fetchErrorCode: WebsiteFetchErrorCode | null;
  fetchErrorMessage: string | null;
};

export type FetchRedirectResult = {
  response: Response;
  finalUrl: string;
  redirectCount: number;
  responseTimeMs: number;
};
