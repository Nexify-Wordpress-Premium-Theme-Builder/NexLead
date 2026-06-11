-- NexLead Auth Workspace Bootstrap
-- Extends signup trigger: profile + default workspace + owner membership

-- ---------------------------------------------------------------------------
-- Slug helper (trigger/internal use only)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_workspace_slug(base_name TEXT, user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  slug_base TEXT;
  candidate TEXT;
  suffix INTEGER := 0;
BEGIN
  slug_base := lower(regexp_replace(COALESCE(NULLIF(trim(base_name), ''), 'workspace'), '[^a-zA-Z0-9]+', '-', 'g'));
  slug_base := trim(BOTH '-' FROM slug_base);

  IF slug_base = '' THEN
    slug_base := 'workspace';
  END IF;

  candidate := slug_base || '-' || left(replace(user_id::TEXT, '-', ''), 8);

  WHILE EXISTS (
    SELECT 1
    FROM public.workspaces w
    WHERE w.slug = candidate
      AND w.deleted_at IS NULL
  ) LOOP
    suffix := suffix + 1;
    candidate := slug_base || '-' || left(replace(user_id::TEXT, '-', ''), 8) || '-' || suffix;
  END LOOP;

  RETURN candidate;
END;
$$;

REVOKE ALL ON FUNCTION public.generate_workspace_slug(TEXT, UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_workspace_slug(TEXT, UUID) FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- Idempotent workspace bootstrap for a user
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.bootstrap_user_workspace(
  p_user_id UUID,
  p_email TEXT,
  p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_workspace_id UUID;
  v_full_name TEXT;
  v_workspace_name TEXT;
  v_workspace_slug TEXT;
  v_existing_workspace_id UUID;
BEGIN
  SELECT wm.workspace_id
  INTO v_existing_workspace_id
  FROM public.workspace_members wm
  WHERE wm.user_id = p_user_id
    AND wm.role = 'owner'
    AND wm.status = 'active'
  ORDER BY wm.created_at ASC
  LIMIT 1;

  IF v_existing_workspace_id IS NOT NULL THEN
    UPDATE public.profiles
    SET last_active_workspace_id = COALESCE(last_active_workspace_id, v_existing_workspace_id)
    WHERE id = p_user_id;

    RETURN v_existing_workspace_id;
  END IF;

  v_full_name := COALESCE(
    NULLIF(trim(p_metadata ->> 'full_name'), ''),
    NULLIF(trim(p_metadata ->> 'name'), '')
  );

  v_workspace_name := COALESCE(
    NULLIF(trim(p_metadata ->> 'workspace_name'), ''),
    CASE
      WHEN v_full_name IS NOT NULL THEN v_full_name || ' Çalışma Alanı'
      ELSE initcap(split_part(COALESCE(p_email, 'user'), '@', 1)) || ' Çalışma Alanı'
    END
  );

  v_workspace_slug := public.generate_workspace_slug(v_workspace_name, p_user_id);

  INSERT INTO public.workspaces (name, slug, created_by)
  VALUES (v_workspace_name, v_workspace_slug, p_user_id)
  RETURNING id INTO v_workspace_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role, status, joined_at)
  VALUES (v_workspace_id, p_user_id, 'owner', 'active', NOW())
  ON CONFLICT (workspace_id, user_id) DO UPDATE
    SET role = EXCLUDED.role,
        status = EXCLUDED.status,
        joined_at = COALESCE(public.workspace_members.joined_at, EXCLUDED.joined_at);

  UPDATE public.profiles
  SET last_active_workspace_id = v_workspace_id
  WHERE id = p_user_id
    AND last_active_workspace_id IS NULL;

  RETURN v_workspace_id;
END;
$$;

REVOKE ALL ON FUNCTION public.bootstrap_user_workspace(UUID, TEXT, JSONB) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.bootstrap_user_workspace(UUID, TEXT, JSONB) FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- Service-role repair entrypoint
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.ensure_user_bootstrap(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auth_user auth.users%ROWTYPE;
  v_workspace_id UUID;
  v_profile_exists BOOLEAN;
  v_membership_exists BOOLEAN;
BEGIN
  SELECT *
  INTO v_auth_user
  FROM auth.users u
  WHERE u.id = target_user_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', target_user_id;
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    v_auth_user.id,
    COALESCE(
      NULLIF(trim(v_auth_user.raw_user_meta_data ->> 'full_name'), ''),
      NULLIF(trim(v_auth_user.raw_user_meta_data ->> 'name'), '')
    ),
    v_auth_user.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  v_workspace_id := public.bootstrap_user_workspace(
    v_auth_user.id,
    v_auth_user.email,
    COALESCE(v_auth_user.raw_user_meta_data, '{}'::JSONB)
  );

  SELECT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = target_user_id
  ) INTO v_profile_exists;

  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.user_id = target_user_id
      AND wm.role = 'owner'
      AND wm.status = 'active'
  ) INTO v_membership_exists;

  RETURN jsonb_build_object(
    'user_id', target_user_id,
    'profile', v_profile_exists,
    'workspace_id', v_workspace_id,
    'membership', v_membership_exists,
    'ready', v_profile_exists AND v_membership_exists AND v_workspace_id IS NOT NULL
  );
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_user_bootstrap(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.ensure_user_bootstrap(UUID) FROM anon, authenticated;

-- ---------------------------------------------------------------------------
-- Auth signup trigger: profile + workspace bootstrap
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
    COALESCE(
      NULLIF(trim(NEW.raw_user_meta_data ->> 'full_name'), ''),
      NULLIF(trim(NEW.raw_user_meta_data ->> 'name'), '')
    ),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  PERFORM public.bootstrap_user_workspace(
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data, '{}'::JSONB)
  );

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
