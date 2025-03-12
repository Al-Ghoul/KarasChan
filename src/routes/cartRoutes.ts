import { Router } from "express";
import * as cartController from "../controllers/cartController";
import { schemaValidatorMiddleware } from "../middlewares/schemaValidatorMiddleware";
import { cartItemInputSchema } from "../types/inputSchemas";

const router = Router();

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create cart for current user
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: The cart was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/GenericResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Cart'
 *       409:
 *         description: The user already has a cart
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/GenericResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 */
router.post("/", cartController.createCartForCurrentUser);

/**
 * @swagger
 * /api/carts:
 *   get:
 *     summary: Get cart for current user
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The cart was successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/GenericResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Cart'
 *
 *       404:
 *         description: The user doesn't have a cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 */
router.get("/", cartController.getCurrentUserCart);

/**
 * @swagger
 * /api/carts/items:
 *   post:
 *     summary: Create cart item
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              productId:
 *                type: number
 *              quantity:
 *                type: number
 *     responses:
 *       201:
 *         description: The cart item were successfully created
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/GenericResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                      $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: The user doesn't have a cart or the product doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *       400:
 *         description: The product quantity is not valid
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
router.post(
  "/items",
  schemaValidatorMiddleware(cartItemInputSchema),
  cartController.addItemToCart,
);

/**
 * @swagger
 * /api/carts/items:
 *   get:
 *     summary: Get cart items
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
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
 *         description: The cart items were successfully retrieved
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
 *                         $ref: '#/components/schemas/CartItem'
 *                     meta:
 *                       $ref: '#/components/schemas/PaginationResponse'
 *       400:
 *         description:  Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *       404:
 *         description: The user doesn't have a cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *
 */
router.get("/items", cartController.getCartItems);

/**
 * @swagger
 * /api/carts/items/{id}:
 *   delete:
 *     summary: Delete cart item
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The cart item id
 *     responses:
 *       200:
 *         description: The cart item was successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *              allOf:
 *                - $ref: '#/components/schemas/GenericResponse'
 *                - type: object
 *                  properties:
 *                    data:
 *                      $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *       404:
 *         description: The user doesn't have a cart or the cart item doesn't exist
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
router.delete("/items/:id", cartController.deleteCartItem);

/**
 * @swagger
 * /api/carts/items/{id}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The cart item id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 2
 *                 description: The quantity of the cart item
 *                 required: true
 *                 minimum: 1
 *
 *
 *     responses:
 *       200:
 *         description: The cart item was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/GenericResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/CartItem'
 *
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *
 *       404:
 *         description: The user doesn't have a cart or the cart item doesn't exist
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenericResponse'
 *
 */
router.patch("/items/:id", cartController.updateCartItemQuantity);

export default router;
