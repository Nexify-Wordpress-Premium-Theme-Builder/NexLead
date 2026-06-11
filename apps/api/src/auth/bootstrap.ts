import type { BootstrapStatus, EnsureBootstrapResult } from "./types";
import { createAdminSupabaseClient } from "../supabase/admin-client";
import { createUserSupabaseClient } from "../supabase/user-client";
import { isApiSupabaseAdminConfigured } from "../supabase/env";

export async function getBootstrapStatus(
  accessToken: string,
  userId: string,
): Promise<BootstrapStatus> {
  const supabase = createUserSupabaseClient(accessToken);

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

  const status: BootstrapStatus = {
    profile: Boolean(profile),
    workspace: Boolean(workspaceId),
    membership: Boolean(membership),
    ready: Boolean(profile && membership && workspaceId),
    profileId: profile?.id,
    workspaceId,
    membershipId: membership?.id,
  };

  return status;
}

export async function ensureUserBootstrap(userId: string): Promise<EnsureBootstrapResult> {
  if (!isApiSupabaseAdminConfigured()) {
    throw new Error("Supabase admin client is not configured");
  }

  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.rpc("ensure_user_bootstrap", {
    target_user_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error("Invalid bootstrap response");
  }

  const result = data as Record<string, unknown>;

  return {
    user_id: String(result.user_id),
    profile: Boolean(result.profile),
    workspace_id: result.workspace_id ? String(result.workspace_id) : null,
    membership: Boolean(result.membership),
    ready: Boolean(result.ready),
  };
}
