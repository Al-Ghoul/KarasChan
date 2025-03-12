import { Request, Response } from "express";
import { SigninInputSchema, SignupInputSchema } from "../types/inputSchemas";
import * as userService from "../services/userService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../env";

export async function createUser(req: Request, res: Response) {
  const input = req.body as SignupInputSchema;
  try {
    const password = await bcrypt.hash(input.password, 10);
    const createdUser = await userService.createUser({ ...input, password });
    res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "User signed up successfully",
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

export async function signinUser(req: Request, res: Response) {
  const input = req.body as SigninInputSchema;
  try {
    const user = await userService.findUserByEmail(input);
    const passwordMatch = await bcrypt.compare(input.password, user.password);
    if (!passwordMatch) {
      res.status(401).json({
        message: "Invalid credentials",
        status: "error",
        statusCode: 401,
        details: "Please check your input",
      });
      return;
    }

    const accessToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
      expiresIn: "30d",
      issuer: env.TOKEN_ISSUER,
    }); // usually this should be a shortlived token and paired with a refresh token, but we'll keep it simple for now

    res.status(200).json({
      status: "success",
      statusCode: 200,
      data: {
        accessToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      message: "Signed in successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "User not found") {
        res.status(404).json({
          message: "User not found",
          status: "error",
          statusCode: 404,
        });
      }
      return;
    }
    res.status(500).json({
      message: "Internal server error, please try again later",
      status: "error",
      statusCode: 500,
    });
  }
}
