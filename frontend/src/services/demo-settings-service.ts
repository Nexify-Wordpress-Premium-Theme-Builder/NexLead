import type { DemoSettings, IntegrationSetting } from "@/types/settings";

export function searchIntegrations(
  integrations: IntegrationSetting[],
  query: string,
): IntegrationSetting[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return integrations;

  return integrations.filter((integration) =>
    [integration.name, integration.description].join(" ").toLowerCase().includes(normalizedQuery),
  );
}

export function filterIntegrationsByConnection(
  integrations: IntegrationSetting[],
  connected: boolean | "all",
): IntegrationSetting[] {
  if (connected === "all") return integrations;
  return integrations.filter((integration) => integration.connected === connected);
}

export function countConnectedIntegrations(integrations: IntegrationSetting[]): number {
  return integrations.filter((integration) => integration.connected).length;
}

export function mergeSettings(
  currentSettings: DemoSettings,
  nextSettings: Partial<DemoSettings>,
): DemoSettings {
  return {
    ...currentSettings,
    ...nextSettings,
    profile: {
      ...currentSettings.profile,
      ...(nextSettings.profile ?? {}),
    },
    workspace: {
      ...currentSettings.workspace,
      ...(nextSettings.workspace ?? {}),
    },
    outreach: {
      ...currentSettings.outreach,
      ...(nextSettings.outreach ?? {}),
    },
    integrations: nextSettings.integrations ?? currentSettings.integrations,
    billing: {
      ...currentSettings.billing,
      ...(nextSettings.billing ?? {}),
    },
  };
}
