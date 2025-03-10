import {
    integer,
  numeric,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

export const product = pgTable("product", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }),
  description: text().notNull(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  quantity: integer().notNull(),
  ...timestamps,
});
