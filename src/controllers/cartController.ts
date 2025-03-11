import { Request, Response } from "express";
import * as cartService from "../services/cartService";

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
