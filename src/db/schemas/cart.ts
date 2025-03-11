import {
  pgEnum,
  pgTable,
  serial,
  timestamp,
  uuid,
  integer,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";
import { user } from "./user";
import { product } from "./product";

export const cartStatus = pgEnum("cart_status", [
  "active",
  "archived",
  "checked_out",
]);

export const cart = pgTable("cart", {
  id: serial().primaryKey(),
  userId: uuid().references(() => user.id),
  status: cartStatus().default("active"),
  checkedOutAt: timestamp(),
  archivedAt: timestamp(),
  ...timestamps,
});

export const cartItem = pgTable("cart_item", {
  id: serial().primaryKey(),
  cartId: integer().references(() => cart.id),
  productId: integer().references(() => product.id),
  quantity: integer().notNull(),
  ...timestamps,
});
