import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@nexlead/types";

import { getWebSupabaseEnv } from "./env";

export async function createServerSupabaseClient() {
  const { url, anonKey } = getWebSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component read-only context — cookie writes are ignored.
        }
      },
    },
  });
}
