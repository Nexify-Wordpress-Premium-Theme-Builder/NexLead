import { isWebSupabaseConfigured } from "./env";
import { createServerSupabaseClient } from "./server";

export type SupabaseHealthStatus = "ok" | "skipped" | "error";

export type SupabaseHealthCheck = {
  status: SupabaseHealthStatus;
  message?: string;
};

export async function checkWebSupabaseConnection(): Promise<SupabaseHealthCheck> {
  if (!isWebSupabaseConfigured()) {
    return {
      status: "skipped",
      message: "Supabase environment variables are not configured",
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.getSession();

    if (error) {
      return { status: "error", message: error.message };
    }

    return { status: "ok" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase error";
    return { status: "error", message };
  }
}
