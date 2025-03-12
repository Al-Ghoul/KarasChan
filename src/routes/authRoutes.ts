import { Router } from "express";
import { schemaValidatorMiddleware } from "../middlewares/schemaValidatorMiddleware";
import { signinInputSchema, signupInputSchema } from "../types/inputSchemas";
import * as authController from "../controllers/authController";

const router = Router();

router.post(
  "/signup",
  schemaValidatorMiddleware(signupInputSchema),
  authController.createUser,
);

router.post(
  "/signin",
  schemaValidatorMiddleware(signinInputSchema),
  authController.signinUser,
);

export default router;
