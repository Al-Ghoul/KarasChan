import { user } from "../db/schemas/user";
import { orderItem, order } from "../db/schemas/order";
import { cart } from "../db/schemas/cart";

export {};

declare global {
  type User = typeof user.$inferInsert;
  type OrderItem = typeof orderItem.$inferInsert;
  type FulfillmentStatus = (typeof order.$inferSelect)["fulfillmentStatus"];
  type CartStatus = (typeof cart.$inferSelect)["status"];
  namespace Express {
    interface Request {
      user: { userId: string };
    }
  }
}
