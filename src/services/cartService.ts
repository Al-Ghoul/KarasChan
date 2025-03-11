import { db } from "../db";
import { cart } from "../db/schemas/cart";
import { eq, and } from "drizzle-orm";

export async function getCartByUserId(userId: string) {
  let queriedCart = undefined;
  try {
    queriedCart = await db
      .select()
      .from(cart)
      .where(and(eq(cart.userId, userId), eq(cart.status, "active")));
  } catch (error) {
    throw new Error("Database error");
  }
  return queriedCart[0];
}

export async function createCart(userId: string) {
  let createdCart = undefined;
  try {
    createdCart = await db.insert(cart).values({ userId }).returning();
  } catch (error) {
    throw new Error("Database error");
  }
  if (!createdCart.length) throw new Error("Cart not created");
  return createdCart[0];
}
