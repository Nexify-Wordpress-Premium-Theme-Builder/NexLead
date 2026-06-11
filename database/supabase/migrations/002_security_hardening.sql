-- NexLead Security Hardening
-- Addresses Supabase advisor warnings:
--   0011 function_search_path_mutable (set_updated_at)
--   0028/0029 security_definer_function_executable (RLS helpers + auth trigger)

-- ---------------------------------------------------------------------------
-- 1. Pin search_path on set_updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- 2. Revoke public RPC access to SECURITY DEFINER helpers
--    (RLS policies still evaluate these via table-owner context)
-- ---------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public.is_workspace_member(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_workspace_member(UUID) FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.has_workspace_role(UUID, public.workspace_role[]) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_workspace_role(UUID, public.workspace_role[]) FROM anon, authenticated;

REVOKE ALL ON FUNCTION public.can_write_workspace(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.can_write_workspace(UUID) FROM anon, authenticated;

-- Trigger-only: not intended for PostgREST /rpc exposure
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Prevent future public-schema functions from inheriting broad EXECUTE
-- ---------------------------------------------------------------------------
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC, anon, authenticated;
