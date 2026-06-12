import type { Json, TablesInsert } from "@nexlead/types";

import { createAdminSupabaseClient } from "../../supabase/admin-client";
import { buildWebsiteUrl, normalizeDomain } from "../../utils/normalize-domain";

import { fetchWebsiteSnapshot } from "./website-fetch.service";
import type { WebsiteFetchSnapshot } from "./website-fetch.types";
import type {
  AuditEvidence,
  AuditFindingInput,
  AuditOutputContext,
  AuditScoreInput,
  DeterministicAuditCheck,
  FindingCategory,
  GenerateAuditOutputResult,
  LeadRow,
  ScoreBreakdown,
  WebsiteRow,
} from "./audit-output.types";
import { toJsonValue } from "./audit-output.types";

const SCORED_CATEGORIES: FindingCategory[] = [
  "security",
  "technical",
  "seo",
  "ux",
  "content",
];

const CATEGORY_WEIGHTS: Partial<Record<FindingCategory, number>> = {
  security: 1,
  technical: 1,
  seo: 1,
  ux: 1,
  content: 1,
};

function parseLeadMetadata(metadata: LeadRow["metadata"]): {
  normalized_domain: string | null;
  website: string | null;
} {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return { normalized_domain: null, website: null };
  }

  const record = metadata as Record<string, unknown>;

  return {
    normalized_domain:
      typeof record.normalized_domain === "string" ? record.normalized_domain : null,
    website: typeof record.website === "string" ? record.website : null,
  };
}

function getLeadDomain(lead: LeadRow): string | null {
  const metadata = parseLeadMetadata(lead.metadata);

  if (metadata.normalized_domain?.trim()) {
    return metadata.normalized_domain.trim().toLowerCase();
  }

  return normalizeDomain(metadata.website ?? undefined).normalized;
}

function getWebsiteDomain(website: WebsiteRow): string | null {
  return normalizeDomain(website.domain).normalized ?? normalizeDomain(website.url).normalized;
}

function hasLeadContact(lead: LeadRow): boolean {
  return Boolean(
    lead.contact_email?.trim() || lead.contact_phone?.trim() || lead.contact_name?.trim(),
  );
}

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateOverallScore(scores: AuditScoreInput[]): number {
  if (scores.length === 0) {
    return 100;
  }

  const totalWeight = scores.reduce((sum, item) => sum + (item.weight ?? 1), 0);
  const weightedSum = scores.reduce(
    (sum, item) => sum + item.score * (item.weight ?? 1),
    0,
  );

  return clampScore(totalWeight > 0 ? weightedSum / totalWeight : 100);
}

function buildRecordEvidence(
  checkKey: string,
  checkedValue: string | null,
  expectedValue: string | null,
  sourceTable: string,
  sourceField: string,
): AuditEvidence {
  return {
    check_key: checkKey,
    checked_value: checkedValue,
    expected_value: expectedValue,
    source_table: sourceTable,
    source_field: sourceField,
    source: "record",
  };
}

function buildFetchEvidence(
  checkKey: string,
  snapshot: WebsiteFetchSnapshot,
  extra?: Partial<AuditEvidence>,
): AuditEvidence {
  return {
    check_key: checkKey,
    requested_url: snapshot.requestedUrl,
    final_url: snapshot.finalUrl,
    status_code: snapshot.statusCode,
    content_type: snapshot.contentType,
    response_time_ms: snapshot.responseTimeMs,
    source: "website_fetch",
    ...extra,
  };
}

