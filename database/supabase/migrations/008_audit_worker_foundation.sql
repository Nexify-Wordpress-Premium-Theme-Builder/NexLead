-- Audit worker foundation:
-- Prevents multiple active audits for the same website.
-- Active audits are queued or running.
-- Historical completed/failed/cancelled audits are preserved.

-- Cancel older duplicate active audits; keep the newest per website.
WITH ranked_active AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY website_id
      ORDER BY created_at DESC, id DESC
    ) AS rn
  FROM public.audits
  WHERE status IN ('queued', 'running')
)
UPDATE public.audits AS a
SET
  status = 'cancelled',
  error_message = COALESCE(
    NULLIF(TRIM(a.error_message), ''),
    'Duplicate active audit cleanup during migration 008.'
  ),
  updated_at = NOW()
FROM ranked_active AS r
WHERE a.id = r.id
  AND r.rn > 1;

CREATE UNIQUE INDEX IF NOT EXISTS audits_one_active_per_website_idx
  ON public.audits (website_id)
  WHERE status IN ('queued', 'running');
