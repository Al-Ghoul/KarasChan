import { Router } from "express";
import * as cartController from "../controllers/cartController";

const router = Router();

router.post("/", cartController.createOrder);

router.get("/", cartController.getCurrentUserOrders);

router.get("/:id/items", cartController.getOrderItems);

export default router;