function runRecordBasedChecks(context: AuditOutputContext): DeterministicAuditCheck[] {
  const { audit, website, lead, fetchSnapshot } = context;
  const checks: DeterministicAuditCheck[] = [];
  const websiteUrl = website.url.trim();
  const websiteDomain = getWebsiteDomain(website);
  const urlDomain = normalizeDomain(website.url).normalized;
  const storedDomain = normalizeDomain(website.domain).normalized;

  if (!fetchSnapshot) {
    checks.push({
      key: "https_required",
      passed: websiteUrl.toLowerCase().startsWith("https://"),
      category: "security",
      severity: "medium",
      title: "Web sitesi HTTPS kullanmıyor",
      description: "Web site adresi güvenli HTTPS protokolüyle başlamıyor.",
      recommendation: "Web sitesinin HTTPS üzerinden erişilebilir olduğundan emin olun.",
      evidence: buildRecordEvidence("https_required", websiteUrl, "https://", "websites", "url"),
      scoreImpacts: { security: 25 },
    });
  }

  const normalizedFromUrl = normalizeDomain(website.url);
  const domainResolvable = Boolean(normalizedFromUrl.normalized);
  checks.push({
    key: "domain_normalized",
    passed: domainResolvable,
    category: "technical",
    severity: "high",
    title: "Web site domaini doğrulanamadı",
    description: "Girilen web site adresinden temiz bir domain üretilemedi.",
    recommendation:
      "Web site adresini example.com veya https://example.com formatında güncelleyin.",
    evidence: buildRecordEvidence(
      "domain_normalized",
      website.url,
      "valid-domain",
      "websites",
      "url",
    ),
    scoreImpacts: { technical: 30 },
  });

  if (urlDomain && storedDomain) {
    checks.push({
      key: "domain_consistency",
      passed: urlDomain === storedDomain,
      category: "technical",
      severity: "medium",
      title: "Web site URL ve domain kaydı uyumsuz",
      description: "Kayıtlı domain ile URL üzerinden çıkarılan domain eşleşmiyor.",
      recommendation: "Web sitesi URL ve domain alanlarının aynı alan adını gösterdiğinden emin olun.",
      evidence: buildRecordEvidence(
        "domain_consistency",
        `${urlDomain} vs ${storedDomain}`,
        "matching-domain",
        "websites",
        "domain",
      ),
      scoreImpacts: { technical: 15 },
    });
  }

  const leadId = website.lead_id ?? audit.lead_id;
  checks.push({
    key: "lead_associated",
    passed: Boolean(leadId),
    category: "ux",
    severity: "low",
    title: "Web sitesi bir lead kaydına bağlı değil",
    description: "Bu web sitesi herhangi bir lead kaydıyla ilişkilendirilmemiş.",
    recommendation:
      "Analiz sonuçlarını daha anlamlı takip etmek için web sitesini ilgili lead ile eşleştirin.",
    evidence: buildRecordEvidence(
      "lead_associated",
      leadId,
      "lead-id",
      "websites",
      "lead_id",
    ),
    scoreImpacts: { ux: 15 },
  });

  if (lead) {
    checks.push({
      key: "lead_company_name",
      passed: Boolean(lead.company_name.trim()),
      category: "content",
      severity: "low",
      title: "Lead şirket adı eksik",
      description: "Bu lead için şirket adı bilgisi bulunmuyor.",
      recommendation: "Lead kaydına şirket adı ekleyerek içerik bağlamını güçlendirin.",
      evidence: buildRecordEvidence(
        "lead_company_name",
        lead.company_name,
        "non-empty-company-name",
        "leads",
        "company_name",
      ),
      scoreImpacts: { content: 15 },
    });

    checks.push({
      key: "lead_contact_info",
      passed: hasLeadContact(lead),
      category: "content",
      severity: "medium",
      title: "Lead iletişim bilgisi eksik",
      description: "Bu lead için birincil iletişim bilgisi bulunmuyor.",
      recommendation:
        "E-posta veya telefon gibi iletişim bilgilerini ekleyerek outreach sürecini güçlendirin.",
      evidence: buildRecordEvidence(
        "lead_contact_info",
        null,
        "contact-email-or-phone-or-name",
        "leads",
        "contact_email",
      ),
      scoreImpacts: { content: 20, ux: 10 },
    });

    const leadDomain = getLeadDomain(lead);
    if (leadDomain && websiteDomain) {
      checks.push({
        key: "lead_website_domain_match",
        passed: leadDomain === websiteDomain,
        category: "seo",
        severity: "medium",
        title: "Lead domaini ile web site domaini farklı",
        description: "Lead kaydındaki domain ile analiz edilen web sitesi domaini eşleşmiyor.",
        recommendation: "Lead ve web site kayıtlarının doğru eşleştirildiğinden emin olun.",
        evidence: buildRecordEvidence(
          "lead_website_domain_match",
          `${leadDomain} vs ${websiteDomain}`,
          "matching-domain",
          "leads",
          "metadata",
        ),
        scoreImpacts: { seo: 20, technical: 10 },
      });
    }
  }

  if (!websiteDomain) {
    checks.push({
      key: "website_domain_present",
      passed: false,
      category: "seo",
      severity: "high",
      title: "Web sitesi domain bilgisi eksik",
      description: "Web sitesi kaydında doğrulanabilir bir domain bulunmuyor.",
      recommendation: "Geçerli bir domain değeri girin.",
      evidence: buildRecordEvidence(
        "website_domain_present",
        website.domain,
        "valid-domain",
        "websites",
        "domain",
      ),
      scoreImpacts: { seo: 30, technical: 20 },
    });
  }

  if (website.last_audited_at && website.last_audit_id && website.last_audit_id !== audit.id) {
    checks.push({
      key: "prior_audit_exists",
      passed: true,
      category: "technical",
      severity: "info",
      title: "Web sitesi daha önce analiz edilmiş",
      description: "Bu web sitesi için daha önce tamamlanmış bir analiz kaydı bulunuyor.",
      recommendation: "Önceki analiz sonuçlarıyla karşılaştırarak değişiklikleri takip edin.",
      evidence: buildRecordEvidence(
        "prior_audit_exists",
        website.last_audit_id,
        audit.id,
        "websites",
        "last_audit_id",
      ),
      scoreImpacts: {},
    });
  }

  const expectedNormalizedUrl = websiteDomain ? buildWebsiteUrl(websiteDomain) : null;
  if (expectedNormalizedUrl) {
    checks.push({
      key: "normalized_url_consistency",
      passed: website.normalized_url.trim().toLowerCase() === expectedNormalizedUrl.toLowerCase(),
      category: "technical",
      severity: "low",
      title: "Normalize edilmiş URL tutarsız",
      description: "Kayıtlı normalize URL, domain bilgisiyle uyumlu değil.",
      recommendation: "Web sitesi kaydını güncelleyerek normalize URL alanını düzeltin.",
      evidence: buildRecordEvidence(
        "normalized_url_consistency",
        website.normalized_url,
        expectedNormalizedUrl,
        "websites",
        "normalized_url",
      ),
      scoreImpacts: { technical: 10 },
    });
  }

  return checks;
}

