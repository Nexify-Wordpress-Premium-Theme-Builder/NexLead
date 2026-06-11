import type { IncomingMessage, ServerResponse } from "node:http";

import { ensureUserBootstrap, getBootstrapStatus } from "./bootstrap";
import { getBearerToken, sendJson } from "./http";
import { getAuthSessionUser } from "./session";

export async function handleAuthSession(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const accessToken = getBearerToken(req);

  if (!accessToken) {
    sendJson(res, 401, { error: "Missing bearer token" });
    return;
  }

  const user = await getAuthSessionUser(accessToken);

  if (!user) {
    sendJson(res, 401, { error: "Invalid or expired session" });
    return;
  }

  sendJson(res, 200, { user });
}

export async function handleAuthBootstrapGet(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const accessToken = getBearerToken(req);

  if (!accessToken) {
    sendJson(res, 401, { error: "Missing bearer token" });
    return;
  }

  const user = await getAuthSessionUser(accessToken);

  if (!user) {
    sendJson(res, 401, { error: "Invalid or expired session" });
    return;
  }

  const bootstrap = await getBootstrapStatus(accessToken, user.id);
  sendJson(res, 200, { user, bootstrap });
}

export async function handleAuthBootstrapPost(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const accessToken = getBearerToken(req);

  if (!accessToken) {
    sendJson(res, 401, { error: "Missing bearer token" });
    return;
  }

  const user = await getAuthSessionUser(accessToken);

  if (!user) {
    sendJson(res, 401, { error: "Invalid or expired session" });
    return;
  }

  try {
    const result = await ensureUserBootstrap(user.id);
    const bootstrap = await getBootstrapStatus(accessToken, user.id);
    sendJson(res, 200, { user, bootstrap, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bootstrap failed";
    sendJson(res, 500, { error: message });
  }
}
