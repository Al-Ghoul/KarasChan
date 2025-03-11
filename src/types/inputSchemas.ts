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

export const cartItemInputSchema = z.object({
  productId: z.number(),
  quantity: z.number(),
});

export type CartItemInputSchema = z.infer<typeof cartItemInputSchema>;

export const itemIdSchema = z
  .object({
    id: z
      .string()
      .optional()
      .transform((value) => (value ? parseInt(value) : 0)),
  })
  .strict();

export const itemQuantityInputSchema = z
  .object({
    quantity: z.number().refine((value) => value > 0, {
      message: "Quantity must be greater than 0",
    }),
  })
  .strict();
