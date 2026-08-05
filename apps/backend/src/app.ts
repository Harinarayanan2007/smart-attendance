import { sql } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ZodError } from "zod";
import { db } from "./database/client.js";
import batchRoutes from "./modules/batches/routes/batch.routes.js";
import departmentRoutes from "./modules/departments/routes/department.routes.js";
import dashboardRoutes from "./modules/dashboard/routes/dashboard.routes.js";
import authRoutes from "./modules/identity/auth/routes/auth.routes.js";
import userRoutes from "./modules/identity/users/routes/user.routes.js";
import programRoutes from "./modules/programs/routes/program.routes.js";
import { HttpException } from "./shared/exceptions/http.exception.js";

const app = new Hono();

/**
 * CORS — must be registered before all routes so that
 * preflight (OPTIONS) requests are handled correctly.
 */
app.use(
  "/*",
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
  }),
);

function isHttpException(error: unknown): error is HttpException {
  return (
    error instanceof Error &&
    "statusCode" in error &&
    "code" in error &&
    typeof (error as HttpException).statusCode === "number" &&
    typeof (error as HttpException).code === "string"
  );
}

function createErrorResponse(payload: {
  code: string;
  message: string;
  statusCode: number;
  details?: unknown;
}) {
  return {
    success: false,
    error: {
      code: payload.code,
      message: payload.message,
      ...(payload.details ? { details: payload.details } : {}),
    },
    timestamp: new Date().toISOString(),
  };
}

function isJsonParseError(error: unknown): error is SyntaxError {
  return (
    error instanceof SyntaxError &&
    /JSON|Unexpected end of JSON input|Unexpected token|Unexpected character/i.test(error.message)
  );
}

/**
 * Global Error Handler
 */
app.onError((err, c) => {
  const error = err as unknown;

  if (isHttpException(error)) {
    return c.json(createErrorResponse({
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    }), error.statusCode);
  }

  if (isJsonParseError(error)) {
    return c.json(createErrorResponse({
      code: "BAD_REQUEST",
      message: "Invalid JSON body.",
      statusCode: 400,
    }), 400);
  }

  if (error instanceof ZodError) {
    return c.json(createErrorResponse({
      code: "VALIDATION_ERROR",
      message: "Validation failed",
      statusCode: 400,
      details: error.flatten(),
    }), 400);
  }

  const message = error instanceof Error ? error.message : "Unknown error";

  console.error("Unhandled application error", { message });

  return c.json(createErrorResponse({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error.",
    statusCode: 500,
  }), 500);
});

/**
 * Routes
 */
app.route("/auth", authRoutes);
app.route("/users", userRoutes);
app.route("/batches", batchRoutes);
app.route("/departments", departmentRoutes);
app.route("/programs", programRoutes);
app.route("/dashboard", dashboardRoutes);

app.get("/", (c) => {
  return c.text("Smart Attendance API");
});

/**
 * Health Check
 */
app.get("/health", async (c) => {
  await db.execute(sql`SELECT 1`);

  return c.json({
    success: true,
    data: {
      database: "connected",
    },
    timestamp: new Date().toISOString(),
  });
});

export default app;
