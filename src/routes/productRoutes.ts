import { Router } from "express";
import { schemaValidatorMiddleware } from "../middlewares/schemaValidatorMiddleware";
import { paginationInputSchema } from "../types/inputSchemas";
import * as productController from "../controllers/productController";

const router = Router();

router.get(
  "/",
  schemaValidatorMiddleware(paginationInputSchema),
  productController.getProducts,
);

export default router;
