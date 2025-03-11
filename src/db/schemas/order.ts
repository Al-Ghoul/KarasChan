import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  uuid,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { cart } from "./cart";
import { user } from "./user";
import { product } from "./product";

export const fulfillmentStatus = pgEnum("fullfillment_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const order = pgTable("order", {
  id: serial().primaryKey(),
  cartId: integer().references(() => cart.id),
  userId: uuid().references(() => user.id),
  totalAmount: numeric().notNull(),
  fulfillmentStatus: fulfillmentStatus(),
  ...timestamps,
});

export const orderItem = pgTable("order_item", {
  id: serial().primaryKey(),
  orderId: integer().references(() => order.id),
  productId: integer().references(() => product.id),
  quantity: integer().notNull(),
  priceAtPurchase: numeric({ precision: 10, scale: 2 }).notNull(),
  ...timestamps,
});
