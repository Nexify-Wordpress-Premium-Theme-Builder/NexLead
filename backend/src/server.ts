import { createApp } from "./app";
import { env } from "./config/env";

export function startServer() {
  const app = createApp();
  // Placeholder: HTTP server bootstrap will be implemented in a later phase.
  return { app, port: env.port };
}

if (require.main === module) {
  startServer();
}
