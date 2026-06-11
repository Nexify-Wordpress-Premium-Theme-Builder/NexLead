import http from "node:http";

import {
  getPathname,
  handleAuthBootstrapGet,
  handleAuthBootstrapPost,
  handleAuthSession,
} from "./auth";
import { isJobWorkerConfigured } from "./config/job-worker-env";
import { handleProcessNextAuditJob } from "./modules/audits";
import { checkApiSupabaseConnections } from "./supabase";

async function buildHealthPayload() {
  const supabase = await checkApiSupabaseConnections();

  return {
    status: "ok",
    service: "api",
    checks: {
      supabase,
      auditWorker: isJobWorkerConfigured() ? "configured" : "not_configured",
    },
  };
}

export function createApp(): http.Server {
  return http.createServer((req, res) => {
    const pathname = getPathname(req);

    if (pathname === "/auth/session" && req.method === "GET") {
      void handleAuthSession(req, res);
      return;
    }

    if (pathname === "/auth/bootstrap" && req.method === "GET") {
      void handleAuthBootstrapGet(req, res);
      return;
    }

    if (pathname === "/auth/bootstrap" && req.method === "POST") {
      void handleAuthBootstrapPost(req, res);
      return;
    }

    if (pathname === "/jobs/audits/process-next" && req.method === "POST") {
      void handleProcessNextAuditJob(req, res);
      return;
    }

    if (pathname === "/health" && req.method === "GET") {
      void buildHealthPayload()
        .then((payload) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(payload));
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : "Health check failed";
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", service: "api", message }));
        });
      return;
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  });
}
