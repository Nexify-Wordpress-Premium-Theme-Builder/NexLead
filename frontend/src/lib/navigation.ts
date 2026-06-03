import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Calendar,
  Funnel,
  Globe,
  LayoutDashboard,
  Search,
  Send,
  Settings,
  Users,
} from "lucide-react";
import { ROUTES } from "@shared/constants/routes";

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", href: ROUTES.app.dashboard, icon: LayoutDashboard },
  { id: "lead-search", label: "Lead Search", href: ROUTES.app.leadSearch, icon: Search },
  { id: "leads", label: "Leads", href: ROUTES.app.leads, icon: Users },
  { id: "website-audit", label: "Website Audit", href: ROUTES.app.websiteAudit, icon: Globe },
  { id: "outreach", label: "Outreach", href: ROUTES.app.outreach, icon: Send },
  { id: "pipeline", label: "Pipeline", href: ROUTES.app.pipeline, icon: Funnel },
  { id: "meetings", label: "Meetings", href: ROUTES.app.meetings, icon: Calendar },
  { id: "reports", label: "Reports", href: ROUTES.app.reports, icon: BarChart3 },
  { id: "settings", label: "Settings", href: ROUTES.app.settings, icon: Settings },
];
