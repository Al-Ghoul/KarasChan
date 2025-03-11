import { db } from "../db";
import { product } from "../db/schemas/product";
import { type PaginationInputSchema } from "../types/inputSchemas";
import { asc, count, eq } from "drizzle-orm";

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
