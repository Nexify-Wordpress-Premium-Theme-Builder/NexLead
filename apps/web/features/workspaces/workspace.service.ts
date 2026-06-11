import { createServerSupabaseClient } from "@/lib/supabase/server";
import { requireWorkspace } from "@/lib/workspace/require-workspace";

export type ActiveWorkspace = {
  id: string;
  name: string;
};

export async function getActiveWorkspace(): Promise<ActiveWorkspace | null> {
  const context = await requireWorkspace();

  if (!context) {
    return null;
  }

  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("workspaces")
    .select("id, name")
    .eq("id", context.workspaceId)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
  };
}
