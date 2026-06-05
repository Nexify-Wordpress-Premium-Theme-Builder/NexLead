"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { mockActivityFeed } from "@/data/mock-dashboard";
import { mockLeadDetails, mockLeads } from "@/data/mock-leads";
import { mockMeetings } from "@/data/mock-meetings";
import { mockOutreachCampaigns } from "@/data/mock-outreach";
import { mockPipelineColumns } from "@/data/mock-pipeline";
import {
  mockBillingSettings,
  mockIntegrations,
  mockOutreachSettings,
  mockProfileSettings,
  mockWorkspaceSettings,
} from "@/data/mock-settings";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import type { ActivityFeedItem } from "@/types/dashboard";
import type { Lead, LeadCreateInput, LeadDetailMap, LeadStatus } from "@/types/lead";
import type { Meeting, MeetingCreateInput } from "@/types/meeting";
import type {
  FlattenedPipelineCard,
  PipelineStageId,
} from "@/types/pipeline";
import type { OutreachCampaign, OutreachCampaignCreateInput } from "@/types/outreach";
import type { DemoSettings } from "@/types/settings";

const STORAGE_KEY = "nexlead-demo-state";

const leadStatusByStage: Record<PipelineStageId, LeadStatus> = {
  new: "new",
  audited: "audited",
  message_ready: "message_ready",
  sent: "sent",
  replied: "replied",
  meeting: "meeting",
  closed: "closed",
};

const stageByLeadStatus: Record<LeadStatus, PipelineStageId> = {
  new: "new",
  audited: "audited",
  message_ready: "message_ready",
  sent: "sent",
  replied: "replied",
  meeting: "meeting",
  closed: "closed",
};

const stageOrder: PipelineStageId[] = [
  "new",
  "audited",
  "message_ready",
  "sent",
  "replied",
  "meeting",
  "closed",
];

const stageBadge: Record<PipelineStageId, string> = {
  new: "Yeni",
  audited: "Analiz Edildi",
  message_ready: "Hazır",
  sent: "Gönderildi",
  replied: "Yanıt Geldi",
  meeting: "Görüşme",
  closed: "Kapandı",
};

const nextActionByStage: Record<PipelineStageId, string> = {
  new: "Analiz Çalıştır",
  audited: "Analiz Gönder",
  message_ready: "Kişiselleştir",
  sent: "Takip Et",
  replied: "Görüşme Planla",
  meeting: "Brifi Gör",
  closed: "Arşivle",
};

export interface DemoDataState {
  leads: Lead[];
  campaigns: OutreachCampaign[];
  meetings: Meeting[];
  pipelineCards: FlattenedPipelineCard[];
  settings: DemoSettings;
  activityFeed: ActivityFeedItem[];
  analyzedSearchIds: string[];
  leadDetails: LeadDetailMap;
}

export interface DemoDataContextValue extends DemoDataState {
  addLead: (leadInput: LeadCreateInput) => Lead;
  updateLeadStatus: (leadId: string, nextStatus: LeadStatus) => void;
  addCampaign: (campaignInput: OutreachCampaignCreateInput) => OutreachCampaign;
  addMeeting: (meetingInput: MeetingCreateInput) => Meeting;
  cancelMeeting: (meetingId: string) => void;
  movePipelineCard: (cardId: string, stageId: PipelineStageId) => void;
  movePipelineBack: (cardId: string) => void;
  markPipelineMeeting: (cardId: string) => void;
  closePipelineCard: (cardId: string) => void;
  updateSettings: (nextSettings: Partial<DemoSettings>) => void;
  toggleIntegration: (integrationId: string) => void;
  addActivity: (activity: Omit<ActivityFeedItem, "id" | "timeAgo"> & Partial<Pick<ActivityFeedItem, "timeAgo">>) => void;
  markSearchAnalyzed: (searchId: string) => void;
  getLeadDetail: (leadId: string) => LeadDetailMap[string] | undefined;
  updateLeadDetail: (leadId: string, updates: Partial<LeadDetailMap[string]>) => void;
}

export const DemoDataContext = createContext<DemoDataContextValue | null>(null);

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDefaultLeadDetail(lead: Lead): LeadDetailMap[string] {
  const websiteStatusByCode: Record<Lead["websiteStatus"], string> = {
    needs_work: "İyileştirme Gerekli",
    okay: "Orta",
    good: "İyi",
  };

  return {
    id: lead.id,
    company: lead.companyName,
    industry: lead.industry,
    website: lead.website,
    location: lead.location ?? "Bilinmiyor",
    companySize: "11–50 çalışan",
    contactStatus: "İncelenmedi",
    opportunityScore: lead.opportunityScore,
    websiteStatus: websiteStatusByCode[lead.websiteStatus],
    outreachStatus: "Gönderilmedi",
    nextAction: nextActionByStage[stageByLeadStatus[lead.status]],
    auditSummary: [],
    opportunityReasons: [],
    suggestedServices: [],
    outreachSubject: "",
    outreachBody: "",
    timeline: [{ label: "Müşteri eklendi", time: new Date().toISOString() }],
  };
}

