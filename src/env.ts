import z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  TOKEN_ISSUER: z.string(),
  JWT_SECRET: z.string(),
  JWT_KEY: z.string(),
  PORT: z.string().transform(Number),
});

export const env = envSchema.parse(process.env);
