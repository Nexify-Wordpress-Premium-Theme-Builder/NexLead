import type { PlanId } from "../types/workspace";

export interface PlanDefinition {
  id: PlanId;
  name: string;
  priceLabel: string;
  leadLimit: number;
  auditLimit: number;
}

export const PLANS: PlanDefinition[] = [
  {
    id: "starter",
    name: "Starter",
    priceLabel: "$49/mo",
    leadLimit: 100,
    auditLimit: 25,
  },
  {
    id: "growth",
    name: "Growth",
    priceLabel: "$99/mo",
    leadLimit: 500,
    auditLimit: 100,
  },
  {
    id: "agency",
    name: "Agency",
    priceLabel: "$199/mo",
    leadLimit: 2000,
    auditLimit: 500,
  },
];
