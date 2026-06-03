CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  company_name VARCHAR(255) NOT NULL,
  website VARCHAR(500),
  industry VARCHAR(120),
  location VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  opportunity_score INTEGER NOT NULL DEFAULT 0,
  website_status VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
