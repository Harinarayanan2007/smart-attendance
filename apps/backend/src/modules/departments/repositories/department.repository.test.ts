import assert from "node:assert/strict";
import test from "node:test";

import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";
import { ConflictException } from "../../../shared/exceptions/conflict.exception.js";
import { DepartmentRepository } from "./department.repository.js";

test("repository maps unique constraint errors to conflict exceptions", async () => {
    const repository = new DepartmentRepository({
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
            await repository.create({ code: "CSE", name: "Computer Science", description: "Department" });
        },
        (error: unknown) => {
            assert.ok(error instanceof ConflictException);
            return true;
        },
    );
});

test("repository maps foreign key errors to bad request exceptions", async () => {
    const repository = new DepartmentRepository({
        update: () => {
            throw { code: "23503", message: "insert or update on table violates foreign key constraint" };
        },
    } as never);

    await assert.rejects(
        async () => {
            await repository.update("bad-id", { name: "Updated" });
        },
        (error: unknown) => {
            assert.ok(error instanceof BadRequestException);
            return true;
        },
    );
});
