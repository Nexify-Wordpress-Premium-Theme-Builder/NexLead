export type PlanId = "starter" | "growth" | "agency";

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  planId: PlanId;
  memberCount: number;
}
