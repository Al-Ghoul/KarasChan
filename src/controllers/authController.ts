import { Request, Response } from "express";
import { UserInputSchema } from "../types/inputSchemas";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";

export async function createUser(req: Request, res: Response) {
  const input = req.body as UserInputSchema;
  try {
    const password = await bcrypt.hash(input.password, 10);
    const createdUser = await userService.createUser({ ...input, password });
    res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "User created successfully",
      data: createdUser,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User already exists") {
        res.status(409).json({
          message: "User already exists",
          status: "error",
          statusCode: 409,
          details: "Please check your input",
        });
      }
      return;
    }
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
      details: "Something went wrong",
    });
  }
}
