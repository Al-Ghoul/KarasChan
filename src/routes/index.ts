/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth: # arbitrary name for the security scheme
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        fullName:
 *          type: string
 *        email:
 *           type: string
 *           format: email
 *        address:
 *           type: string
 *        createdAt:
 *           type: string
 *           format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    GenericResponse:
 *      type: object
 *      properties:
 *        status:
 *          type: string
 *          description: The status of the response
 *          required: true
 *          title: The status of the response
 *        statusCode:
 *          type: number
 *          description: The status code of the response
 *          required: true
 *          title: The status code of the response
 *        message:
 *          type: string
 *          description: The error message
 *          required: true
 *          title: The error message
 *        details:
 *          type: string
 *          description: The error details
 *          required: false
 *          title: The error details
 *        errors:
 *          required: false
 *          title: The error messages
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              path:
 *                type: string
 *                description: The path of the error
 *                required: true
 *                title: The path of the error
 *              message:
 *                type: string
 *                description: The error message
 *                required: true
 *                title: The error message
 *    PaginationResponse:
 *      type: object
 *      properties:
 *        has_next_page:
 *          type: boolean
 *          description: Whether there are more next pages 
 *          required: true
 *          title: Whether there are more next pages
 *          example: true
 *        has_previous_page:
 *          type: boolean
 *          description: Whether there are previous pages
 *          required: true
 *          title: Whether there are previous pages
 *          example: true
 *        total:
 *          type: number
 *          description: The total number of items
 *          required: true
 *          title: The total number of items
 *          example: 100
 *          format: int32
 *        count:
 *          type: number
 *          description: The number of items in the current page
 *          required: true
 *          title: The number of items in the current page
 *          example: 10
 *          format: int32
 *        current_page:
 *          type: number
 *          description: The current page number
 *          required: true
 *          title: The current page number
 *          example: 1
 *          format: int32
 *        per_page:
 *          type: number
 *          description: The number of items per page
 *          required: true
 *          title: The number of items per page
 *          example: 10
 *          format: int32
 *        last_page:
 *          type: number
 *          description: The last page number
 *          required: true
 *          title: The last page number
 *          example: 10
 *          format: int32
 *    Product:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        image:
 *          type: string
 *        description:
 *          type: string
 *        price:
 *          type: number
 *          format: float
 *        quantity:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    Cart:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        userId:
 *          type: string
 *        status:
 *          type: string
 *          enum:
 *            - active
 *            - archived
 *            - checked_out
 *          title: The status of the cart
 *        checkedOutAt:
 *          type: string
 *          format: date-time
 *        archivedAt:
 *          type: string
 *          format: date-time
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    CartItem:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        cartId:
 *          type: string
 *        productId:
 *          type: string
 *        quantity:
 *          type: number
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    Order:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        cartId:
 *          type: string
 *        userId:
 *          type: string
 *        fulfillmentStatus:
 *          type: string
 *          enum:
 *            - pending
 *            - processing
 *            - shipped
 *            - delivered
 *            - cancelled
 *          title: The fulfillment status of the order
 *        totalAmount:
 *          type: number
 *          format: float
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    OrderItem:
 *      type: object
 *      properties:
 *        id:
 *          type: string
 *        orderId:
 *          type: string
 *        productId:
 *          type: string
 *        quantity:
 *          type: number
 *        priceAtPurchase:
 *          type: number
 *          format: float
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
