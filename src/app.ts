import express from "express";
import authRoutes from "./routes/authRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";
import cartRoutes from "./routes/cartRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { env } from "process";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Express API with Swagger integration",
    },
  },
  apis: [path.resolve(__dirname, env.NODE_ENV === "development" ? "./routes/*.ts" : "./routes/*.js")],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export const app = express();

const theme = new SwaggerTheme();
const options = {
  customCss:
    theme.getBuffer(SwaggerThemeNameEnum.DARK) +
    ".swagger-ui .topbar { display: none }",
  explorer: false,
};
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs, options));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(authMiddleware);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
