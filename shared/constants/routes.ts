export const ROUTES = {
  home: "/",
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    forgotPassword: "/auth/forgot-password",
  },
  app: {
    dashboard: "/dashboard",
    leadSearch: "/lead-search",
    leads: "/leads",
    leadDetail: (leadId: string) => `/leads/${leadId}`,
    websiteAudit: "/website-audit",
    outreach: "/outreach",
    pipeline: "/pipeline",
    meetings: "/meetings",
    reports: "/reports",
    settings: "/settings",
  },
} as const;
