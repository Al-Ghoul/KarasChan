import { db } from "../db";
import { cart, cartItem } from "../db/schemas/cart";
import { eq, and, count, asc } from "drizzle-orm";
import { PaginationInputSchema } from "../types/inputSchemas";
import { order, orderItem } from "../db/schemas/order";
import { product } from "../db/schemas/product";

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
      .limit(input.limit + 1)
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

export async function addItemToCart(input: {
  cartId: number;
  productId: number;
  quantity: number;
}) {
  let createdCartItem = undefined;
  try {
    createdCartItem = await db.insert(cartItem).values(input).returning();
  } catch (error) {
    throw new Error("Database error");
  }
  if (!createdCartItem.length) throw new Error("Cart item not created");
  return createdCartItem[0];
}

export async function deleteCartItem({
  cartId,
  itemId,
}: {
  cartId: number;
  itemId: number;
}) {
  let deletedCartItem = undefined;
  try {
    deletedCartItem = await db
      .delete(cartItem)
      .where(and(eq(cartItem.id, itemId), eq(cartItem.cartId, cartId)))
      .returning();
  } catch (error) {
    throw new Error("Database error");
  }
  return deletedCartItem[0];
}

export async function updateCartItemQuantity({
  cartId,
  itemId,
  quantity,
}: {
  cartId: number;
  itemId: number;
  quantity: number;
}) {
  let updatedCartItem = undefined;
  try {
    updatedCartItem = await db
      .update(cartItem)
      .set({ quantity })
      .where(and(eq(cartItem.id, itemId), eq(cartItem.cartId, cartId)))
      .returning();
  } catch (error) {
    throw new Error("Database error");
  }
  return updatedCartItem[0];
}

export async function getCartItemsByUserId(userId: string) {
  let cartItems = undefined;
  try {
    cartItems = await db
      .select({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        cartId: cartItem.cartId,
      })
      .from(cart)
      .innerJoin(cartItem, eq(cartItem.cartId, cart.id))
      .innerJoin(product, eq(product.id, cartItem.productId))
      .where(and(eq(cart.userId, userId), eq(cart.status, "active")));
  } catch (error) {
    throw new Error("Database error");
  }
  return cartItems;
}

export async function createOrder({
  cartId,
  userId,
  totalAmount,
}: {
  cartId: number;
  userId: string;
  totalAmount: string;
}) {
  let createdOrder = undefined;
  try {
    createdOrder = await db
      .insert(order)
      .values({
        cartId,
        userId,
        fulfillmentStatus: "pending",
        totalAmount,
      })
      .returning();
  } catch (error) {
    throw new Error("Database error");
  }
  if (!createdOrder.length) throw new Error("Order not created");
  return createdOrder[0];
}

export async function createOrderItems(
  orderItems: Omit<OrderItem, "id" | "createdAt" | "updatedAt">[],
) {
  let createdOrderItems = undefined;
  try {
    createdOrderItems = await db
      .insert(orderItem)
      .values(orderItems)
      .returning();
  } catch (error) {
    throw new Error("Database error");
  }
  if (!createdOrderItems.length) throw new Error("Order items not created");
  return createdOrderItems[0];
}

export async function updateCartStatus({
  cartId,
  status,
}: {
  cartId: number;
  status: NonNullable<CartStatus>;
}) {
  let updatedCart = undefined;
  try {
    updatedCart = await db
      .update(cart)
      .set({ status })
      .where(eq(cart.id, cartId))
      .returning();
  } catch (error) {
    throw new Error("Database error");
  }
  if (!updatedCart.length) throw new Error("Cart not updated");
  return updatedCart[0];
}

export async function getOrdersByUserId(
  input: {
    userId: string;
    fulfillmentStatus: NonNullable<FulfillmentStatus>;
  } & Required<PaginationInputSchema>,
) {
  let orders = undefined;
  try {
    orders = await db
      .select()
      .from(order)
      .where(
        and(
          eq(order.userId, input.userId),
          eq(order.fulfillmentStatus, input.fulfillmentStatus),
        ),
      )
      .limit(input.limit)
      .offset(input.offset);
  } catch (error) {
    throw new Error("Database error");
  }
  return orders;
}

export async function getTotalOrdersCountByUserId(
  userId: string,
  fulfillmentStatus: NonNullable<FulfillmentStatus>,
) {
  let totalOrdersCount = undefined;
  try {
    totalOrdersCount = await db
      .select({ count: count() })
      .from(order)
      .where(
        and(
          eq(order.userId, userId),
          eq(order.fulfillmentStatus, fulfillmentStatus),
        ),
      );
  } catch (error) {
    throw new Error("Database error");
  }
  return totalOrdersCount;
}

export async function getOrderItemsByOrderId(
  input: {
    userId: string;
    orderId: number;
  } & Required<PaginationInputSchema>,
) {
  let orderItems = undefined;
  try {
    orderItems = await db
      .select({
        id: orderItem.id,
        name: product.name,
        price: orderItem.priceAtPurchase,
        quantity: orderItem.quantity,
      })
      .from(order)
      .innerJoin(orderItem, eq(orderItem.orderId, order.id))
      .innerJoin(product, eq(product.id, orderItem.productId))
      .where(and(eq(order.id, input.orderId), eq(order.userId, input.userId)))
      .limit(input.limit + 1)
      .offset(input.offset);
  } catch (error) {
    throw new Error("Database error");
  }
  return orderItems;
}

export async function getTotalOrderItemsCountByOrderId(input: {
  userId: string;
  orderId: number;
}) {
  let orderItems = undefined;
  try {
    orderItems = await db
      .select({
        count: count(),
      })
      .from(order)
      .innerJoin(orderItem, eq(orderItem.orderId, order.id))
      .innerJoin(product, eq(product.id, orderItem.productId))
      .where(and(eq(order.id, input.orderId), eq(order.userId, input.userId)));
  } catch (error) {
    throw new Error("Database error");
  }
  return orderItems;
}

export async function getOrderById(id: number) {
  let queriedOrder = undefined;
  try {
    queriedOrder = await db.select().from(order).where(eq(order.id, id));
  } catch (error) {
    throw new Error("Database error");
  }
  return queriedOrder[0];
}
