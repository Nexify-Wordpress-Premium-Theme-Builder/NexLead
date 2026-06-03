import { registerRoutes } from "./routes";

export function createApp() {
  return {
    routes: registerRoutes(),
  };
}
