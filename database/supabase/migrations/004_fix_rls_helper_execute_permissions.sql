-- Fix RLS helper function execute permissions for authenticated users.
-- These helpers are used by RLS policies and must be executable by authenticated users.
-- They remain unavailable to anon users.

GRANT EXECUTE ON FUNCTION public.is_workspace_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_workspace_role(UUID, public.workspace_role[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_write_workspace(UUID) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_workspace_member(UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION public.has_workspace_role(UUID, public.workspace_role[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.can_write_workspace(UUID) FROM anon;

REVOKE EXECUTE ON FUNCTION public.is_workspace_member(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_workspace_role(UUID, public.workspace_role[]) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.can_write_workspace(UUID) FROM PUBLIC;
