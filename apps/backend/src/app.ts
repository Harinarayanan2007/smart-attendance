import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Smart Attendance API");
});

export default app;
