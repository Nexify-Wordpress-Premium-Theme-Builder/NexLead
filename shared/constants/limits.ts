export const PLAN_LIMITS = {
  starter: { leads: 100, audits: 25, outreachPerDay: 50 },
  growth: { leads: 500, audits: 100, outreachPerDay: 200 },
  agency: { leads: 2000, audits: 500, outreachPerDay: 1000 },
} as const;
