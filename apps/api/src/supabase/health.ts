import { createAdminSupabaseClient } from "./admin-client";
import { createAnonSupabaseClient } from "./anon-client";
import { isApiSupabaseAdminConfigured, isApiSupabaseAnonConfigured } from "./env";

export type SupabaseHealthStatus = "ok" | "skipped" | "error";

export type SupabaseHealthCheck = {
  status: SupabaseHealthStatus;
  message?: string;
};

export type ApiSupabaseHealthChecks = {
  anon: SupabaseHealthCheck;
  admin: SupabaseHealthCheck;
};

export async function checkApiSupabaseConnections(): Promise<ApiSupabaseHealthChecks> {
  const [anon, admin] = await Promise.all([
    checkAnonSupabaseConnection(),
    checkAdminSupabaseConnection(),
  ]);

  return { anon, admin };
}

async function checkAnonSupabaseConnection(): Promise<SupabaseHealthCheck> {
  if (!isApiSupabaseAnonConfigured()) {
    return {
      status: "skipped",
      message: "Supabase anon environment variables are not configured",
    };
  }

  try {
    const supabase = createAnonSupabaseClient();
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

async function checkAdminSupabaseConnection(): Promise<SupabaseHealthCheck> {
  if (!isApiSupabaseAdminConfigured()) {
    return {
      status: "skipped",
      message: "Supabase service role environment variables are not configured",
    };
  }

  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase.from("workspaces").select("id").limit(1);

    if (error) {
      return { status: "error", message: error.message };
    }

    return { status: "ok" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Supabase error";
    return { status: "error", message };
  }
}
