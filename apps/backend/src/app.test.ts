import assert from "node:assert/strict";
import test from "node:test";
import { z } from "zod";

import app from "./app.js";
import { AcademicYearService } from "./modules/academic-years/services/academic-year.service.js";
import { BadRequestException } from "./shared/exceptions/bad-request.exception.js";
import { ConflictException } from "./shared/exceptions/conflict.exception.js";
import { ForbiddenException } from "./shared/exceptions/forbidden.exception.js";
import { NotFoundException } from "./shared/exceptions/not-found.exception.js";
import { UnauthorizedException } from "./shared/exceptions/unauthorized.exception.js";

app.get("/__test-bad-request", () => {
    throw new BadRequestException("Inactive academic years cannot be set as current.");
});

app.get("/__test-conflict", () => {
    throw new ConflictException("Academic year already exists.");
});

app.get("/__test-not-found", () => {
    throw new NotFoundException("Department not found.");
});

app.get("/__test-unauthorized", () => {
    throw new UnauthorizedException("Authentication required.");
});

app.get("/__test-forbidden", () => {
    throw new ForbiddenException("Access denied.");
});

app.get("/__test-validation", () => {
    const schema = z.object({
        name: z.string().min(1, "Name is required"),
    });

    schema.parse({ name: "" });
    return new Response();
});

app.get("/__test-internal-error", () => {
    throw new Error("boom");
});

app.post("/__test-invalid-json", async (c) => {
    await c.req.json();
    return c.json({ ok: true });
});

test("bad request exceptions are returned as HTTP 400", async () => {
    const response = await app.request("http://localhost/__test-bad-request");
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "BAD_REQUEST");
    assert.equal(body.error.message, "Inactive academic years cannot be set as current.");
    assert.equal(typeof body.timestamp, "string");
});

test("validation errors return a standardized response", async () => {
    const response = await app.request("http://localhost/__test-validation");
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "VALIDATION_ERROR");
    assert.equal(body.error.message, "Validation failed");
    assert.deepEqual(body.error.details.fieldErrors.name, ["Name is required"]);
});

test("malformed JSON bodies return a standardized bad request response", async () => {
    const response = await app.request("http://localhost/__test-invalid-json", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: "",
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "BAD_REQUEST");
    assert.equal(body.error.message, "Invalid JSON body.");
});

test("conflict exceptions return a standardized response", async () => {
    const response = await app.request("http://localhost/__test-conflict");
    const body = await response.json();

    assert.equal(response.status, 409);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "CONFLICT");
    assert.equal(body.error.message, "Academic year already exists.");
});

test("not found exceptions return a standardized response", async () => {
    const response = await app.request("http://localhost/__test-not-found");
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "NOT_FOUND");
    assert.equal(body.error.message, "Department not found.");
});

test("unexpected errors return a sanitized internal server error response", async () => {
    const response = await app.request("http://localhost/__test-internal-error");
    const body = await response.json();

    assert.equal(response.status, 500);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "INTERNAL_SERVER_ERROR");
    assert.equal(body.error.message, "Internal server error.");
    assert.equal(body.error.details, undefined);
});

test("malformed academic year ids are rejected before repository lookup", async () => {
    const service = new AcademicYearService();
    const repository = {
        findById: () => {
            throw new Error("repository should not be called");
        },
    } as unknown as typeof service["repository"];

    (service as unknown as { repository: typeof repository }).repository = repository;

    await assert.rejects(
        () => service.findById("0da657a-545b-4e71-bc94-df1dd930429c"),
        (error: unknown) => {
            assert.ok(error instanceof BadRequestException);
            assert.equal(error.message, "Academic year id must be a valid UUID.");
            return true;
        },
    );
});
