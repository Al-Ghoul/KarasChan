import { Request, Response } from "express";
import * as cartService from "../services/cartService";
import {
  type CartItemInputSchema,
  itemIdSchema,
  itemQuantityInputSchema,
  orderListInputSchema,
  paginationInputSchema,
} from "../types/inputSchemas";
import * as productService from "../services/productService";

export async function createCartForCurrentUser(req: Request, res: Response) {
  const currentUser = req.user;
  try {
    const userCart = await cartService.getCartByUserId(currentUser.userId);
    if (userCart) {
      res.status(409).json({
        message: "Cart already exists",
        status: "error",
        statusCode: 409,
        details: "You already have a cart",
      });
      return;
    }
    const createdCart = await cartService.createCart(currentUser.userId);
    res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Cart created successfully",
      data: createdCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}

export async function getCurrentUserCart(req: Request, res: Response) {
  const currentUser = req.user;
  try {
    const userCart = await cartService.getCartByUserId(currentUser.userId);
    if (!userCart) {
      res.status(404).json({
        message: "Cart not found",
        status: "error",
        statusCode: 404,
        details: "You don't have a cart",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Cart retrieved successfully",
      data: userCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}

export async function getCartItems(req: Request, res: Response) {
  const input = paginationInputSchema.safeParse(req.query);
  if (!input.success) {
    const errors = input.error.errors;
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation failed",
      errors: errors.map((error) => {
        return { path: error.path[0], message: error.message };
      }),
    });
    return;
  }
  const limit = input.data.limit ?? 10;
  const offset = input.data.offset ?? 0;
  try {
    const userCart = await cartService.getCartByUserId(req.user.userId);
    if (!userCart) {
      res.status(404).json({
        message: "Cart not found",
        status: "error",
        statusCode: 404,
        details: "You don't have a cart",
      });
      return;
    }
    const cartItems = await cartService.getCartItems({
      cartId: userCart.id,
      limit,
      offset,
    });
    const totalCartItems = await cartService.getTotalCartItemsCount(
      userCart.id,
    );
    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Cart items retrieved successfully",
      meta: {
        has_next_page: cartItems.length > limit,
        has_previous_page: offset > 0,
        total: totalCartItems[0].count,
        count:
          cartItems.length > limit ? cartItems.length - 1 : cartItems.length,
        current_page: Math.floor(offset / limit) + 1,
        per_page: limit,
        last_page: Math.ceil(Number(totalCartItems[0].count) / limit),
      },
      data: cartItems.shift(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}

export async function addItemToCart(req: Request, res: Response) {
  const { productId, quantity } = req.body as CartItemInputSchema;
  try {
    const getProduct = await productService.getProductById(productId);
    const userCart = await cartService.getCartByUserId(req.user.userId);
    if (!userCart) {
      res.status(404).json({
        message: "Cart not found",
        status: "error",
        statusCode: 404,
        details: "You don't have a cart",
      });
      return;
    }
    if (!getProduct) {
      res.status(404).json({
        message: "Product not found",
        status: "error",
        statusCode: 404,
        details: "The product you are trying to add to the cart does not exist",
      });
      return;
    }

    if (getProduct.quantity < quantity) {
      res.status(400).json({
        message: "Quantity not available",
        status: "error",
        statusCode: 400,
        details:
          "The product you are trying to add to the cart is out of stock",
      });
      return;
    }

    const createdCartItem = await cartService.addItemToCart({
      cartId: userCart.id,
      productId,
      quantity,
    });
    res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Cart item added successfully",
      data: createdCartItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}

export async function deleteCartItem(req: Request, res: Response) {
  const input = itemIdSchema.safeParse(req.params);
  if (!input.success) {
    const errors = input.error.errors;
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation failed",
      errors: errors.map((error) => {
        return { path: error.path[0], message: error.message };
      }),
    });
    return;
  }
  try {
    const userCart = await cartService.getCartByUserId(req.user.userId);
    if (!userCart) {
      res.status(404).json({
        message: "Cart not found",
        status: "error",
        statusCode: 404,
        details: "You don't have a cart",
      });
      return;
    }
    const deletedItem = await cartService.deleteCartItem({
      cartId: userCart.id,
      itemId: input.data.id,
    });
    if (!deletedItem) {
      res.status(404).json({
        message: "Cart item not found",
        status: "error",
        statusCode: 404,
        details: "The cart item you are trying to delete does not exist",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Cart item deleted successfully",
      data: deletedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}

export async function updateCartItemQuantity(req: Request, res: Response) {
  const idInput = itemIdSchema.safeParse(req.params);
  const quantityInput = itemQuantityInputSchema.safeParse(req.body);
  if (!idInput.success || !quantityInput.success) {
    const errors = idInput.error?.errors || quantityInput.error?.errors;
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation failed",
      errors: errors?.map((error) => {
        return { path: error.path[0], message: error.message };
      }),
    });
    return;
  }
  try {
    const userCart = await cartService.getCartByUserId(req.user.userId);
    if (!userCart) {
      res.status(404).json({
        message: "Cart not found",
        status: "error",
        statusCode: 404,
        details: "You don't have a cart",
      });
      return;
    }

    const product = await productService.getProductByCartId({
      cartId: userCart.id,
      itemId: idInput.data.id,
    });

    if (!product) {
      res.status(404).json({
        message: "Cart item not found",
        status: "error",
        statusCode: 404,
        details: "The cart item you are trying to update does not exist",
      });
      return;
    }
    if (product.quantity < quantityInput.data.quantity) {
      res.status(400).json({
        message: "You cannot add more items than the quantity in stock",
        status: "error",
        statusCode: 400,
        details: "Try adding less items or reduce the quantity",
      });
      return;
    }

    const updatedItem = await cartService.updateCartItemQuantity({
      cartId: userCart.id,
      itemId: idInput.data.id,
      quantity: quantityInput.data.quantity,
    });
    if (!updatedItem) {
      res.status(404).json({
        message: "Cart item not found",
        status: "error",
        statusCode: 404,
        details: "The cart item you are trying to update does not exist",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Cart item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const cartItems = await cartService.getCartItemsByUserId(req.user.userId);

    if (!cartItems || cartItems.length === 0) {
      res.status(404).json({
        message: "Cart not found",
        status: "error",
        statusCode: 404,
        details: "You don't have an active cart or its empty",
      });
      return;
    }

    const totalAmount = cartItems.reduce((acc, item) => {
      return acc + parseFloat(item.price) * item.quantity;
    }, 0);

    const createdOrder = await cartService.createOrder({
      cartId: cartItems[0].cartId!,
      userId: req.user.userId,
      totalAmount: totalAmount.toString(),
    });

    await cartService.createOrderItems(
      cartItems.map((item) => ({
        orderId: createdOrder.id,
        productId: item.id,
        quantity: item.quantity,
        priceAtPurchase: item.price,
      })),
    );

    await cartService.updateCartStatus({
      cartId: cartItems[0].cartId!,
      status: "checked_out",
    });

    res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Order created successfully",
      data: createdOrder,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}

export async function getCurrentUserOrders(req: Request, res: Response) {
  const currentUser = req.user;
  const input = orderListInputSchema.safeParse(req.query);

  if (!input.success) {
    const errors = input.error?.errors;
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation failed",
      errors: errors?.map((error) => {
        return { path: error.path[0], message: error.message };
      }),
    });
    return;
  }

  const limit = input.data.limit ?? 10;
  const offset = input.data.offset ?? 0;

  try {
    const userOrders = await cartService.getOrdersByUserId({
      userId: currentUser.userId,
      fulfillmentStatus: input.data.status,
      limit,
      offset,
    });
    if (!userOrders || userOrders.length === 0) {
      res.status(404).json({
        message: "Orders not found",
        status: "error",
        statusCode: 404,
        details: "You don't have any orders",
      });
      return;
    }
    const totalOrders = await cartService.getTotalOrdersCountByUserId(
      currentUser.userId,
      input.data.status,
    );
    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Orders retrieved successfully",
      meta: {
        has_next_page: userOrders.length > limit,
        has_previous_page: offset > 0,
        total: totalOrders[0].count,
        count:
          userOrders.length > limit ? userOrders.length - 1 : userOrders.length,
        current_page: Math.floor(offset / limit) + 1,
        per_page: limit,
        last_page: Math.ceil(Number(totalOrders[0].count) / limit),
      },
      data: userOrders.length > limit ? userOrders.shift() : userOrders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}

export async function getOrderItems(req: Request, res: Response) {
  const input = itemIdSchema.safeParse(req.params);
  const paginationInput = paginationInputSchema.safeParse(req.query);
  if (!input.success || !paginationInput.success) {
    const errors = input.error?.errors || paginationInput.error?.errors;
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation failed",
      errors: errors?.map((error) => {
        return { path: error.path[0], message: error.message };
      }),
    });
    return;
  }
  const limit = paginationInput.data.limit ?? 10;
  const offset = paginationInput.data.offset ?? 0;
  try {
    const orderItems = await cartService.getOrderItemsByOrderId({
      userId: req.user.userId,
      orderId: input.data.id,
      limit,
      offset,
    });
    if (!orderItems || orderItems.length === 0) {
      res.status(404).json({
        message: "Order items not found",
        status: "error",
        statusCode: 404,
        details: "You don't have any order items or this order doesn't belong to you",
      });
      return;
    }

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Order items retrieved successfully",
      data: orderItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}
