import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { app, bearer, createProduct, loginAs, placeOrder } from "./helpers";

describe("Дашборд", () => {
  let token: string;

  beforeEach(async () => {
    ({ token } = await loginAs("admin"));
  });

  it("без заказов всё по нулям", async () => {
    const res = await request(app).get("/api/dashboard").set(bearer(token));

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ products: 0, orders: 0, revenue: 0, averageCheck: 0 });
  });

  it("выручка и средний чек считаются по всем заказам, учитываются только активные товары", async () => {
    const cappuccino = await createProduct("Капучино", 30000);
    const latte = await createProduct("Латте", 15000);
    const raf = await createProduct("Раф", 20000);
    await createProduct("Снятый товар", 10000, false);

    await placeOrder(token, [{ productId: cappuccino.id, quantity: 1 }]).expect(201);
    await placeOrder(token, [{ productId: latte.id, quantity: 1 }]).expect(201);
    await placeOrder(token, [{ productId: raf.id, quantity: 1 }]).expect(201);

    const res = await request(app).get("/api/dashboard").set(bearer(token));

    expect(res.body).toEqual({
      products: 3,
      orders: 3,
      revenue: 65000,
      // 65000 / 3 = 21666.67 — округляется до целых копеек
      averageCheck: 21667,
    });
  });
});
