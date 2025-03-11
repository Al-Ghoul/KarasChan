import { Request, Response } from "express";
import * as productService from "../services/productService";
import { paginationInputSchema } from "../types/inputSchemas";

export async function getProducts(req: Request, res: Response) {
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
  const limit = input.data?.limit ?? 10;
  const offset = input.data?.offset ?? 0;
  try {
    const products = await productService.getProducts({ limit, offset });
    const totalProducts = await productService.getTotalProductsCount();
    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Products retrieved successfully",
      meta: {
        has_next_page: products.length > limit,
        has_previous_page: offset > 0,
        total: totalProducts[0].count,
        count: products.length > limit ? products.length - 1 : products.length,
        current_page: Math.floor(offset / limit) + 1,
        per_page: limit,
        last_page: Math.ceil(Number(totalProducts[0].count) / limit),
      },
      data: products.length > limit ? products.shift() : products,
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