function runFetchBasedChecks(snapshot: WebsiteFetchSnapshot): DeterministicAuditCheck[] {
  const checks: DeterministicAuditCheck[] = [];

  if (snapshot.fetchErrorCode === "private_ip_blocked") {
    checks.push({
      key: "fetch_security_blocked",
      passed: false,
      category: "security",
      severity: "high",
      title: "Web sitesi adresi güvenlik kontrolünden geçemedi",
      description: "Belirtilen adres güvenlik politikası nedeniyle analiz edilemedi.",
      recommendation: "Geçerli ve herkese açık bir web sitesi adresi kullanın.",
      evidence: buildFetchEvidence("fetch_security_blocked", snapshot, {
        actual: snapshot.fetchErrorCode,
        expected: "public-url",
      }),
      scoreImpacts: { security: 40 },
    });

    return checks;
  }

  if (
    snapshot.fetchErrorCode === "dns_failed" ||
    snapshot.fetchErrorCode === "timeout" ||
    snapshot.fetchErrorCode === "fetch_failed"
  ) {
    checks.push({
      key: "fetch_unreachable",
      passed: false,
      category: "technical",
      severity: "high",
      title: "Web sitesine erişilemedi",
      description: "Web sitesi belirtilen adresten erişilebilir görünmüyor.",
      recommendation: "Domain, DNS ve hosting durumunu kontrol edin.",
      evidence: buildFetchEvidence("fetch_unreachable", snapshot, {
        actual: snapshot.fetchErrorCode,
        expected: "reachable",
      }),
      scoreImpacts: { technical: 35 },
    });

    return checks;
  }

  if (snapshot.fetchErrorCode === "too_many_redirects") {
    checks.push({
      key: "fetch_too_many_redirects",
      passed: false,
      category: "technical",
      severity: "medium",
      title: "Çok fazla yönlendirme algılandı",
      description: "Web sitesi analiz sırasında izin verilen yönlendirme limitini aştı.",
      recommendation: "Yönlendirme zincirini sadeleştirin.",
      evidence: buildFetchEvidence("fetch_too_many_redirects", snapshot),
      scoreImpacts: { technical: 20 },
    });
  }

  const finalUrl = snapshot.finalUrl ?? snapshot.requestedUrl;
  const usesHttps = finalUrl.toLowerCase().startsWith("https://");

  checks.push({
    key: "fetch_https",
    passed: usesHttps,
    category: "security",
    severity: "high",
    title: "Web sitesi HTTPS kullanmıyor",
    description: "Web sitesi güvenli HTTPS protokolüyle erişilebilir görünmüyor.",
    recommendation: "SSL sertifikası ve HTTPS yönlendirmesini etkinleştirin.",
    evidence: buildFetchEvidence("fetch_https", snapshot, {
      actual: finalUrl,
      expected: "https://",
    }),
    scoreImpacts: { security: 25 },
  });

  if (snapshot.redirected && snapshot.finalUrl && !snapshot.finalUrl.toLowerCase().startsWith("https://")) {
    checks.push({
      key: "fetch_redirect_not_https",
      passed: false,
      category: "security",
      severity: "medium",
      title: "Yönlendirme sonrası HTTPS kullanılmıyor",
      description: "Web sitesi yönlendirme sonrasında güvenli HTTPS protokolüne geçmiyor.",
      recommendation: "Tüm yönlendirmelerin HTTPS üzerinden tamamlandığından emin olun.",
      evidence: buildFetchEvidence("fetch_redirect_not_https", snapshot),
      scoreImpacts: { security: 20 },
    });
  }

  if (snapshot.fetchErrorCode === "non_html_response") {
    checks.push({
      key: "fetch_non_html",
      passed: false,
      category: "technical",
      severity: "medium",
      title: "Yanıt HTML içeriği değil",
      description: "Web sitesi HTML yerine farklı bir içerik türü döndürdü.",
      recommendation: "Ana sayfanın HTML olarak sunulduğundan emin olun.",
      evidence: buildFetchEvidence("fetch_non_html", snapshot),
      scoreImpacts: { technical: 20 },
    });
  }

  if (snapshot.statusCode !== null && snapshot.statusCode >= 400) {
    checks.push({
      key: "fetch_http_error",
      passed: false,
      category: "technical",
      severity: "high",
      title: "Web sitesi hata kodu döndürüyor",
      description: "Web sitesi başarılı bir HTTP yanıtı döndürmedi.",
      recommendation: "Sunucu yanıtlarını ve yönlendirme ayarlarını kontrol edin.",
      evidence: buildFetchEvidence("fetch_http_error", snapshot, {
        actual: String(snapshot.statusCode),
        expected: "2xx-or-3xx",
      }),
      scoreImpacts: { technical: 30 },
    });
  }

  if (snapshot.responseTimeMs !== null && snapshot.responseTimeMs > 5000) {
    checks.push({
      key: "fetch_slow_response",
      passed: false,
      category: "technical",
      severity: "medium",
      title: "Web sitesi yanıt süresi yüksek",
      description: "Web sitesi analiz sırasında yavaş yanıt verdi.",
      recommendation: "Sunucu performansını ve önbellek ayarlarını gözden geçirin.",
      evidence: buildFetchEvidence("fetch_slow_response", snapshot, {
        actual: String(snapshot.responseTimeMs),
        expected: "<=5000ms",
      }),
      scoreImpacts: { technical: 20 },
    });
  } else if (snapshot.responseTimeMs !== null && snapshot.responseTimeMs > 3000) {
    checks.push({
      key: "fetch_moderate_response",
      passed: false,
      category: "technical",
      severity: "low",
      title: "Web sitesi yanıt süresi orta seviyede yüksek",
      description: "Web sitesi analiz sırasında beklenenden daha yavaş yanıt verdi.",
      recommendation: "Sunucu ve önbellek performansını izleyin.",
      evidence: buildFetchEvidence("fetch_moderate_response", snapshot, {
        actual: String(snapshot.responseTimeMs),
        expected: "<=3000ms",
      }),
      scoreImpacts: { technical: 10 },
    });
  }

  if (isHtmlContentType(snapshot.contentType) && snapshot.fetchErrorCode !== "non_html_response") {
    checks.push({
      key: "fetch_title_present",
      passed: Boolean(snapshot.htmlTitle),
      category: "seo",
      severity: "medium",
      title: "Sayfa başlığı bulunamadı",
      description: "Ana sayfada SEO için önemli olan title etiketi bulunamadı.",
      recommendation: "Ana sayfa için açıklayıcı ve marka ile uyumlu bir title etiketi ekleyin.",
      evidence: buildFetchEvidence("fetch_title_present", snapshot, {
        actual: snapshot.htmlTitle,
        expected: "non-empty-title",
      }),
      scoreImpacts: { seo: 20, content: 10 },
    });

    checks.push({
      key: "fetch_meta_description",
      passed: Boolean(snapshot.metaDescription),
      category: "seo",
      severity: "medium",
      title: "Meta açıklama bulunamadı",
      description:
        "Ana sayfada arama sonuçları için önemli olan meta description etiketi bulunamadı.",
      recommendation: "Kısa, net ve dönüşüm odaklı bir meta description ekleyin.",
      evidence: buildFetchEvidence("fetch_meta_description", snapshot, {
        actual: snapshot.metaDescription,
        expected: "non-empty-description",
      }),
      scoreImpacts: { seo: 15, content: 10 },
    });

    checks.push({
      key: "fetch_viewport_meta",
      passed: snapshot.hasViewportMeta,
      category: "accessibility",
      severity: "medium",
      title: "Mobil viewport etiketi bulunamadı",
      description:
        "Sayfanın mobil cihazlarda doğru ölçeklenmesi için viewport meta etiketi bulunamadı.",
      recommendation: "Head alanına responsive görünümü destekleyen viewport meta etiketi ekleyin.",
      evidence: buildFetchEvidence("fetch_viewport_meta", snapshot, {
        actual: snapshot.hasViewportMeta ? "present" : "missing",
        expected: "viewport-meta",
      }),
      scoreImpacts: { ux: 20 },
    });

    checks.push({
      key: "fetch_canonical",
      passed: Boolean(snapshot.canonicalUrl),
      category: "seo",
      severity: "low",
      title: "Canonical etiketi bulunamadı",
      description: "Sayfada canonical link etiketi bulunamadı.",
      recommendation: "Kopya içerik riskini azaltmak için canonical URL tanımlayın.",
      evidence: buildFetchEvidence("fetch_canonical", snapshot, {
        actual: snapshot.canonicalUrl,
        expected: "canonical-url",
      }),
      scoreImpacts: { seo: 10 },
    });
  }

  return checks;
}

