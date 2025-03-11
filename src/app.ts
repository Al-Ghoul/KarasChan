import express from "express";
import authRoutes from "./routes/authRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";
import cartRoutes from "./routes/cartRoutes";
import productRoutes from "./routes/productRoutes";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(authMiddleware);
app.use("/api/carts", cartRoutes);
