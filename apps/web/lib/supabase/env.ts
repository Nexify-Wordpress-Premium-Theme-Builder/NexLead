const SUPABASE_URL_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_ANON_KEY = "NEXT_PUBLIC_SUPABASE_ANON_KEY";

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value?.trim() || undefined;
}

export type WebSupabaseEnv = {
  url: string;
  anonKey: string;
};

export function isWebSupabaseConfigured(): boolean {
  return Boolean(readEnv(SUPABASE_URL_KEY) && readEnv(SUPABASE_ANON_KEY));
}

export function getWebSupabaseEnv(): WebSupabaseEnv {
  const url = readEnv(SUPABASE_URL_KEY);
  const anonKey = readEnv(SUPABASE_ANON_KEY);

  if (!url) {
    throw new Error(`Missing required environment variable: ${SUPABASE_URL_KEY}`);
  }

  if (!anonKey) {
    throw new Error(`Missing required environment variable: ${SUPABASE_ANON_KEY}`);
  }

  return { url, anonKey };
}