function isHtmlContentType(contentType: string | null): boolean {
  if (!contentType) {
    return false;
  }

  const normalized = contentType.toLowerCase().split(";")[0]?.trim() ?? "";
  return normalized === "text/html" || normalized === "application/xhtml+xml";
}

export function runDeterministicAuditChecks(context: AuditOutputContext): DeterministicAuditCheck[] {
  const recordChecks = runRecordBasedChecks(context);
  const fetchChecks = context.fetchSnapshot ? runFetchBasedChecks(context.fetchSnapshot) : [];

  return [...recordChecks, ...fetchChecks];
}

export function mapCheckToFinding(check: DeterministicAuditCheck): AuditFindingInput | null {
  if (check.key === "prior_audit_exists" && check.passed) {
    return {
      category: check.category,
      severity: check.severity,
      title: check.title,
      description: check.description,
      recommendation: check.recommendation,
      evidence: check.evidence,
      affected_url: null,
    };
  }

  if (check.passed) {
    return null;
  }

  return {
    category: check.category,
    severity: check.severity,
    title: check.title,
    description: check.description,
    recommendation: check.recommendation,
    evidence: check.evidence,
    affected_url:
      check.evidence.final_url ??
      (check.evidence.source_table === "websites" ? (check.evidence.checked_value ?? null) : null),
  };
}

