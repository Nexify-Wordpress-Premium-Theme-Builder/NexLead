"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function getBrowserSupabaseClient() {
  return createBrowserSupabaseClient();
}

export async function signOutClient() {
  const supabase = getBrowserSupabaseClient();
  await supabase.auth.signOut();
}

export async function ensureClientBootstrap() {
  const response = await fetch("/api/auth/bootstrap", { method: "POST" });
  return response.ok;
}
