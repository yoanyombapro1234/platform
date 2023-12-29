import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string(),
  name: z.string(),
  personalFinanceCategoryPrimary: z.string(),
  authorizedDate: z.string(),
  merchantName: z.string(),
});
export type Task = z.infer<typeof transactionSchema>;
