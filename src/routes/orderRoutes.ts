import { Router } from "express";
import * as cartController from "../controllers/cartController";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *  post:
 *    summary: Create an order for current user
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      201:
 *        description: The order was successfully created
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/GenericResponse'
 *                - type: object
 *                  properties:
 *                    data:
 *                      $ref: '#/components/schemas/Order'
 *      404:
 *        description: The cart was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenericResponse'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenericResponse'
 */
router.post("/", cartController.createOrder);

/**
 * @swagger
 * /api/orders:
 *  get:
 *    summary: Get orders for current user
 *    tags: [Orders]
 *    parameters:
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        required: false
 *        description: The number of orders to retrieve
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *        required: false
 *        description: The offset to start the retrieval
 *      - in: query
 *        name: status
 *        schema:
 *          type: string
 *        required: false
 *        description: The status of the order
 *        enum: ["pending", "processing", "shipped", "delivered", "cancelled"]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: The orders were successfully retrieved
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/GenericResponse'
 *                - type: object
 *                  properties:
 *                    data:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/OrderItem'
 *                    meta:
 *                      $ref: '#/components/schemas/PaginationResponse'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenericResponse'
 *      404:
 *        description: No orders found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenericResponse'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenericResponse'
 */
router.get("/", cartController.getCurrentUserOrders);

/**
 * @swagger
 * /api/orders/{id}/items:
 *  get:
 *    summary: Get order items
 *    tags: [Orders]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The order id
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *        required: false
 *        description: The number of order items to retrieve
 *      - in: query
 *        name: offset
 *        schema:
 *          type: integer
 *        required: false
 *        description: The offset to start the retrieval
 *    responses:
 *      200:
 *        description: The order items were successfully retrieved
 *        content:
 *          application/json:
 *            schema:
 *              allOf:
 *                - $ref: '#/components/schemas/GenericResponse'
 *                - type: object
 *                  properties:
 *                    data:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/OrderItem'
 *                    meta:
 *                      $ref: '#/components/schemas/PaginationResponse'
 *      400:
 *        description: Bad request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenericResponse'
 *      404:
 *        description: The order was not found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenericResponse'
 *      500:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/GenericResponse'
 *              
 */
router.get("/:id/items", cartController.getOrderItems);

export default router;
