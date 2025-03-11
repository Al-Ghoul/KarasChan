import express from "express";
import authRoutes from "./routes/authRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";
import cartRoutes from "./routes/cartRoutes";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.use(authMiddleware);
app.use("/api/carts", cartRoutes);
