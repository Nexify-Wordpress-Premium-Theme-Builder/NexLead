import { Badge } from "@/components/ui/badge";
import { LEAD_STATUS_LABELS } from "@shared/constants/statuses";
import type { LeadStatus } from "@shared/types/lead";

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return <Badge>{LEAD_STATUS_LABELS[status]}</Badge>;
}
