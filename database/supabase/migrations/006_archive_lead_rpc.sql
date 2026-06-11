-- Workspace-scoped lead archive via SECURITY DEFINER (soft delete).
-- Authenticated clients cannot set deleted_at directly under current RLS evaluation.

CREATE OR REPLACE FUNCTION public.archive_lead(target_lead_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.leads
  SET
    deleted_at = NOW(),
    status = 'archived',
    updated_at = NOW()
  WHERE id = target_lead_id
    AND deleted_at IS NULL
    AND public.can_write_workspace(workspace_id);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead not found or not allowed';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.archive_lead(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.archive_lead(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.archive_lead(UUID) TO authenticated;
