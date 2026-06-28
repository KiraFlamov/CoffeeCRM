import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import dashboardRouter from "./routes/dashboard";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.json({
    message: "CoffeeCRM API работает",
  });
});

const PORT = Number(process.env.PORT) || 3000;

if (!process.env.DATABASE_URL) {
  console.error("Missing DATABASE_URL in environment");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("Missing JWT_SECRET in environment");
  process.exit(1);
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
