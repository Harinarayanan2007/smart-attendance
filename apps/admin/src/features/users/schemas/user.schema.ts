import { z } from 'zod';

const baseUserSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().max(50).optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  role: z.string().trim().min(1, "Role is required"),
  departmentId: z.string().uuid("Invalid department ID").or(z.literal('none')).optional().nullable(),
  programId: z.string().uuid("Invalid program ID").or(z.literal('none')).optional().nullable(),
  batchId: z.string().uuid("Invalid batch ID").or(z.literal('none')).optional().nullable(),
});

export const userSchema = baseUserSchema.superRefine((data, ctx) => {
  if (data.role === "FACULTY" && (!data.departmentId || data.departmentId === "none")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Department is required for Faculty",
      path: ["departmentId"],
    });
  }
  
  if (data.role === "STUDENT") {
    if (!data.departmentId || data.departmentId === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Department is required for Students",
        path: ["departmentId"],
      });
    }
    if (!data.programId || data.programId === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Program is required for Students",
        path: ["programId"],
      });
    }
    if (!data.batchId || data.batchId === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Batch is required for Students",
        path: ["batchId"],
      });
    }
  }
});

export const createUserSchema = baseUserSchema.extend({
  password: z.string().max(100).optional().nullable(),
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
  if (data.role === "FACULTY" && (!data.departmentId || data.departmentId === "none")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Department is required for Faculty",
      path: ["departmentId"],
    });
  }
  
  if (data.role === "STUDENT") {
    if (!data.departmentId || data.departmentId === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Department is required for Students",
        path: ["departmentId"],
      });
    }
    if (!data.programId || data.programId === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Program is required for Students",
        path: ["programId"],
      });
    }
    if (!data.batchId || data.batchId === "none") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Academic Year is required for Students",
        path: ["batchId"],
      });
    }
  }
});

export const updatePasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export type UserFormValues = z.infer<typeof userSchema>;
export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