function buildCategoryScores(checks: DeterministicAuditCheck[]): AuditScoreInput[] {
  const categoryScores = new Map<FindingCategory, number>(
    SCORED_CATEGORIES.map((category) => [category, 100]),
  );

  for (const check of checks) {
    if (check.passed) {
      continue;
    }

    for (const [category, deduction] of Object.entries(check.scoreImpacts) as Array<
      [FindingCategory, number]
    >) {
      const current = categoryScores.get(category);

      if (current === undefined || deduction === undefined) {
        continue;
      }

      categoryScores.set(category, clampScore(current - deduction));
    }
  }

  return SCORED_CATEGORIES.map((category) => ({
    category,
    score: categoryScores.get(category) ?? 100,
    weight: CATEGORY_WEIGHTS[category] ?? 1,
  }));
}

function extractCheckKey(evidence: Json | null): string | null {
  if (!evidence || typeof evidence !== "object" || Array.isArray(evidence)) {
    return null;
  }

  const record = evidence as Record<string, unknown>;
  return typeof record.check_key === "string" ? record.check_key : null;
}

export async function getAuditContext(auditId: string): Promise<AuditOutputContext> {
  const supabase = createAdminSupabaseClient();

  const { data: audit, error: auditError } = await supabase
    .from("audits")
    .select("*")
    .eq("id", auditId)
    .maybeSingle();

  if (auditError) {
    throw new Error(auditError.message);
  }

  if (!audit) {
    throw new Error("Audit kaydı bulunamadı");
  }

  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("*")
    .eq("id", audit.website_id)
    .eq("workspace_id", audit.workspace_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (websiteError) {
    throw new Error(websiteError.message);
  }

  if (!website) {
    throw new Error("Web sitesi kaydı bulunamadı");
  }

  const leadId = website.lead_id ?? audit.lead_id;
  let lead: LeadRow | null = null;

  if (leadId) {
    const { data: leadRow, error: leadError } = await supabase
      .from("leads")
      .select("*")
      .eq("id", leadId)
      .eq("workspace_id", audit.workspace_id)
      .is("deleted_at", null)
      .maybeSingle();

    if (leadError) {
      throw new Error(leadError.message);
    }

    lead = leadRow;
  }

  let fetchSnapshot: WebsiteFetchSnapshot | null = null;

  try {
    fetchSnapshot = await fetchWebsiteSnapshot(website.url || website.domain);
  } catch {
    fetchSnapshot = null;
  }

  return { audit, website, lead, fetchSnapshot };
}

async function getExistingScoreCategories(auditId: string): Promise<Set<FindingCategory>> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("audit_scores")
    .select("category")
    .eq("audit_id", auditId);

  if (error) {
    throw new Error(error.message);
  }

  return new Set((data ?? []).map((row) => row.category));
}

