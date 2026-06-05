export interface ProfileSettings {
  name: string;
  email: string;
  role: string;
}

export interface WorkspaceSettings {
  workspaceName: string;
  companyWebsite: string;
  industryFocus: string;
  teamSize: string;
}

export interface OutreachSettings {
  defaultSenderName: string;
  signature: string;
  tonePreference: string;
  ctaPreference: string;
}

export interface IntegrationSetting {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}

export interface BillingSettings {
  plan: string;
  usage: string;
  renewalDate: string;
}

export interface DemoSettings {
  profile: ProfileSettings;
  workspace: WorkspaceSettings;
  outreach: OutreachSettings;
  integrations: IntegrationSetting[];
  billing: BillingSettings;
}
