const SUPABASE_URL_KEY = "SUPABASE_URL";
const SUPABASE_ANON_KEY = "SUPABASE_ANON_KEY";
const SUPABASE_SERVICE_ROLE_KEY = "SUPABASE_SERVICE_ROLE_KEY";

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  return value?.trim() || undefined;
}

export type ApiSupabaseEnv = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
};

export function isApiSupabaseAnonConfigured(): boolean {
  return Boolean(readEnv(SUPABASE_URL_KEY) && readEnv(SUPABASE_ANON_KEY));
}

export function isApiSupabaseAdminConfigured(): boolean {
  return Boolean(readEnv(SUPABASE_URL_KEY) && readEnv(SUPABASE_SERVICE_ROLE_KEY));
}

export function getApiSupabaseAnonEnv(): { url: string; anonKey: string } {
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

export function getApiSupabaseAdminEnv(): { url: string; serviceRoleKey: string } {
  const url = readEnv(SUPABASE_URL_KEY);
  const serviceRoleKey = readEnv(SUPABASE_SERVICE_ROLE_KEY);

  if (!url) {
    throw new Error(`Missing required environment variable: ${SUPABASE_URL_KEY}`);
  }

  if (!serviceRoleKey) {
    throw new Error(`Missing required environment variable: ${SUPABASE_SERVICE_ROLE_KEY}`);
  }

  return { url, serviceRoleKey };
}
