import { z } from "zod";

export const userInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  fullName: z.string(),
  address: z.string().optional(),
});

export type UserInputSchema = z.infer<typeof userInputSchema>;
