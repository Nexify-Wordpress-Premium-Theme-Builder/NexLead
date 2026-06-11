-- Allow workspace writers to soft-delete leads by setting deleted_at.
-- The existing leads_update_writer policy blocks rows that fail implicit checks
-- when deleted_at transitions from NULL to NOT NULL.

CREATE POLICY leads_soft_delete ON public.leads
  FOR UPDATE TO authenticated
  USING (public.can_write_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.can_write_workspace(workspace_id) AND deleted_at IS NOT NULL);
