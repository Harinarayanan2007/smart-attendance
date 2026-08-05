import { z } from "zod";

export const UpdateUserRequestSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255).optional(),
  phone: z.string().max(50).optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  role: z.string().trim().min(1, "Role is required").optional(),
  departmentId: z.string().uuid("Invalid department ID").optional().nullable(),
  programId: z.string().uuid("Invalid program ID").optional().nullable(),
  batchId: z.string().uuid("Invalid batch ID").optional().nullable(),
}).superRefine((data, ctx) => {
  if (data.role === "FACULTY" && data.departmentId === null) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Department is required for Faculty",
      path: ["departmentId"],
    });
  }
  
  if (data.role === "STUDENT") {
    if (data.departmentId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Department is required for Students",
        path: ["departmentId"],
      });
    }
    if (data.programId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Program is required for Students",
        path: ["programId"],
      });
    }
    if (data.batchId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Academic Year is required for Students",
        path: ["batchId"],
      });
    }
  }
});

export type UpdateUserRequestDto = z.infer<typeof UpdateUserRequestSchema>;
