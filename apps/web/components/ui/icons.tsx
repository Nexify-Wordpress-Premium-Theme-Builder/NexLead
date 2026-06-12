import type { IconProps as PhosphorIconProps, IconWeight } from "@phosphor-icons/react";
import {
  Bell,
  CalendarBlank,
  CaretRight,
  ChartLineUp,
  CheckCircle,
  Clock,
  EnvelopeSimple,
  FileText,
  Gear,
  GlobeHemisphereWest,
  House,
  Lightning,
  LinkSimple,
  List,
  LockKey,
  MagnifyingGlass,
  SignOut,
  SquaresFour,
  Target,
  TrendUp,
  User,
  Users,
  Warning,
  X,
} from "@phosphor-icons/react/ssr";
import type { ComponentType } from "react";

export type IconProps = PhosphorIconProps & {
  strokeWidth?: number;
};

function strokeWidthToWeight(strokeWidth?: number): IconWeight | undefined {
  if (strokeWidth === undefined) return undefined;
  if (strokeWidth >= 2.2) return "bold";
  if (strokeWidth >= 1.75) return "regular";
  return "light";
}

function createIcon(
  IconComponent: ComponentType<PhosphorIconProps>,
  defaultSize = 20,
): ComponentType<IconProps> {
  function NexIcon({ size = defaultSize, weight = "regular", strokeWidth, ...props }: IconProps) {
    const resolvedWeight = strokeWidthToWeight(strokeWidth) ?? weight;

    return <IconComponent size={size} weight={resolvedWeight} aria-hidden {...props} />;
  }

  return NexIcon;
}

export const IconMail = createIcon(EnvelopeSimple);
export const IconLock = createIcon(LockKey);
export const IconUser = createIcon(User);
export const IconLogout = createIcon(SignOut);
export const IconMenu = createIcon(List);
export const IconClose = createIcon(X);
export const IconLayout = createIcon(SquaresFour);
export const IconGlobe = createIcon(GlobeHemisphereWest);
export const IconUsers = createIcon(Users);
export const IconActivity = createIcon(ChartLineUp);
export const IconCheckCircle = createIcon(CheckCircle);
export const IconClock = createIcon(Clock);
export const IconChevronRight = createIcon(CaretRight, 18);
export const IconSearch = createIcon(MagnifyingGlass, 20);
export const IconBell = createIcon(Bell, 20);
export const IconCalendar = createIcon(CalendarBlank, 20);
export const IconSettings = createIcon(Gear, 20);
export const IconFileText = createIcon(FileText, 20);
export const IconAlertTriangle = createIcon(Warning, 22);
export const IconTarget = createIcon(Target, 22);
export const IconTrendingUp = createIcon(TrendUp, 22);
export const IconZap = createIcon(Lightning, 20);
export const IconLink = createIcon(LinkSimple, 20);
export const IconHome = createIcon(House, 20);