async function getExistingFindingKeys(auditId: string): Promise<Set<string>> {
  const supabase = createAdminSupabaseClient();

  const { data, error } = await supabase
    .from("audit_findings")
    .select("evidence")
    .eq("audit_id", auditId);

  if (error) {
    throw new Error(error.message);
  }

  const keys = new Set<string>();

  for (const row of data ?? []) {
    const key = extractCheckKey(row.evidence);

    if (key) {
      keys.add(key);
    }
  }

  return keys;
}

export async function createAuditScore(
  auditId: string,
  workspaceId: string,
  scores: AuditScoreInput[],
): Promise<number> {
  const supabase = createAdminSupabaseClient();
  const existingCategories = await getExistingScoreCategories(auditId);
  const pending = scores.filter((score) => !existingCategories.has(score.category));

  if (pending.length === 0) {
    return 0;
  }

  const payload: TablesInsert<"audit_scores">[] = pending.map((score) => ({
    audit_id: auditId,
    workspace_id: workspaceId,
    category: score.category,
    score: score.score,
    weight: score.weight ?? 1,
  }));

  const { error } = await supabase.from("audit_scores").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  return pending.length;
}

export async function createAuditFindings(
  auditId: string,
  workspaceId: string,
  findings: AuditFindingInput[],
): Promise<number> {
  const supabase = createAdminSupabaseClient();
  const existingKeys = await getExistingFindingKeys(auditId);

  const pending = findings.filter((finding) => !existingKeys.has(finding.evidence.check_key));

  if (pending.length === 0) {
    return 0;
  }

  const payload: TablesInsert<"audit_findings">[] = pending.map((finding) => ({
    audit_id: auditId,
    workspace_id: workspaceId,
    category: finding.category,
    severity: finding.severity,
    title: finding.title,
    description: finding.description,
    recommendation: finding.recommendation,
    evidence: finding.evidence as Json,
    affected_url: finding.affected_url ?? null,
  }));

  const { error } = await supabase.from("audit_findings").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  return pending.length;
}

