import type { IncomingMessage, ServerResponse } from "node:http";

export function getBearerToken(req: IncomingMessage): string | null {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

export function getPathname(req: IncomingMessage): string {
  return new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`).pathname;
}

export function sendJson(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}
