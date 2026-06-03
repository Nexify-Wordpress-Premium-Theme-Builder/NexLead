import type { LeadStatus } from "../types/lead";
import type { OutreachStatus } from "../types/outreach";

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  audited: "Audited",
  message_ready: "Message Ready",
  sent: "Sent",
  replied: "Replied",
  meeting: "Meeting",
  closed: "Closed",
};

export const OUTREACH_STATUS_LABELS: Record<OutreachStatus, string> = {
  draft: "Draft",
  ready: "Ready",
  sent: "Sent",
  opened: "Opened",
  replied: "Replied",
  failed: "Failed",
};