function toScoreBreakdown(scores: AuditScoreInput[]): ScoreBreakdown {
  const breakdown = {} as ScoreBreakdown;

  for (const score of scores) {
    breakdown[score.category] = score.score;
  }

  return breakdown;
}

export async function generateAuditOutput(auditId: string): Promise<GenerateAuditOutputResult> {
  const supabase = createAdminSupabaseClient();
  const context = await getAuditContext(auditId);

  if (context.audit.status !== "running") {
    throw new Error("Audit output yalnızca running durumunda üretilebilir");
  }

  const existingCategories = await getExistingScoreCategories(auditId);
  const existingFindingKeys = await getExistingFindingKeys(auditId);
  const hasExistingOutput = existingCategories.size > 0 || existingFindingKeys.size > 0;

  const checks = runDeterministicAuditChecks(context);
  const categoryScores = buildCategoryScores(checks);
  const findings = checks
    .map(mapCheckToFinding)
    .filter((finding): finding is AuditFindingInput => finding !== null);

  const scoresCreated = await createAuditScore(
    auditId,
    context.audit.workspace_id,
    categoryScores,
  );
  const findingsCreated = await createAuditFindings(
    auditId,
    context.audit.workspace_id,
    findings,
  );

  const overallScore = calculateOverallScore(categoryScores);
  const scoreBreakdown = toScoreBreakdown(categoryScores);

  const { error: auditUpdateError } = await supabase
    .from("audits")
    .update({
      overall_score: overallScore,
      score_breakdown: toJsonValue(scoreBreakdown),
    })
    .eq("id", auditId)
    .eq("status", "running");

  if (auditUpdateError) {
    throw new Error(auditUpdateError.message);
  }

  return {
    overallScore,
    scoreBreakdown,
    scoresCreated,
    findingsCreated,
    skipped: hasExistingOutput && scoresCreated === 0 && findingsCreated === 0,
    fetchAttempted: context.fetchSnapshot !== null,
    fetchOk: context.fetchSnapshot?.ok ?? false,
  };
}
