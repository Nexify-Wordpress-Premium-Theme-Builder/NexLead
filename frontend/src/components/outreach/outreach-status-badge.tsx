import { Badge } from "@/components/ui/badge";
import { OUTREACH_STATUS_LABELS } from "@shared/constants/statuses";
import type { OutreachStatus } from "@shared/types/outreach";

export function OutreachStatusBadge({ status }: { status: OutreachStatus }) {
  return <Badge variant="purple">{OUTREACH_STATUS_LABELS[status]}</Badge>;
}
