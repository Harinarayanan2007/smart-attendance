import assert from "node:assert/strict";
import test from "node:test";

import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";
import { ConflictException } from "../../../shared/exceptions/conflict.exception.js";
import { DepartmentService } from "./department.service.js";

test("invalid department ids are rejected before repository lookup", async () => {
    const service = new DepartmentService();
    const repository = {
        findById: () => {
            throw new Error("repository should not be called");
        },
    } as unknown as typeof service["repository"];

    (service as unknown as { repository: typeof repository }).repository = repository;

    await assert.rejects(
        () => service.findById("not-a-uuid"),
        (error: unknown) => {
            assert.ok(error instanceof BadRequestException);
            assert.equal(error.message, "Department id must be a valid UUID.");
            return true;
        },
    );
});

test("duplicate department codes are rejected as conflicts", async () => {
    const service = new DepartmentService();
    const repository = {
        existsByCode: async () => true,
        existsByName: async () => false,
    } as unknown as typeof service["repository"];

    (service as unknown as { repository: typeof repository }).repository = repository;

    await assert.rejects(
        () => service.create({ code: "CE", name: "Civil Engineering", description: "Civil Department" }),
        (error: unknown) => {
            assert.ok(error instanceof ConflictException);
            assert.equal(error.message, "Department code already exists.");
            return true;
        },
    );
});
