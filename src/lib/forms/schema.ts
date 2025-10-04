import { z } from "zod";
export const simSchema = z.object({
  age: z.number().int().min(16).max(80),
  sex: z.enum(["F","M"]),
  grossSalary: z.number().min(0),
  workStartYear: z.number().int(),
  retireYear: z.number().int(),
  includeSickLeave: z.boolean(),
  includeIKZE: z.boolean().optional(),
  includePPK: z.boolean().optional(),
});
export type SimInput = z.infer<typeof simSchema>;