import { db } from "../db";
import { cart, cartItem } from "../db/schemas/cart";
import { eq, and, count, asc } from "drizzle-orm";
import { PaginationInputSchema } from "../types/inputSchemas";

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

export async function getCartItems(
  input: { cartId: number } & Required<PaginationInputSchema>,
) {
  let cartItems = undefined;
  try {
    cartItems = await db
      .select({
        id: cartItem.id,
        cartId: cartItem.cartId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        createdAt: cartItem.createdAt,
      })
      .from(cart)
      .innerJoin(cartItem, eq(cartItem.cartId, cart.id))
      .where(eq(cart.id, input.cartId))
      .orderBy(asc(cartItem.createdAt))
      .limit(input.limit)
      .offset(input.offset);
  } catch (error) {
    throw new Error("Database error");
  }
  return cartItems;
}

export async function getTotalCartItemsCount(cartId: number) {
  let totalCartItems = undefined;
  try {
    totalCartItems = await db
      .select({ count: count() })
      .from(cart)
      .where(eq(cart.id, cartId))
      .innerJoin(cartItem, eq(cartItem.cartId, cartItem.id));
  } catch (error) {
    throw new Error("Database error");
  }
  return totalCartItems;
}
