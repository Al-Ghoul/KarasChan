import { Router } from "express";
import * as cartController from "../controllers/cartController";

const router = Router();

router.post("/", cartController.createOrder);

export default router;
