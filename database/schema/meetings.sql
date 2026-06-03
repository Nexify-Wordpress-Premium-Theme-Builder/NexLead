CREATE TABLE IF NOT EXISTS pipeline_stages (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  label VARCHAR(100) NOT NULL,
  status_key VARCHAR(50) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id),
  title VARCHAR(255) NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  attendee_name VARCHAR(255) NOT NULL,
  attendee_email VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
