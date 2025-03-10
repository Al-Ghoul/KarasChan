import { Router } from "express";
import { schemaValidatorMiddleware } from "../middlewares/schemaValidatorMiddleware";
import { loginInputSchema, userInputSchema } from "../types/inputSchemas";
import * as authController from "../controllers/authController";

const router = Router();

router.post(
  "/signup",
  schemaValidatorMiddleware(userInputSchema),
  authController.createUser,
);

router.post(
  "/signin",
  schemaValidatorMiddleware(loginInputSchema),
  authController.loginUser,
);

export default router;
