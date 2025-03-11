import { user } from "../db/schemas/user";
import { orderItem } from "../db/schemas/order";

export {};

declare global {
  type User = typeof user.$inferInsert;
  type OrderItem = typeof orderItem.$inferInsert;

  namespace Express {
    interface Request {
      user: { userId: string };
    }
  }
}
