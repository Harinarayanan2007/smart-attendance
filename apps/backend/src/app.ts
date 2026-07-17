import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "./database/client.js";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Smart Attendance API");
});

app.get("/health", async (c) => {
  await db.execute(sql`SELECT 1`);

  return c.json({
    success: true,
    database: "connected",
  });
});

export default app;
