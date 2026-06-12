import type { Json, TablesInsert } from "@nexlead/types";

import { createAdminSupabaseClient } from "../../supabase/admin-client";
import { buildWebsiteUrl, normalizeDomain } from "../../utils/normalize-domain";

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

function buildEvidence(
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
  };
}

export function runDeterministicAuditChecks(context: AuditOutputContext): DeterministicAuditCheck[] {
  const { audit, website, lead } = context;
  const checks: DeterministicAuditCheck[] = [];
  const websiteUrl = website.url.trim();
  const websiteDomain = getWebsiteDomain(website);
  const urlDomain = normalizeDomain(website.url).normalized;
  const storedDomain = normalizeDomain(website.domain).normalized;

  checks.push({
    key: "https_required",
    passed: websiteUrl.toLowerCase().startsWith("https://"),
    category: "security",
    severity: "medium",
    title: "Web sitesi HTTPS kullanmıyor",
    description: "Web site adresi güvenli HTTPS protokolüyle başlamıyor.",
    recommendation: "Web sitesinin HTTPS üzerinden erişilebilir olduğundan emin olun.",
    evidence: buildEvidence(
      "https_required",
      websiteUrl,
      "https://",
      "websites",
      "url",
    ),
    scoreImpacts: { security: 25 },
  });

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
    evidence: buildEvidence(
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
      evidence: buildEvidence(
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
    evidence: buildEvidence(
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
      evidence: buildEvidence(
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
      evidence: buildEvidence(
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
        evidence: buildEvidence(
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
      evidence: buildEvidence(
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
      evidence: buildEvidence(
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
      evidence: buildEvidence(
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
    affected_url: check.evidence.source_table === "websites" ? check.evidence.checked_value : null,
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

  return { audit, website, lead };
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
  };
}
