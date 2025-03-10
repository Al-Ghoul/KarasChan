import { NeonDbError } from "@neondatabase/serverless";
import { db } from "../db";
import { user } from "../db/schemas/user";
import { UserInputSchema } from "../types/inputSchemas";

export async function createUser(input: UserInputSchema) {
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
