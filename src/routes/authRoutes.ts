import { Router } from "express";
import { schemaValidatorMiddleware } from "../middlewares/schemaValidatorMiddleware";
import { userInputSchema } from "../types/inputSchemas";
import * as authController from "../controllers/authController";

const router = Router();

router.post(
  "/signup",
  schemaValidatorMiddleware(userInputSchema),
  authController.createUser,
);

export default router;
