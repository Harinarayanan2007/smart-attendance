import { count, eq, and } from "drizzle-orm";
import { db } from "../../../database/client.js";
import { departments } from "../../../database/schema/academic/departments.js";
import { programs } from "../../../database/schema/academic/programs.js";
import { users } from "../../../database/schema/identity/users.js";
import { roles } from "../../../database/schema/identity/roles.js";
import { batches } from "../../../database/schema/academic/batches.js";

export class DashboardService {
    async getSummary() {
        const adminRole = await db.query.roles.findFirst({ where: eq(roles.name, "ADMIN") });
        const facultyRole = await db.query.roles.findFirst({ where: eq(roles.name, "FACULTY") });
        const studentRole = await db.query.roles.findFirst({ where: eq(roles.name, "STUDENT") });

        const adminRoleId = adminRole?.id ?? "";
        const facultyRoleId = facultyRole?.id ?? "";
        const studentRoleId = studentRole?.id ?? "";

        const activeBatch = await db.query.batches.findFirst({ where: eq(batches.isActive, true) });

        const [
            batchesCount,
            departmentsCount,
            programsCount,
            adminsCount,
            facultyCount,
            studentsCount,
            inactiveUsersCount
        ] = await Promise.all([
            db.select({ count: count() }).from(batches),
            db.select({ count: count() }).from(departments),
            db.select({ count: count() }).from(programs),
            db.select({ count: count() }).from(users).where(and(eq(users.roleId, adminRoleId), eq(users.isActive, true))),
            db.select({ count: count() }).from(users).where(and(eq(users.roleId, facultyRoleId), eq(users.isActive, true))),
            db.select({ count: count() }).from(users).where(and(eq(users.roleId, studentRoleId), eq(users.isActive, true))),
            db.select({ count: count() }).from(users).where(eq(users.isActive, false)),
        ]);

        const activeUsersCount = (adminsCount[0]?.count ?? 0) + (facultyCount[0]?.count ?? 0) + (studentsCount[0]?.count ?? 0);
        const totalUsers = activeUsersCount + (inactiveUsersCount[0]?.count ?? 0);

        return {
            batches: batchesCount[0]?.count ?? 0,
            departments: departmentsCount[0]?.count ?? 0,
            programs: programsCount[0]?.count ?? 0,
            users: totalUsers,
            activeUsers: activeUsersCount,
            activeBatchName: activeBatch?.name ?? "No Active Batch",
        };
    }
}
