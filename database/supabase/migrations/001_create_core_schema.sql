-- NexLead MVP Core Schema
-- Workspace, leads, websites, audits, reports, jobs, ai_usage_logs

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE public.workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE public.workspace_member_status AS ENUM ('active', 'invited', 'suspended', 'removed');
CREATE TYPE public.invite_status AS ENUM ('pending', 'accepted', 'expired', 'revoked');
CREATE TYPE public.lead_status AS ENUM (
  'new', 'enriched', 'qualified', 'contacted', 'replied',
  'meeting_scheduled', 'won', 'lost', 'archived'
);
CREATE TYPE public.lead_source_type AS ENUM ('manual', 'import', 'discovery', 'referral', 'inbound');
CREATE TYPE public.lead_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.website_status AS ENUM ('pending', 'active', 'unreachable', 'archived');
CREATE TYPE public.audit_status AS ENUM ('queued', 'running', 'completed', 'failed', 'cancelled');
CREATE TYPE public.audit_type AS ENUM ('full', 'quick', 'manual', 'scheduled');
CREATE TYPE public.finding_severity AS ENUM ('info', 'low', 'medium', 'high', 'critical');
CREATE TYPE public.finding_category AS ENUM (
  'performance', 'seo', 'accessibility', 'security', 'ux', 'content', 'technical'
);
CREATE TYPE public.report_status AS ENUM ('draft', 'generating', 'ready', 'sent', 'failed');
CREATE TYPE public.report_format AS ENUM ('html', 'pdf', 'markdown');
CREATE TYPE public.ai_operation_type AS ENUM (
  'lead_enrichment', 'audit_analysis', 'report_generation', 'email_compose', 'reply_classification'
);
CREATE TYPE public.job_type AS ENUM (
  'lead_discovery', 'website_audit', 'report_generation', 'outreach_send', 'inbox_sync'
);
CREATE TYPE public.job_status AS ENUM ('pending', 'running', 'completed', 'failed', 'retrying', 'cancelled');

-- ---------------------------------------------------------------------------
-- Shared trigger: updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Tables: workspace core
-- ---------------------------------------------------------------------------
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  industry TEXT,
  settings JSONB NOT NULL DEFAULT '{}'::JSONB,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'closed')),
  created_by UUID NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  locale TEXT NOT NULL DEFAULT 'tr',
  timezone TEXT NOT NULL DEFAULT 'Europe/Istanbul',
  onboarding_completed_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ,
  last_active_workspace_id UUID REFERENCES public.workspaces (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role public.workspace_role NOT NULL DEFAULT 'member',
  status public.workspace_member_status NOT NULL DEFAULT 'active',
  invited_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (workspace_id, user_id)
);

CREATE TABLE public.workspace_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role public.workspace_role NOT NULL DEFAULT 'member',
  status public.invite_status NOT NULL DEFAULT 'pending',
  token_hash TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Tables: infrastructure (referenced by audits / reports)