function createActivityItem(
  message: string,
  type: ActivityFeedItem["type"],
  timeAgo = "Az önce",
): ActivityFeedItem {
  return {
    id: createId("act"),
    message,
    type,
    timeAgo,
  };
}

function flattenPipelineCards(): FlattenedPipelineCard[] {
  const leadByCompany = new Map(mockLeads.map((lead) => [lead.companyName.toLowerCase(), lead]));

  return mockPipelineColumns.flatMap((column) =>
    column.cards.map((card) => {
      const matchedLead = leadByCompany.get(card.company.toLowerCase());
      const stageId = column.id as PipelineStageId;

      return {
        id: card.id,
        stageId,
        company: card.company,
        industry: card.industry,
        score: card.score,
        nextAction: nextActionByStage[stageId],
        badge: stageBadge[stageId],
        leadId: matchedLead?.id,
      };
    }),
  );
}

function createDefaultState(): DemoDataState {
  return {
    leads: mockLeads,
    campaigns: mockOutreachCampaigns,
    meetings: mockMeetings,
    pipelineCards: flattenPipelineCards(),
    settings: {
      profile: mockProfileSettings,
      workspace: mockWorkspaceSettings,
      outreach: mockOutreachSettings,
      integrations: mockIntegrations,
      billing: mockBillingSettings,
    },
    activityFeed: mockActivityFeed,
    analyzedSearchIds: [],
    leadDetails: mockLeadDetails,
  };
}

function mergeState(baseState: DemoDataState, storedState: Partial<DemoDataState>): DemoDataState {
  return {
    ...baseState,
    ...storedState,
    settings: {
      ...baseState.settings,
      ...(storedState.settings ?? {}),
      profile: {
        ...baseState.settings.profile,
        ...(storedState.settings?.profile ?? {}),
      },
      workspace: {
        ...baseState.settings.workspace,
        ...(storedState.settings?.workspace ?? {}),
      },
      outreach: {
        ...baseState.settings.outreach,
        ...(storedState.settings?.outreach ?? {}),
      },
      integrations: storedState.settings?.integrations ?? baseState.settings.integrations,
      billing: {
        ...baseState.settings.billing,
        ...(storedState.settings?.billing ?? {}),
      },
    },
    analyzedSearchIds: storedState.analyzedSearchIds ?? baseState.analyzedSearchIds,
    activityFeed: storedState.activityFeed ?? baseState.activityFeed,
    pipelineCards: storedState.pipelineCards ?? baseState.pipelineCards,
    leadDetails: storedState.leadDetails ?? baseState.leadDetails,
  };
}

function upsertPipelineCard(
  cards: FlattenedPipelineCard[],
  lead: Lead,
  stageId: PipelineStageId,
): FlattenedPipelineCard[] {
  const existingIndex = cards.findIndex((card) => card.leadId === lead.id);
  const nextCard: FlattenedPipelineCard = {
    id: existingIndex >= 0 ? cards[existingIndex].id : createId("pipe"),
    stageId,
    leadId: lead.id,
    company: lead.companyName,
    industry: lead.industry,
    score: lead.opportunityScore,
    nextAction: nextActionByStage[stageId],
    badge: stageBadge[stageId],
  };

  if (existingIndex < 0) {
    return [nextCard, ...cards];
  }

  return cards.map((card, index) => (index === existingIndex ? nextCard : card));
}

export interface DemoDataProviderProps {
  children: ReactNode;
}

