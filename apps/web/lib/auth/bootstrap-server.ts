import type { BootstrapStatus } from "@nexlead/types";
import { cache } from "react";

import { getServerBootstrapStatus } from "./bootstrap";
import { getServerAccessToken } from "./session";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000";
}

const FALLBACK_BOOTSTRAP: BootstrapStatus = {
  profile: false,
  workspace: false,
  membership: false,
  ready: false,
};

export const ensureServerBootstrap = cache(async (userId: string): Promise<BootstrapStatus> => {
  try {
    const current = await getServerBootstrapStatus(userId);

    if (current.ready) {
      return current;
    }

    const accessToken = await getServerAccessToken();

    if (!accessToken) {
      return current;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/bootstrap`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return current;
      }
    } catch {
      // API kapalıyken dashboard UI çalışmaya devam etsin (Supabase verisi yeterli).
      return current;
    }

    return getServerBootstrapStatus(userId);
  } catch {
    return FALLBACK_BOOTSTRAP;
  }
});
