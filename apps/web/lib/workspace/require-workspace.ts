import { cache } from "react";

import { getServerAuthSessionUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type WorkspaceContext = {
  userId: string;
  workspaceId: string;
  workspaceName: string | null;
};

export const requireWorkspace = cache(async (): Promise<WorkspaceContext | null> => {
  const user = await getServerAuthSessionUser();

  if (!user) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  const [profileResult, membershipResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("last_active_workspace_id")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("role", "owner")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  const workspaceId =
    profileResult.data?.last_active_workspace_id ?? membershipResult.data?.workspace_id ?? null;

  if (!workspaceId) {
    return null;
  }

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("name")
    .eq("id", workspaceId)
    .is("deleted_at", null)
    .maybeSingle();

  return {
    userId: user.id,
    workspaceId,
    workspaceName: workspace?.name ?? null,
  };
});
