-- Workspace-scoped website archive via SECURITY DEFINER (soft delete).

CREATE OR REPLACE FUNCTION public.archive_website(target_website_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  UPDATE public.websites
  SET
    deleted_at = NOW(),
    status = 'archived',
    updated_at = NOW()
  WHERE id = target_website_id
    AND deleted_at IS NULL
    AND public.can_write_workspace(workspace_id);

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Website not found or not allowed';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.archive_website(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.archive_website(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.archive_website(UUID) TO authenticated;
