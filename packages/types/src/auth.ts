import type { Tables } from "./database.js";

export type Profile = Tables<"profiles">;
export type Workspace = Tables<"workspaces">;
export type WorkspaceMember = Tables<"workspace_members">;

export type AuthSessionUser = {
  id: string;
  email: string | null;
};

export type BootstrapStatus = {
  profile: boolean;
  workspace: boolean;
  membership: boolean;
  ready: boolean;
  profileId?: string;
  workspaceId?: string;
  membershipId?: string;
};

export type EnsureBootstrapResult = {
  user_id: string;
  profile: boolean;
  workspace_id: string | null;
  membership: boolean;
  ready: boolean;
};
