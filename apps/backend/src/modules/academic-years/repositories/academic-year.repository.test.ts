import assert from "node:assert/strict";
import test from "node:test";

import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";
import { ConflictException } from "../../../shared/exceptions/conflict.exception.js";
import { AcademicYearRepository } from "./academic-year.repository.js";

test("repository maps unique constraint errors to conflict exceptions", async () => {
    const repository = new AcademicYearRepository({
        insert: () => ({
            values: () => ({
                returning: () => {
                    throw { code: "23505", message: "duplicate key value violates unique constraint" };
                },
            }),
        }),
    } as never);

    await assert.rejects(
        async () => {
            await repository.create({
                name: "2026-27",
                startDate: "2026-01-01",
                endDate: "2027-01-01",
                isCurrent: false,
                isActive: true,
            });
        },
        (error: unknown) => {
            assert.ok(error instanceof ConflictException);
            return true;
        },
    );
});

test("repository maps invalid uuid errors to bad request exceptions", async () => {
    const repository = new AcademicYearRepository({
        update: () => {
            throw { code: "22P02", message: "invalid input syntax for type uuid" };
        },
    } as never);

    await assert.rejects(
        async () => {
            await repository.updateCurrentState("bad-id", { isCurrent: true });
        },
        (error: unknown) => {
            assert.ok(error instanceof BadRequestException);
            return true;
        },
    );
});
