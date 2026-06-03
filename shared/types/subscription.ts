import type { PlanId } from "./workspace";

export type SubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";

export interface Subscription {
  id: string;
  workspaceId: string;
  planId: PlanId;
  status: SubscriptionStatus;
  currentPeriodEnd: string;
}