export function DemoDataProvider({ children }: DemoDataProviderProps) {
  const [state, setState] = useState<DemoDataState>(() => {
    const defaultState = createDefaultState();
    const storedState = getStorageItem<Partial<DemoDataState> | null>(STORAGE_KEY, null);

    if (!storedState) return defaultState;

    return mergeState(defaultState, storedState);
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEY, state);
  }, [state]);

  const addActivity = useCallback(
    (activity: Omit<ActivityFeedItem, "id" | "timeAgo"> & Partial<Pick<ActivityFeedItem, "timeAgo">>) => {
      const nextActivity: ActivityFeedItem = {
        id: createId("act"),
        message: activity.message,
        type: activity.type,
        timeAgo: activity.timeAgo ?? "Az önce",
      };

      setState((currentState) => ({
        ...currentState,
        activityFeed: [nextActivity, ...currentState.activityFeed].slice(0, 30),
      }));
    },
    [],
  );

  const addLead = useCallback((leadInput: LeadCreateInput): Lead => {
    const now = new Date().toISOString();
    const nextLead: Lead = {
      id: createId("lead"),
      companyName: leadInput.companyName,
      website: leadInput.website,
      industry: leadInput.industry,
      location: leadInput.location,
      status: "new",
      opportunityScore: leadInput.opportunityScore ?? 70,
      websiteStatus: leadInput.websiteStatus ?? "needs_work",
      createdAt: now,
      updatedAt: now,
    };

    setState((currentState) => ({
      ...currentState,
      leads: [nextLead, ...currentState.leads],
      leadDetails: {
        ...currentState.leadDetails,
        [nextLead.id]: createDefaultLeadDetail(nextLead),
      },
      pipelineCards: upsertPipelineCard(currentState.pipelineCards, nextLead, "new"),
      activityFeed: [
        createActivityItem(`Yeni müşteri eklendi: ${nextLead.companyName}`, "lead"),
        ...currentState.activityFeed,
      ].slice(0, 30),
    }));

    return nextLead;
  }, []);

  const updateLeadStatus = useCallback((leadId: string, nextStatus: LeadStatus) => {
    const updatedAt = new Date().toISOString();

    setState((currentState) => {
      const targetLead = currentState.leads.find((lead) => lead.id === leadId);
      if (!targetLead) return currentState;

      const updatedLead = { ...targetLead, status: nextStatus, updatedAt };
      const stageId = stageByLeadStatus[nextStatus];

      return {
        ...currentState,
        leads: currentState.leads.map((lead) => (lead.id === leadId ? updatedLead : lead)),
        pipelineCards: upsertPipelineCard(currentState.pipelineCards, updatedLead, stageId),
      };
    });
  }, []);

  const addCampaign = useCallback((campaignInput: OutreachCampaignCreateInput): OutreachCampaign => {
    const nextCampaign: OutreachCampaign = {
      id: createId("camp"),
      name: campaignInput.name,
      leadCount: campaignInput.leadCount,
      replyRate: campaignInput.replyRate,
      status: campaignInput.status ?? "draft",
    };

    setState((currentState) => ({
      ...currentState,
      campaigns: [nextCampaign, ...currentState.campaigns],
      activityFeed: [
        createActivityItem(`Kampanya oluşturuldu: ${nextCampaign.name}`, "outreach"),
        ...currentState.activityFeed,
      ].slice(0, 30),
    }));

    return nextCampaign;
  }, []);

  const addMeeting = useCallback((meetingInput: MeetingCreateInput): Meeting => {
    const nextMeeting: Meeting = {
      id: createId("meeting"),
      ...meetingInput,
      status: "scheduled",
    };

    setState((currentState) => {
      const lead = currentState.leads.find((item) => item.id === meetingInput.leadId);
      const updatedLead = lead
        ? { ...lead, status: "meeting" as const, updatedAt: new Date().toISOString() }
        : undefined;

      return {
        ...currentState,
        meetings: [nextMeeting, ...currentState.meetings],
        leads: updatedLead
          ? currentState.leads.map((item) => (item.id === updatedLead.id ? updatedLead : item))
          : currentState.leads,
        pipelineCards:
          updatedLead && updatedLead.status
            ? upsertPipelineCard(currentState.pipelineCards, updatedLead, "meeting")
            : currentState.pipelineCards,
        activityFeed: [
          createActivityItem(`Görüşme planlandı: ${nextMeeting.title}`, "meeting"),
          ...currentState.activityFeed,
        ].slice(0, 30),
      };
    });

    return nextMeeting;
  }, []);

  const cancelMeeting = useCallback((meetingId: string) => {
    setState((currentState) => {
      const targetMeeting = currentState.meetings.find((meeting) => meeting.id === meetingId);
      if (!targetMeeting) return currentState;

      const nextMeetings = currentState.meetings.filter((meeting) => meeting.id !== meetingId);
      const targetLead = currentState.leads.find((lead) => lead.id === targetMeeting.leadId);

      if (!targetLead) {
        return {
          ...currentState,
          meetings: nextMeetings,
        };
      }

      const updatedLead = {
        ...targetLead,
        status: "replied" as const,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...currentState,
        meetings: nextMeetings,
        leads: currentState.leads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
        pipelineCards: upsertPipelineCard(currentState.pipelineCards, updatedLead, "replied"),
        activityFeed: [
          createActivityItem(`Görüşme iptal edildi: ${targetMeeting.title}`, "meeting"),
          ...currentState.activityFeed,
        ].slice(0, 30),
      };
    });
  }, []);

  const movePipelineCard = useCallback((cardId: string, stageId: PipelineStageId) => {
    setState((currentState) => {
      const targetCard = currentState.pipelineCards.find((card) => card.id === cardId);
      if (!targetCard) return currentState;

      const nextCards = currentState.pipelineCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              stageId,
              badge: stageBadge[stageId],
              nextAction: nextActionByStage[stageId],
            }
          : card,
      );

      const nextLeads = targetCard.leadId
        ? currentState.leads.map((lead) =>
            lead.id === targetCard.leadId
              ? {
                  ...lead,
                  status: leadStatusByStage[stageId],
                  updatedAt: new Date().toISOString(),
                }
              : lead,
          )
        : currentState.leads;

      return {
        ...currentState,
        pipelineCards: nextCards,
        leads: nextLeads,
      };
    });
  }, []);

  const movePipelineBack = useCallback(
    (cardId: string) => {
      const targetCard = state.pipelineCards.find((card) => card.id === cardId);
      if (!targetCard) return;

      const currentIndex = stageOrder.indexOf(targetCard.stageId);
      if (currentIndex <= 0) return;

      movePipelineCard(cardId, stageOrder[currentIndex - 1]);
    },
    [movePipelineCard, state.pipelineCards],
  );

  const markPipelineMeeting = useCallback(
    (cardId: string) => {
      movePipelineCard(cardId, "meeting");
    },
    [movePipelineCard],
  );

  const closePipelineCard = useCallback(
    (cardId: string) => {
      movePipelineCard(cardId, "closed");
    },
    [movePipelineCard],
  );

  const updateSettings = useCallback((nextSettings: Partial<DemoSettings>) => {
    setState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        ...nextSettings,
        profile: {
          ...currentState.settings.profile,
          ...(nextSettings.profile ?? {}),
        },
        workspace: {
          ...currentState.settings.workspace,
          ...(nextSettings.workspace ?? {}),
        },
        outreach: {
          ...currentState.settings.outreach,
          ...(nextSettings.outreach ?? {}),
        },
        integrations: nextSettings.integrations ?? currentState.settings.integrations,
        billing: {
          ...currentState.settings.billing,
          ...(nextSettings.billing ?? {}),
        },
      },
    }));
  }, []);

  const toggleIntegration = useCallback((integrationId: string) => {
    setState((currentState) => ({
      ...currentState,
      settings: {
        ...currentState.settings,
        integrations: currentState.settings.integrations.map((integration) =>
          integration.id === integrationId
            ? { ...integration, connected: !integration.connected }
            : integration,
        ),
      },
    }));
  }, []);

  const markSearchAnalyzed = useCallback((searchId: string) => {
    setState((currentState) => {
      if (currentState.analyzedSearchIds.includes(searchId)) return currentState;

      return {
        ...currentState,
        analyzedSearchIds: [...currentState.analyzedSearchIds, searchId],
      };
    });
  }, []);

  const getLeadDetail = useCallback(
    (leadId: string) => {
      return state.leadDetails[leadId];
    },
    [state.leadDetails],
  );

  const updateLeadDetail = useCallback((leadId: string, updates: Partial<LeadDetailMap[string]>) => {
    setState((currentState) => {
      const currentDetail = currentState.leadDetails[leadId];
      if (!currentDetail) return currentState;

      const mergedDetail = { ...currentDetail, ...updates };

      return {
        ...currentState,
        leadDetails: {
          ...currentState.leadDetails,
          [leadId]: mergedDetail,
        },
        leads: currentState.leads.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                companyName: mergedDetail.company,
                industry: mergedDetail.industry,
                website: mergedDetail.website,
                location: mergedDetail.location,
                opportunityScore: mergedDetail.opportunityScore,
                updatedAt: new Date().toISOString(),
              }
            : lead,
        ),
      };
    });
  }, []);

  const value = useMemo<DemoDataContextValue>(
    () => ({
      ...state,
      addLead,
      updateLeadStatus,
      addCampaign,
      addMeeting,
      cancelMeeting,
      movePipelineCard,
      movePipelineBack,
      markPipelineMeeting,
      closePipelineCard,
      updateSettings,
      toggleIntegration,
      addActivity,
      markSearchAnalyzed,
      getLeadDetail,
      updateLeadDetail,
    }),
    [
      state,
      addLead,
      updateLeadStatus,
      addCampaign,
      addMeeting,
      cancelMeeting,
      movePipelineCard,
      movePipelineBack,
      markPipelineMeeting,
      closePipelineCard,
      updateSettings,
      toggleIntegration,
      addActivity,
      markSearchAnalyzed,
      getLeadDetail,
      updateLeadDetail,
    ],
  );

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}
