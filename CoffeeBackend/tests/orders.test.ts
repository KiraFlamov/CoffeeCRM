import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/prisma/client";
import { app, bearer, createProduct, loginAs, placeOrder } from "./helpers";

describe("Заказы", () => {
  let token: string;

  beforeEach(async () => {
    ({ token } = await loginAs("cashier"));
  });

  it("сумма считается по ценам из базы, цена от клиента игнорируется", async () => {
    const latte = await createProduct("Латте", 25050);
    const raf = await createProduct("Раф", 20000);

    const res = await request(app)
      .post("/api/orders")
      .set(bearer(token))
      .send({
        total: 1,
        items: [
          { productId: latte.id, quantity: 2, price: 1 },
          { productId: raf.id, quantity: 1, price: 1 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.total).toBe(2 * 25050 + 20000);
    expect(res.body.items).toEqual([
      expect.objectContaining({ productId: latte.id, name: "Латте", price: 25050, quantity: 2 }),
      expect.objectContaining({ productId: raf.id, name: "Раф", price: 20000, quantity: 1 }),
    ]);
  });

  it("повторяющиеся позиции одного товара объединяются", async () => {
    const latte = await createProduct("Латте", 15000);

    const res = await placeOrder(token, [
      { productId: latte.id, quantity: 2 },
      { productId: latte.id, quantity: 3 },
    ]);

    expect(res.status).toBe(201);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.items[0].quantity).toBe(5);
    expect(res.body.total).toBe(5 * 15000);
  });

  it.each([
    ["отрицательное", -1],
    ["нулевое", 0],
    ["дробное", 1.5],
    ["слишком большое", 101],
  ])("%s количество отклоняется", async (_label, quantity) => {
    const latte = await createProduct("Латте", 15000);

    const res = await placeOrder(token, [{ productId: latte.id, quantity }]);

    expect(res.status).toBe(400);
    expect(await prisma.order.count()).toBe(0);
  });

  it("пустой заказ отклоняется", async () => {
    const res = await placeOrder(token, []);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Заказ не может быть пустым");
  });

  it("снятый с продажи товар нельзя заказать — заказ не создаётся целиком", async () => {
    const latte = await createProduct("Латте", 15000);
    const archived = await createProduct("Старый раф", 20000, false);

    const res = await placeOrder(token, [
      { productId: latte.id, quantity: 1 },
      { productId: archived.id, quantity: 1 },
    ]);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain(String(archived.id));
    expect(await prisma.order.count()).toBe(0);
    expect(await prisma.orderItem.count()).toBe(0);
  });

  it("несуществующий товар — 400", async () => {
    const res = await placeOrder(token, [{ productId: 9999, quantity: 1 }]);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("9999");
  });

  it("созданный заказ виден в истории и по id", async () => {
    const latte = await createProduct("Латте", 15000);
    const created = await placeOrder(token, [{ productId: latte.id, quantity: 1 }]);

    const list = await request(app).get("/api/orders").set(bearer(token));
    const single = await request(app).get(`/api/orders/${created.body.id}`).set(bearer(token));

    expect(list.body).toEqual([created.body]);
    expect(single.body).toEqual(created.body);
  });

  it("несуществующий заказ — 404, некорректный id — 400", async () => {
    await request(app).get("/api/orders/9999").set(bearer(token)).expect(404);
    await request(app).get("/api/orders/abc").set(bearer(token)).expect(400);
  });
});
