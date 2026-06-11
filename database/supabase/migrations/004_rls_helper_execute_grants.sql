-- NexLead RLS Helper Execute Grants
-- Fixes: permission denied for function is_workspace_member
--
-- Migration 002 revoked EXECUTE from authenticated on RLS helper functions.
-- PostgreSQL still requires the invoking role to have EXECUTE when those
-- functions appear in RLS policy expressions. Keep anon/PUBLIC revoked.

GRANT EXECUTE ON FUNCTION public.is_workspace_member(UUID) TO authenticated;

GRANT EXECUTE ON FUNCTION public.has_workspace_role(UUID, public.workspace_role[]) TO authenticated;

GRANT EXECUTE ON FUNCTION public.can_write_workspace(UUID) TO authenticated;
