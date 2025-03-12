import { Router } from "express";
import { schemaValidatorMiddleware } from "../middlewares/schemaValidatorMiddleware";
import { paginationInputSchema } from "../types/inputSchemas";
import * as productController from "../controllers/productController";

const router = Router();


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products
 *     tags: [Products]
 *     parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        required: false
 *        description: The number of products to retrieve
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *        required: false
 *        description: The offset to start the retrieval
 *     responses:
 *       200:
 *         description: The products were successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/GenericResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     meta:
 *                      $ref: '#/components/schemas/PaginationResponse'
 *       400: 
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 */
router.get(
  "/",
  schemaValidatorMiddleware(paginationInputSchema),
  productController.getProducts,
);

export default router;