-- ---------------------------------------------------------------------------
CREATE TABLE public.job_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  type public.job_type NOT NULL,
  status public.job_status NOT NULL DEFAULT 'pending',
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  result JSONB,
  error_message TEXT,
  retry_count INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  reference_type TEXT,
  reference_id UUID,
  scheduled_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  operation_type public.ai_operation_type NOT NULL,
  model TEXT NOT NULL,
  provider TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost_cents INTEGER,
  latency_ms INTEGER,
  reference_type TEXT,
  reference_id UUID,
  job_run_id UUID REFERENCES public.job_runs (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failed')),
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Tables: leads
-- ---------------------------------------------------------------------------
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  industry TEXT,
  location TEXT,
  status public.lead_status NOT NULL DEFAULT 'new',
  priority public.lead_priority NOT NULL DEFAULT 'medium',
  score INTEGER NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  score_breakdown JSONB NOT NULL DEFAULT '{}'::JSONB,
  source_type public.lead_source_type NOT NULL DEFAULT 'manual',
  assigned_to UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  notes_summary TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  last_contacted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads (id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE RESTRICT,
  body TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Tables: websites & audits
-- ---------------------------------------------------------------------------
CREATE TABLE public.websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads (id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  normalized_url TEXT NOT NULL,
  domain TEXT NOT NULL,
  title TEXT,
  description TEXT,
  favicon_url TEXT,
  status public.website_status NOT NULL DEFAULT 'pending',
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  last_audited_at TIMESTAMPTZ,
  last_audit_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE TABLE public.audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  website_id UUID NOT NULL REFERENCES public.websites (id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads (id) ON DELETE SET NULL,
  type public.audit_type NOT NULL DEFAULT 'full',
  status public.audit_status NOT NULL DEFAULT 'queued',
  overall_score INTEGER CHECK (overall_score IS NULL OR (overall_score BETWEEN 0 AND 100)),
  score_breakdown JSONB,
  pages_crawled INTEGER,
  duration_ms INTEGER,
  error_message TEXT,
  job_run_id UUID REFERENCES public.job_runs (id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.websites
  ADD CONSTRAINT websites_last_audit_id_fkey
  FOREIGN KEY (last_audit_id) REFERENCES public.audits (id) ON DELETE SET NULL;

CREATE TABLE public.audit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  audit_id UUID NOT NULL REFERENCES public.audits (id) ON DELETE CASCADE,
  category public.finding_category NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  weight NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (audit_id, category)
);

CREATE TABLE public.audit_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  audit_id UUID NOT NULL REFERENCES public.audits (id) ON DELETE CASCADE,
  category public.finding_category NOT NULL,
  severity public.finding_severity NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendation TEXT,
  affected_url TEXT,
  evidence JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Tables: reports
-- ---------------------------------------------------------------------------
CREATE TABLE public.audit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces (id) ON DELETE CASCADE,
  audit_id UUID NOT NULL REFERENCES public.audits (id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads (id) ON DELETE SET NULL,
  website_id UUID REFERENCES public.websites (id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status public.report_status NOT NULL DEFAULT 'draft',
  format public.report_format NOT NULL DEFAULT 'html',
  language TEXT NOT NULL DEFAULT 'tr',
  summary TEXT,
  content_storage_path TEXT,
  pdf_storage_path TEXT,
  share_token TEXT,
  share_expires_at TIMESTAMPTZ,
  generated_by_ai BOOLEAN NOT NULL DEFAULT TRUE,
  ai_usage_log_id UUID REFERENCES public.ai_usage_logs (id) ON DELETE SET NULL,
  job_run_id UUID REFERENCES public.job_runs (id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.report_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.audit_reports (id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  section_type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
CREATE TRIGGER set_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_workspace_members_updated_at
  BEFORE UPDATE ON public.workspace_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_job_runs_updated_at
  BEFORE UPDATE ON public.job_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_lead_notes_updated_at
  BEFORE UPDATE ON public.lead_notes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_websites_updated_at
  BEFORE UPDATE ON public.websites
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_audits_updated_at
  BEFORE UPDATE ON public.audits
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_audit_reports_updated_at
  BEFORE UPDATE ON public.audit_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth: auto-create profile on signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS helper functions
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = ws_id
      AND wm.user_id = auth.uid()
      AND wm.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_role(ws_id UUID, roles public.workspace_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = ws_id
      AND wm.user_id = auth.uid()
      AND wm.status = 'active'
      AND wm.role = ANY (roles)
  );
$$;

CREATE OR REPLACE FUNCTION public.can_write_workspace(ws_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_workspace_role(
    ws_id,
    ARRAY['owner', 'admin', 'member']::public.workspace_role[]
  );
$$;

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX idx_workspaces_status_active ON public.workspaces (status) WHERE deleted_at IS NULL;

CREATE INDEX idx_workspace_members_user_id ON public.workspace_members (user_id);
CREATE INDEX idx_workspace_members_workspace_status ON public.workspace_members (workspace_id, status);

CREATE INDEX idx_workspace_invites_workspace_email_status ON public.workspace_invites (workspace_id, email, status);
CREATE INDEX idx_workspace_invites_token_hash ON public.workspace_invites (token_hash);

CREATE INDEX idx_leads_workspace_status ON public.leads (workspace_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_workspace_score ON public.leads (workspace_id, score DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_workspace_assigned ON public.leads (workspace_id, assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_workspace_created ON public.leads (workspace_id, created_at DESC);

CREATE INDEX idx_lead_notes_lead_created ON public.lead_notes (lead_id, created_at DESC);

CREATE UNIQUE INDEX idx_websites_workspace_normalized_url
  ON public.websites (workspace_id, normalized_url)
  WHERE deleted_at IS NULL;
CREATE INDEX idx_websites_workspace_lead ON public.websites (workspace_id, lead_id);
CREATE INDEX idx_websites_workspace_domain ON public.websites (workspace_id, domain);

CREATE INDEX idx_audits_workspace_website_created ON public.audits (workspace_id, website_id, created_at DESC);
CREATE INDEX idx_audits_workspace_status ON public.audits (workspace_id, status);

CREATE INDEX idx_audit_scores_audit_id ON public.audit_scores (audit_id);
CREATE INDEX idx_audit_findings_audit_severity ON public.audit_findings (audit_id, severity);
CREATE INDEX idx_audit_findings_workspace_category ON public.audit_findings (workspace_id, category);

CREATE INDEX idx_audit_reports_workspace_lead_created ON public.audit_reports (workspace_id, lead_id, created_at DESC);
CREATE INDEX idx_audit_reports_audit_id ON public.audit_reports (audit_id);
CREATE UNIQUE INDEX idx_audit_reports_share_token ON public.audit_reports (share_token) WHERE share_token IS NOT NULL;

CREATE INDEX idx_report_sections_report_order ON public.report_sections (report_id, order_index);

CREATE INDEX idx_job_runs_workspace_status_scheduled ON public.job_runs (workspace_id, status, scheduled_at);
CREATE INDEX idx_job_runs_reference ON public.job_runs (reference_type, reference_id);

CREATE INDEX idx_ai_usage_logs_workspace_created ON public.ai_usage_logs (workspace_id, created_at DESC);
CREATE INDEX idx_ai_usage_logs_workspace_operation ON public.ai_usage_logs (workspace_id, operation_type, created_at);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_sections ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY profiles_select_workspace_peers ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.workspace_members wm_self
      JOIN public.workspace_members wm_peer ON wm_peer.workspace_id = wm_self.workspace_id
      WHERE wm_self.user_id = auth.uid()
        AND wm_self.status = 'active'
        AND wm_peer.user_id = profiles.id
        AND wm_peer.status = 'active'
    )
  );

CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- workspaces
CREATE POLICY workspaces_select_creator ON public.workspaces
  FOR SELECT TO authenticated
  USING (created_by = auth.uid() AND deleted_at IS NULL);

CREATE POLICY workspaces_select_member ON public.workspaces
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(id) AND deleted_at IS NULL);

CREATE POLICY workspaces_insert_authenticated ON public.workspaces
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY workspaces_update_admin ON public.workspaces
  FOR UPDATE TO authenticated
  USING (public.has_workspace_role(id, ARRAY['owner', 'admin']::public.workspace_role[]))
  WITH CHECK (public.has_workspace_role(id, ARRAY['owner', 'admin']::public.workspace_role[]));

-- workspace_members
CREATE POLICY workspace_members_select_self ON public.workspace_members
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY workspace_members_select ON public.workspace_members
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY workspace_members_insert ON public.workspace_members
  FOR INSERT TO authenticated
  WITH CHECK (
    (user_id = auth.uid() AND role = 'owner')
    OR public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']::public.workspace_role[])
  );

CREATE POLICY workspace_members_update_admin ON public.workspace_members
  FOR UPDATE TO authenticated
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']::public.workspace_role[]))
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']::public.workspace_role[]));

CREATE POLICY workspace_members_delete_owner ON public.workspace_members
  FOR DELETE TO authenticated
  USING (public.has_workspace_role(workspace_id, ARRAY['owner']::public.workspace_role[]));

-- workspace_invites
CREATE POLICY workspace_invites_select_admin ON public.workspace_invites
  FOR SELECT TO authenticated
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']::public.workspace_role[]));

CREATE POLICY workspace_invites_insert_admin ON public.workspace_invites
  FOR INSERT TO authenticated
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']::public.workspace_role[]));

CREATE POLICY workspace_invites_update_admin ON public.workspace_invites
  FOR UPDATE TO authenticated
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']::public.workspace_role[]))
  WITH CHECK (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']::public.workspace_role[]));

CREATE POLICY workspace_invites_delete_admin ON public.workspace_invites
  FOR DELETE TO authenticated
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']::public.workspace_role[]));

-- job_runs (read for members; writes via service role)
CREATE POLICY job_runs_select_member ON public.job_runs
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));

-- ai_usage_logs (read for admin+; writes via service role)
CREATE POLICY ai_usage_logs_select_admin ON public.ai_usage_logs
  FOR SELECT TO authenticated
  USING (public.has_workspace_role(workspace_id, ARRAY['owner', 'admin']::public.workspace_role[]));

-- leads
CREATE POLICY leads_select_member ON public.leads
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id) AND deleted_at IS NULL);

CREATE POLICY leads_insert_writer ON public.leads
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write_workspace(workspace_id));

CREATE POLICY leads_update_writer ON public.leads
  FOR UPDATE TO authenticated
  USING (public.can_write_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.can_write_workspace(workspace_id));

-- lead_notes
CREATE POLICY lead_notes_select_member ON public.lead_notes
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY lead_notes_insert_writer ON public.lead_notes
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write_workspace(workspace_id) AND author_id = auth.uid());

CREATE POLICY lead_notes_update_writer ON public.lead_notes
  FOR UPDATE TO authenticated
  USING (public.can_write_workspace(workspace_id))
  WITH CHECK (public.can_write_workspace(workspace_id));

CREATE POLICY lead_notes_delete_writer ON public.lead_notes
  FOR DELETE TO authenticated
  USING (public.can_write_workspace(workspace_id));

-- websites
CREATE POLICY websites_select_member ON public.websites
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id) AND deleted_at IS NULL);

CREATE POLICY websites_insert_writer ON public.websites
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write_workspace(workspace_id));

CREATE POLICY websites_update_writer ON public.websites
  FOR UPDATE TO authenticated
  USING (public.can_write_workspace(workspace_id) AND deleted_at IS NULL)
  WITH CHECK (public.can_write_workspace(workspace_id));

-- audits
CREATE POLICY audits_select_member ON public.audits
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY audits_insert_writer ON public.audits
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write_workspace(workspace_id));

