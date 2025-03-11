import { z } from "zod";

export const loginInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type LoginInputSchema = z.infer<typeof loginInputSchema>;

export const userInputSchema = loginInputSchema.extend({
  fullName: z.string(),
  address: z.string().optional(),
});

export type UserInputSchema = z.infer<typeof userInputSchema>;

export const paginationInputSchema = z
  .object({
    limit: z
      .string()
      .optional()
      .transform((value) => (value ? parseInt(value) : undefined)),
    offset: z
      .string()
      .optional()
      .transform((value) => (value ? parseInt(value) : undefined)),
  })
  .strict();

export type PaginationInputSchema = z.infer<typeof paginationInputSchema>;
