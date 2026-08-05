import { z } from "zod";

export const CreateUserRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().max(100).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  role: z.string().trim().min(1, "Role is required"),
  departmentId: z.string().uuid("Invalid department ID").optional().nullable(),
  programId: z.string().uuid("Invalid program ID").optional().nullable(),
  batchId: z.string().uuid("Invalid batch ID").optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.role === "ADMIN") {
    if (!data.password || data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password must be at least 8 characters for Administrators",
        path: ["password"],
      });
    }
  }

  if (data.role === "FACULTY" && !data.departmentId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Department is required for Faculty",
      path: ["departmentId"],
    });
  }
  
  if (data.role === "STUDENT") {
    if (!data.departmentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Department is required for Students",
        path: ["departmentId"],
      });
    }
    if (!data.programId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Program is required for Students",
        path: ["programId"],
      });
    }
    if (!data.batchId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Academic Year is required for Students",
        path: ["batchId"],
      });
    }
  }
});

export type CreateUserRequestDto = z.infer<typeof CreateUserRequestSchema>;
