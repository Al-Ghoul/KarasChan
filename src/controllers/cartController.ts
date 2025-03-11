import { Request, Response } from "express";
import * as cartService from "../services/cartService";
import { paginationInputSchema } from "../types/inputSchemas";

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
      data: { cart: createdCart },
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
