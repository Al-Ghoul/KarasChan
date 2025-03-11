import { user } from "../db/schemas/user";
import { orderItem, order } from "../db/schemas/order";

export {};

declare global {
  type User = typeof user.$inferInsert;
  type OrderItem = typeof orderItem.$inferInsert;
  type FulfillmentStatus = (typeof order.$inferSelect)["fulfillmentStatus"];
  namespace Express {
    interface Request {
      user: { userId: string };
    }
  }
}
