export const mockProfileSettings = {
  name: "John Carter",
  email: "john@acmemarketing.com",
  role: "Account Director",
};

export const mockWorkspaceSettings = {
  workspaceName: "Acme Marketing",
  companyWebsite: "https://acmemarketing.com",
  industryFocus: "B2B SaaS & Professional Services",
  teamSize: "11–25",
};

export const mockOutreachSettings = {
  defaultSenderName: "John Carter",
  signature: "John Carter\nAccount Director · Acme Marketing",
  tonePreference: "Professional",
  ctaPreference: "Soft ask",
};

export const mockIntegrations = [
  {
    id: "email",
    name: "Email Provider",
    description: "Connect Gmail or Outlook for outreach delivery.",
    connected: true,
  },
  {
    id: "calendar",
    name: "Google Calendar",
    description: "Sync meetings and availability.",
    connected: true,
  },
  {
    id: "leads",
    name: "Lead Source Tools",
    description: "Import leads from Apollo, LinkedIn, and CSV.",
    connected: false,
  },
  {
    id: "ai",
    name: "AI Provider",
    description: "Configure AI model for message personalization.",
    connected: true,
  },
];

export const mockBillingSettings = {
  plan: "Growth Plan",
  usage: "2,482 / 5,000 leads",
  renewalDate: "June 15, 2026",
};

export const mockSettingsTabs = [
  "Profile",
  "Workspace",
  "Outreach",
  "Integrations",
  "Billing",
] as const;
