import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../columns.helpers";

export const user = pgTable("user", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: varchar({ length: 255 }).notNull(),
  fullName: varchar({ length: 255 }).notNull(),
  address: text(),
  ...timestamps,
});
