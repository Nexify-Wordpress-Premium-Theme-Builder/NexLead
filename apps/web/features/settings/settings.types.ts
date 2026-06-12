export type SettingsProfile = {
  fullName: string | null;
  email: string;
  locale: string;
  timezone: string;
};

export type SettingsWorkspace = {
  name: string | null;
  role: string | null;
  memberStatus: string | null;
  createdAt: string | null;
};

export type SettingsPageData = {
  profile: SettingsProfile;
  workspace: SettingsWorkspace;
};
