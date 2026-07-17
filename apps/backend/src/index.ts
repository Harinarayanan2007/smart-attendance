import { serve } from "@hono/node-server";
import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

logger.info(`Starting ${env.NODE_ENV} server...`);

serve({
  fetch: app.fetch,
  port: env.PORT,
});

logger.info(`Server running at http://localhost:${env.PORT}`);
