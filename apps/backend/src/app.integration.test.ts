import assert from "node:assert/strict";
import test from "node:test";

import app from "./app.js";
import { AcademicYearService } from "./modules/academic-years/services/academic-year.service.js";
import { DepartmentService } from "./modules/departments/services/department.service.js";
import { generateAccessToken } from "./modules/identity/auth/utils/jwt.js";
import { ConflictException } from "./shared/exceptions/conflict.exception.js";

function createAuthHeaders(role: string) {
    const token = generateAccessToken({ userId: "user-1", role });

    return {
        Authorization: `Bearer ${token}`,
    };
}

test("academic year create returns 201 with standardized success payload for admin", async () => {
    const originalCreate = AcademicYearService.prototype.create;

    AcademicYearService.prototype.create = (async function () {
        return {
            id: "11111111-1111-4111-8111-111111111111",
            name: "2026-27",
            startDate: "2026-01-01",
            endDate: "2027-01-01",
            isCurrent: false,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }) as typeof AcademicYearService.prototype.create;

    try {
        const response = await app.request("http://localhost/academic-years", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...createAuthHeaders("ADMIN"),
            },
            body: JSON.stringify({
                name: "2026-27",
                startDate: "2026-01-01",
                endDate: "2027-01-01",
                isCurrent: false,
                isActive: true,
            }),
        });
        const body = await response.json();

        assert.equal(response.status, 201);
        assert.equal(body.success, true);
        assert.equal(body.data.name, "2026-27");
    } finally {
        AcademicYearService.prototype.create = originalCreate;
    }
});

test("academic year create returns 409 for duplicate name through the error handler", async () => {
    const originalCreate = AcademicYearService.prototype.create;

    AcademicYearService.prototype.create = async function () {
        throw new ConflictException("Academic year name already exists.");
    };

    try {
        const response = await app.request("http://localhost/academic-years", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...createAuthHeaders("ADMIN"),
            },
            body: JSON.stringify({
                name: "2026-27",
                startDate: "2026-01-01",
                endDate: "2027-01-01",
            }),
        });
        const body = await response.json();

        assert.equal(response.status, 409);
        assert.equal(body.success, false);
        assert.equal(body.error.code, "CONFLICT");
        assert.equal(body.error.message, "Academic year name already exists.");
    } finally {
        AcademicYearService.prototype.create = originalCreate;
    }
});

test("academic year create returns 400 validation error for invalid payload", async () => {
    const response = await app.request("http://localhost/academic-years", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            ...createAuthHeaders("ADMIN"),
        },
        body: JSON.stringify({
            startDate: "2026-01-01",
        }),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "VALIDATION_ERROR");
    assert.equal(body.error.message, "Validation failed");
});

test("academic year find by invalid UUID returns 400", async () => {
    const response = await app.request("http://localhost/academic-years/abc", {
        headers: createAuthHeaders("ADMIN"),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "BAD_REQUEST");
});

test("department create returns 201 with standardized success payload", async () => {
    const originalCreate = DepartmentService.prototype.create;

    DepartmentService.prototype.create = (async function () {
        return {
            id: "22222222-2222-4222-8222-222222222222",
            name: "Civil Engineering",
            code: "CE",
            description: "Civil Department",
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
        };
    }) as typeof DepartmentService.prototype.create;

    try {
        const response = await app.request("http://localhost/departments", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...createAuthHeaders("ADMIN"),
            },
            body: JSON.stringify({
                name: "Civil Engineering",
                code: "CE",
                description: "Civil Department",
            }),
        });
        const body = await response.json();

        assert.equal(response.status, 201);
        assert.equal(body.success, true);
        assert.equal(body.data.code, "CE");
    } finally {
        DepartmentService.prototype.create = originalCreate;
    }
});

test("department create returns 409 for duplicate code through the error handler", async () => {
    const originalCreate = DepartmentService.prototype.create;

    DepartmentService.prototype.create = async function () {
        throw new ConflictException("Department code already exists.");
    };

    try {
        const response = await app.request("http://localhost/departments", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                ...createAuthHeaders("ADMIN"),
            },
            body: JSON.stringify({
                name: "Civil Engineering",
                code: "CE",
                description: "Civil Department",
            }),
        });
        const body = await response.json();

        assert.equal(response.status, 409);
        assert.equal(body.success, false);
        assert.equal(body.error.code, "CONFLICT");
        assert.equal(body.error.message, "Department code already exists.");
    } finally {
        DepartmentService.prototype.create = originalCreate;
    }
});

test("protected routes reject requests without a token", async () => {
    const response = await app.request("http://localhost/academic-years", {
        headers: {
            "content-type": "application/json",
        },
    });
    const body = await response.json();

    assert.equal(response.status, 401);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "UNAUTHORIZED");
});

test("admin-only routes reject student role with 403", async () => {
    const response = await app.request("http://localhost/academic-years", {
        headers: {
            "content-type": "application/json",
            ...createAuthHeaders("STUDENT"),
        },
    });
    const body = await response.json();

    assert.equal(response.status, 403);
    assert.equal(body.success, false);
    assert.equal(body.error.code, "FORBIDDEN");
});
