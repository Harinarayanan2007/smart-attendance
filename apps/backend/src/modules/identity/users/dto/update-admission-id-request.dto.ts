import { z } from "zod";

export const UpdateAdmissionIdRequestSchema = z.object({
  admissionId: z
    .string()
    .trim()
    .regex(/^[0-9]{2}[A-Z]+[0-9]{3,}$/, "Invalid Admission ID format. Example: 24IT001"),

});

export type UpdateAdmissionIdRequestDto = z.infer<typeof UpdateAdmissionIdRequestSchema>;
