import { getServerAuthSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import type { SettingsPageData } from "./settings.types";

export async function getSettingsPageData(
  workspaceId: string,
  userId: string,
): Promise<SettingsPageData | null> {
  const user = await getServerAuthSessionUser();

  if (!user) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  const [profileResult, membershipResult, workspaceResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, locale, timezone")
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("workspace_members")
      .select("role, status, created_at")
      .eq("workspace_id", workspaceId)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("workspaces")
      .select("name, created_at")
      .eq("id", workspaceId)
      .is("deleted_at", null)
      .maybeSingle(),
  ]);

  if (profileResult.error) {
    throw new Error(profileResult.error.message);
  }

  if (membershipResult.error) {
    throw new Error(membershipResult.error.message);
  }

  if (workspaceResult.error) {
    throw new Error(workspaceResult.error.message);
  }

  return {
    profile: {
      fullName: profileResult.data?.full_name ?? null,
      email: user.email ?? "",
      locale: profileResult.data?.locale ?? "tr",
      timezone: profileResult.data?.timezone ?? "Europe/Istanbul",
    },
    workspace: {
      name: workspaceResult.data?.name ?? null,
      role: membershipResult.data?.role ?? null,
      memberStatus: membershipResult.data?.status ?? null,
      createdAt: workspaceResult.data?.created_at ?? membershipResult.data?.created_at ?? null,
    },
  };
}
