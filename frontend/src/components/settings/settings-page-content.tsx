"use client";

import { useEffect, useState } from "react";
import { Tabs, TabPanel } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LoadingButtonState } from "@/components/ui/loading-state";
import { useDemoData } from "@/hooks/use-demo-data";
import { useToast } from "@/hooks/use-toast";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";

const tabItems = [
  { id: "profile", label: "Profile" },
  { id: "workspace", label: "Workspace" },
  { id: "outreach", label: "Outreach" },
  { id: "integrations", label: "Integrations" },
  { id: "billing", label: "Billing" },
] as const;

function getRandomDelay() {
  return 800 + Math.floor(Math.random() * 701);
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function SettingsPageContent() {
  const toast = useToast();
  const { settings, updateSettings, toggleIntegration } = useDemoData();

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState(settings.profile);
  const [workspaceForm, setWorkspaceForm] = useState(settings.workspace);
  const [outreachForm, setOutreachForm] = useState(settings.outreach);

  useEffect(() => {
    setProfileForm(settings.profile);
    setWorkspaceForm(settings.workspace);
    setOutreachForm(settings.outreach);
  }, [settings.profile, settings.workspace, settings.outreach]);

  const saveProfile = async () => {
    setIsSaving(true);
    await wait(getRandomDelay());
    updateSettings({ profile: profileForm });
    setIsSaving(false);
    toast.success("Profile saved", "Your profile settings have been updated.");
  };

  const saveWorkspace = async () => {
    setIsSaving(true);
    await wait(getRandomDelay());
    updateSettings({ workspace: workspaceForm });
    setIsSaving(false);
    toast.success("Workspace saved", "Workspace settings updated.");
  };

  const saveOutreach = async () => {
    setIsSaving(true);
    await wait(getRandomDelay());
    updateSettings({ outreach: outreachForm });
    setIsSaving(false);
    toast.success("Outreach settings saved", "Default outreach preferences updated.");
  };

  const resetProfile = () => setProfileForm(settings.profile);
  const resetWorkspace = () => setWorkspaceForm(settings.workspace);
  const resetOutreach = () => setOutreachForm(settings.outreach);

  return (
    <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-100")}>
      <Tabs
        items={tabItems.map((item) => ({ id: item.id, label: item.label }))}
        activeId={activeTab}
        onChange={setActiveTab}
        className="mb-2 border-border-soft"
      />

      <TabPanel>
        {activeTab === "profile" && (
          <div className="grid gap-5 md:grid-cols-[auto_1fr]">
            <Avatar name={profileForm.name} className="h-16 w-16 text-lg" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">Name</label>
                <Input
                  value={profileForm.name}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, name: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">Email</label>
                <Input
                  value={profileForm.email}
                  type="email"
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, email: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">Role</label>
                <Input
                  value={profileForm.role}
                  onChange={(event) =>
                    setProfileForm((current) => ({ ...current, role: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 md:col-span-2">
              <button
                type="button"
                className="btn-campaign inline-flex h-10 items-center px-4 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={saveProfile}
                disabled={isSaving}
              >
                <LoadingButtonState isLoading={isSaving} loadingText="Saving...">
                  Save Profile
                </LoadingButtonState>
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                onClick={resetProfile}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {activeTab === "workspace" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Workspace name</label>
              <Input
                value={workspaceForm.workspaceName}
                onChange={(event) =>
                  setWorkspaceForm((current) => ({ ...current, workspaceName: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Company website</label>
              <Input
                value={workspaceForm.companyWebsite}
                onChange={(event) =>
                  setWorkspaceForm((current) => ({ ...current, companyWebsite: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Industry focus</label>
              <Input
                value={workspaceForm.industryFocus}
                onChange={(event) =>
                  setWorkspaceForm((current) => ({ ...current, industryFocus: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Team size</label>
              <Input
                value={workspaceForm.teamSize}
                onChange={(event) =>
                  setWorkspaceForm((current) => ({ ...current, teamSize: event.target.value }))
                }
              />
            </div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="button"
                className="btn-campaign inline-flex h-10 items-center px-4 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={saveWorkspace}
                disabled={isSaving}
              >
                <LoadingButtonState isLoading={isSaving} loadingText="Saving...">
                  Save Workspace
                </LoadingButtonState>
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                onClick={resetWorkspace}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {activeTab === "outreach" && (
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Default sender name</label>
              <Input
                value={outreachForm.defaultSenderName}
                onChange={(event) =>
                  setOutreachForm((current) => ({ ...current, defaultSenderName: event.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Signature</label>
              <Textarea
                value={outreachForm.signature}
                onChange={(event) =>
                  setOutreachForm((current) => ({ ...current, signature: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">Tone preference</label>
                <Input
                  value={outreachForm.tonePreference}
                  onChange={(event) =>
                    setOutreachForm((current) => ({ ...current, tonePreference: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">CTA preference</label>
                <Input
                  value={outreachForm.ctaPreference}
                  onChange={(event) =>
                    setOutreachForm((current) => ({ ...current, ctaPreference: event.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-campaign inline-flex h-10 items-center px-4 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={saveOutreach}
                disabled={isSaving}
              >
                <LoadingButtonState isLoading={isSaving} loadingText="Saving...">
                  Save Outreach Settings
                </LoadingButtonState>
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center rounded-lg border border-border bg-surface px-4 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                onClick={resetOutreach}
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="grid gap-3 md:grid-cols-2">
            {settings.integrations.map((integration) => (
              <div
                key={integration.id}
                className="rounded-xl border border-border-soft bg-surface-muted/40 p-4 transition-all duration-200 hover:border-border"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-text-primary">{integration.name}</p>
                  <Badge variant={integration.connected ? "success" : "default"}>
                    {integration.connected ? "Connected" : "Disconnected"}
                  </Badge>
                </div>
                <p className="text-[13px] text-text-secondary">{integration.description}</p>
                <button
                  type="button"
                  className="mt-3 text-[13px] font-semibold text-primary hover:text-primary-hover"
                  onClick={() => {
                    toggleIntegration(integration.id);
                    toast.success(
                      integration.connected ? "Integration disconnected" : "Integration connected",
                      `${integration.name} status updated.`,
                    );
                  }}
                >
                  {integration.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "billing" && (
          <div className="max-w-md space-y-4">
            <div className="rounded-xl border border-border-soft bg-primary-soft/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Current plan</p>
              <p className="mt-1 text-xl font-bold text-text-primary">{settings.billing.plan}</p>
              <p className="mt-2 text-[13px] text-text-secondary">Usage: {settings.billing.usage}</p>
              <p className="text-[13px] text-text-muted">Renews {settings.billing.renewalDate}</p>
            </div>
            <button
              type="button"
              className="btn-campaign"
              onClick={() => toast.info("Upgrade flow", "Upgrade flow is available in production build.")}
            >
              Upgrade Plan
            </button>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
