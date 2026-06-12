import type { BootstrapStatus } from "@nexlead/types";
import { cache } from "react";

import { createServerSupabaseClient } from "@/lib/supabase";

const EMPTY_BOOTSTRAP: BootstrapStatus = {
  profile: false,
  workspace: false,
  membership: false,
  ready: false,
};

export const getServerBootstrapStatus = cache(async (userId: string): Promise<BootstrapStatus> => {
  try {
    const supabase = await createServerSupabaseClient();

    const [profileResult, membershipResult] = await Promise.all([
      supabase.from("profiles").select("id, last_active_workspace_id").eq("id", userId).maybeSingle(),
      supabase
        .from("workspace_members")
        .select("id, workspace_id, role, status")
        .eq("user_id", userId)
        .eq("status", "active")
        .eq("role", "owner")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

    const profile = profileResult.data ?? null;
    const membership = membershipResult.data ?? null;
    const workspaceId = membership?.workspace_id ?? profile?.last_active_workspace_id ?? undefined;

    return {
      profile: Boolean(profile),
      workspace: Boolean(workspaceId),
      membership: Boolean(membership),
      ready: Boolean(profile && membership && workspaceId),
      profileId: profile?.id,
      workspaceId,
      membershipId: membership?.id,
    };
  } catch {
    return EMPTY_BOOTSTRAP;
  }
});
