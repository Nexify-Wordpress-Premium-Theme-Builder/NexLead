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
  { id: "dashboard", label: "Panel", href: ROUTES.app.dashboard, icon: LayoutDashboard },
  { id: "lead-search", label: "Müşteri Bul", href: ROUTES.app.leadSearch, icon: Search },
  { id: "leads", label: "Potansiyel Müşteriler", href: ROUTES.app.leads, icon: Users },
  { id: "website-audit", label: "Site Analizi", href: ROUTES.app.websiteAudit, icon: Globe },
  { id: "outreach", label: "İletişim", href: ROUTES.app.outreach, icon: Send },
  { id: "pipeline", label: "Satış Süreci", href: ROUTES.app.pipeline, icon: Funnel },
  { id: "meetings", label: "Görüşmeler", href: ROUTES.app.meetings, icon: Calendar },
  { id: "reports", label: "Raporlar", href: ROUTES.app.reports, icon: BarChart3 },
  { id: "settings", label: "Ayarlar", href: ROUTES.app.settings, icon: Settings },
];
