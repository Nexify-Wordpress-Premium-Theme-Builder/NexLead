"use client";

import { useState } from "react";
import {
  mockBillingSettings,
  mockIntegrations,
  mockOutreachSettings,
  mockProfileSettings,
  mockSettingsTabs,
  mockWorkspaceSettings,
} from "@/data/mock-settings";
import { Tabs, TabPanel } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { panelClass } from "@/lib/panel";
import { cn } from "@/lib/cn";

const tabIds = ["profile", "workspace", "outreach", "integrations", "billing"] as const;

export function SettingsPageContent() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabItems = mockSettingsTabs.map((label, i) => ({
    id: tabIds[i],
    label,
  }));

  return (
    <div className={cn(panelClass("p-6"), "animate-fade-up animation-delay-100")}>
      <Tabs
        items={tabItems}
        activeId={activeTab}
        onChange={setActiveTab}
        className="mb-2 border-border-soft"
      />

      <TabPanel>
        {activeTab === "profile" && (
          <div className="grid gap-5 md:grid-cols-[auto_1fr]">
            <Avatar name={mockProfileSettings.name} className="h-16 w-16 text-lg" />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">Name</label>
                <Input defaultValue={mockProfileSettings.name} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">Email</label>
                <Input defaultValue={mockProfileSettings.email} type="email" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">Role</label>
                <Input defaultValue={mockProfileSettings.role} />
              </div>
            </div>
            <div className="md:col-span-2">
              <button type="button" className="btn-campaign">Save Profile</button>
            </div>
          </div>
        )}

        {activeTab === "workspace" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Workspace name</label>
              <Input defaultValue={mockWorkspaceSettings.workspaceName} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Company website</label>
              <Input defaultValue={mockWorkspaceSettings.companyWebsite} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Industry focus</label>
              <Input defaultValue={mockWorkspaceSettings.industryFocus} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Team size</label>
              <Input defaultValue={mockWorkspaceSettings.teamSize} />
            </div>
            <div className="sm:col-span-2">
              <button type="button" className="btn-campaign">Save Workspace</button>
            </div>
          </div>
        )}

        {activeTab === "outreach" && (
          <div className="grid gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Default sender name</label>
              <Input defaultValue={mockOutreachSettings.defaultSenderName} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text-muted">Signature</label>
              <Textarea defaultValue={mockOutreachSettings.signature} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">Tone preference</label>
                <Input defaultValue={mockOutreachSettings.tonePreference} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-text-muted">CTA preference</label>
                <Input defaultValue={mockOutreachSettings.ctaPreference} />
              </div>
            </div>
            <button type="button" className="btn-campaign w-fit">Save Outreach Settings</button>
          </div>
        )}

        {activeTab === "integrations" && (
          <div className="grid gap-3 md:grid-cols-2">
            {mockIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="rounded-xl border border-border-soft bg-surface-muted/40 p-4 transition-all duration-200 hover:border-border"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-text-primary">{integration.name}</p>
                  <Badge variant={integration.connected ? "success" : "default"}>
                    {integration.connected ? "Connected" : "Not connected"}
                  </Badge>
                </div>
                <p className="text-[13px] text-text-secondary">{integration.description}</p>
                <button
                  type="button"
                  className="mt-3 text-[13px] font-semibold text-primary hover:text-primary-hover"
                >
                  {integration.connected ? "Manage" : "Connect"}
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "billing" && (
          <div className="max-w-md space-y-4">
            <div className="rounded-xl border border-border-soft bg-primary-soft/30 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Current plan</p>
              <p className="mt-1 text-xl font-bold text-text-primary">{mockBillingSettings.plan}</p>
              <p className="mt-2 text-[13px] text-text-secondary">Usage: {mockBillingSettings.usage}</p>
              <p className="text-[13px] text-text-muted">Renews {mockBillingSettings.renewalDate}</p>
            </div>
            <button type="button" className="btn-campaign">Upgrade Plan</button>
          </div>
        )}
      </TabPanel>
    </div>
  );
}