CREATE POLICY audits_update_running ON public.audits
  FOR UPDATE TO authenticated
  USING (
    public.can_write_workspace(workspace_id)
    AND status IN ('queued', 'running')
  )
  WITH CHECK (public.can_write_workspace(workspace_id));

-- audit_scores & audit_findings (read only for clients)
CREATE POLICY audit_scores_select_member ON public.audit_scores
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY audit_findings_select_member ON public.audit_findings
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));

-- audit_reports
CREATE POLICY audit_reports_select_member ON public.audit_reports
  FOR SELECT TO authenticated
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY audit_reports_insert_writer ON public.audit_reports
  FOR INSERT TO authenticated
  WITH CHECK (public.can_write_workspace(workspace_id));

CREATE POLICY audit_reports_update_writer ON public.audit_reports
  FOR UPDATE TO authenticated
  USING (public.can_write_workspace(workspace_id))
  WITH CHECK (public.can_write_workspace(workspace_id));

-- report_sections (via parent report workspace)
CREATE POLICY report_sections_select_member ON public.report_sections
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.audit_reports ar
      WHERE ar.id = report_sections.report_id
        AND public.is_workspace_member(ar.workspace_id)
    )
  );

CREATE POLICY report_sections_insert_writer ON public.report_sections
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.audit_reports ar
      WHERE ar.id = report_sections.report_id
        AND public.can_write_workspace(ar.workspace_id)
    )
  );

CREATE POLICY report_sections_update_writer ON public.report_sections
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.audit_reports ar
      WHERE ar.id = report_sections.report_id
        AND public.can_write_workspace(ar.workspace_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.audit_reports ar
      WHERE ar.id = report_sections.report_id
        AND public.can_write_workspace(ar.workspace_id)
    )
  );

CREATE POLICY report_sections_delete_writer ON public.report_sections
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.audit_reports ar
      WHERE ar.id = report_sections.report_id
        AND public.can_write_workspace(ar.workspace_id)
    )
  );
