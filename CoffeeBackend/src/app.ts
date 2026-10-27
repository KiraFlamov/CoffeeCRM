import express, { Router } from "express";
import cors from "cors";

import { config } from "./config";
import authRouter from "./routes/auth";
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import usersRouter from "./routes/users";
import dashboardRouter from "./routes/dashboard";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.set("trust proxy", config.TRUST_PROXY);
  app.use(cors({ origin: config.CLIENT_ORIGINS }));
  app.use(express.json());

  const api = Router();

  api.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  api.use("/auth", authRouter);
  api.use("/products", productsRouter);
  api.use("/orders", ordersRouter);
  api.use("/users", usersRouter);
  api.use("/dashboard", dashboardRouter);

  app.use("/api", api);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
