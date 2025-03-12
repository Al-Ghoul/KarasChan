import { NeonDbError } from "@neondatabase/serverless";
import { db } from "../db";
import { user } from "../db/schemas/user";
import { SigninInputSchema, SignupInputSchema } from "../types/inputSchemas";
import { eq } from "drizzle-orm";

export async function createUser(input: SignupInputSchema) {
  let createdUser = undefined;
  try {
    createdUser = await db.insert(user).values(input).returning({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      address: user.address,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    if (error instanceof NeonDbError) {
      if (error.code === "23505") throw new Error("User already exists");
    }
  }
  if (!createdUser || !createdUser.length) throw new Error("User not created");
  return createdUser[0];
}

export async function findUserByEmail(input: SigninInputSchema) {
  let queriedUser: User[] = [];
  try {
    queriedUser = await db
      .select()
      .from(user)
      .where(eq(user.email, input.email));
  } catch (error) {
    throw new Error("Database error");
  }
  if (!queriedUser.length) throw new Error("User not found");
  return queriedUser[0];
}
