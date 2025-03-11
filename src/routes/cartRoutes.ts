import { Router } from "express";
import * as cartController from "../controllers/cartController";

const router = Router();

router.post("/", cartController.createCartForCurrentUser);

router.get("/", cartController.getCurrentUserCart);

router.get("/items", cartController.getCartItems);

export default router;
