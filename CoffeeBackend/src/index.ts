import express from "express";
import cors from "cors";

import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import dashboardRouter from "./routes/dashboard";
import authRouter from "./routes/auth";
import usersRouter from "./routes/users";

const app = express();

app.use(cors());
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

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
