import { Router } from "express";
import * as cartController from "../controllers/cartController";
import { schemaValidatorMiddleware } from "../middlewares/schemaValidatorMiddleware";
import { cartItemInputSchema } from "../types/inputSchemas";

const router = Router();

router.post("/", cartController.createCartForCurrentUser);

router.get("/", cartController.getCurrentUserCart);

router.post(
  "/items",
  schemaValidatorMiddleware(cartItemInputSchema),
  cartController.addItemToCart,
);

router.get("/items", cartController.getCartItems);

router.delete("/items/:id", cartController.deleteCartItem);

router.patch("/items/:id", cartController.updateCartItemQuantity);

export default router;
