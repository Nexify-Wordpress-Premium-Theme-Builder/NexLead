import { env } from "./env";

export const corsOptions = {
  origin: env.corsOrigin,
  credentials: true,
};
