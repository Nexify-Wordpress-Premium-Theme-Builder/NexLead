import type { BootstrapStatus } from "@nexlead/types";

import { getServerBootstrapStatus } from "./bootstrap";
import { getServerAccessToken } from "./session";

function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:4000";
}

export async function ensureServerBootstrap(userId: string): Promise<BootstrapStatus> {
  const current = await getServerBootstrapStatus(userId);

  if (current.ready) {
    return current;
  }

  const accessToken = await getServerAccessToken();

  if (!accessToken) {
    return current;
  }

  await fetch(`${getApiBaseUrl()}/auth/bootstrap`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return getServerBootstrapStatus(userId);
}
