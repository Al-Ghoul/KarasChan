import { db } from "../db";
import { cartItem } from "../db/schemas/cart";
import { product } from "../db/schemas/product";
import { type PaginationInputSchema } from "../types/inputSchemas";
import { asc, count, eq, and } from "drizzle-orm";

export async function getProducts(input: Required<PaginationInputSchema>) {
  let products = undefined;
  try {
    products = await db
      .select()
      .from(product)
      .limit(input.limit + 1)
      .offset(input.offset)
      .orderBy(asc(product.createdAt));
  } catch (error) {
    throw new Error("Database error");
  }
  return products;
}

export async function getTotalProductsCount() {
  let totalProducts = undefined;
  try {
    totalProducts = await db.select({ count: count() }).from(product);
  } catch (error) {
    throw new Error("Database error");
  }
  return totalProducts;
}

export async function getProductById(id: number) {
  let queriedProduct = undefined;
  try {
    queriedProduct = await db.select().from(product).where(eq(product.id, id));
  } catch (error) {
    throw new Error("Database error");
  }
  return queriedProduct[0];
}

export async function getProductByCartId({
  cartId,
  itemId,
}: {
  cartId: number;
  itemId: number;
}) {
  let queriedProduct = undefined;
  try {
    queriedProduct = await db
      .select({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: product.quantity,
      })
      .from(product)
      .innerJoin(cartItem, eq(cartItem.productId, product.id))
      .where(and(eq(cartItem.id, itemId), eq(cartItem.cartId, cartId)));
  } catch (error) {
    throw new Error("Database error");
  }
  return queriedProduct[0];
}
