import assert from "node:assert/strict";
import test from "node:test";

import { BadRequestException } from "../../../shared/exceptions/bad-request.exception.js";
import { AcademicYearService } from "./academic-year.service.js";

test("academic year creates reject invalid date ranges", async () => {
    const service = new AcademicYearService();

    await assert.rejects(
        () =>
            service.create({
                name: "2025-26",
                startDate: "2026-01-01",
                endDate: "2025-01-01",
                isCurrent: false,
                isActive: true,
            }),
        (error: unknown) => {
            assert.ok(error instanceof BadRequestException);
            assert.equal(error.message, "Start date must be before end date.");
            return true;
        },
    );
});
test("academic year create rejects inactive current year", async () => {
    const service = new AcademicYearService();
    const repository = {
        existsByName: async () => false,
        findCurrentAcademicYear: async () => undefined,
    } as unknown as typeof service["repository"];

    (service as unknown as { repository: typeof repository }).repository = repository;

    await assert.rejects(
        () =>
            service.create({
                name: "2026-27",
                startDate: "2026-01-01",
                endDate: "2027-01-01",
                isCurrent: true,
                isActive: false,
            }),
        (error: unknown) => {
            assert.ok(error instanceof BadRequestException);
            assert.equal(error.message, "Inactive academic year cannot be current.");
            return true;
        },
    );
});
test("academic year create rejects duplicate current year", async () => {
    const service = new AcademicYearService();
    const repository = {
        existsByName: async () => false,
        findCurrentAcademicYear: async () => ({ id: "current-id" }),
        clearCurrentAcademicYears: async () => undefined,
        create: async () => ({ id: "new-id" }),
        runInTransaction: async (_callback: () => Promise<unknown>) => _callback(),
    } as unknown as typeof service["repository"];

    (service as unknown as { repository: typeof repository }).repository = repository;

    await assert.rejects(
        () =>
            service.create({
                name: "2026-27",
                startDate: "2026-01-01",
                endDate: "2027-01-01",
                isCurrent: true,
                isActive: true,
            }),
        (error: unknown) => {
            assert.ok(error instanceof BadRequestException);
            assert.equal(error.message, "Only one academic year can be current at a time.");
            return true;
        },
    );
});
