import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/prisma/client";
import { app, bearer, createProduct, loginAs, placeOrder } from "./helpers";

describe("Товары", () => {
  let token: string;

  beforeEach(async () => {
    ({ token } = await loginAs("admin"));
  });

  const getOrder = (id: number) =>
    request(app).get(`/api/orders/${id}`).set(bearer(token)).expect(200);

  it("администратор создаёт товар", async () => {
    const res = await request(app)
      .post("/api/products")
      .set(bearer(token))
      .send({ name: "  Флэт уайт  ", price: 22000 });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ name: "Флэт уайт", price: 22000, isActive: true });
  });

  it.each([
    ["дробная цена в копейках", { name: "Латте", price: 199.5 }],
    ["отрицательная цена", { name: "Латте", price: -100 }],
    ["пустое название", { name: "   ", price: 15000 }],
  ])("%s отклоняется", async (_label, body) => {
    const res = await request(app).post("/api/products").set(bearer(token)).send(body);

    expect(res.status).toBe(400);
    expect(await prisma.product.count()).toBe(0);
  });

  it("после снятия с продажи товар пропадает из каталога, а история заказов не меняется", async () => {
    const latte = await createProduct("Латте", 15000);
    const order = await placeOrder(token, [{ productId: latte.id, quantity: 2 }]);

    await request(app).delete(`/api/products/${latte.id}`).set(bearer(token)).expect(204);

    const catalog = await request(app).get("/api/products").set(bearer(token));
    expect(catalog.body).toEqual([]);
    await request(app).get(`/api/products/${latte.id}`).set(bearer(token)).expect(404);

    // Запись осталась в базе — на неё ссылаются позиции заказов
    expect(await prisma.product.findUnique({ where: { id: latte.id } })).toMatchObject({
      isActive: false,
    });

    const history = await getOrder(order.body.id);
    expect(history.body).toEqual(order.body);
  });

  it("смена цены и названия не меняет старые заказы, новые идут по новой цене", async () => {
    const latte = await createProduct("Латте", 15000);
    const oldOrder = await placeOrder(token, [{ productId: latte.id, quantity: 2 }]);

    await request(app)
      .put(`/api/products/${latte.id}`)
      .set(bearer(token))
      .send({ name: "Латте большой", price: 18000 })
      .expect(200);

    const history = await getOrder(oldOrder.body.id);
    expect(history.body.total).toBe(30000);
    expect(history.body.items[0]).toMatchObject({ name: "Латте", price: 15000 });

    const newOrder = await placeOrder(token, [{ productId: latte.id, quantity: 2 }]);
    expect(newOrder.body.total).toBe(36000);
    expect(newOrder.body.items[0]).toMatchObject({ name: "Латте большой", price: 18000 });
  });

  it("снятый с продажи товар нельзя изменить или удалить повторно", async () => {
    const latte = await createProduct("Латте", 15000, false);

    await request(app)
      .put(`/api/products/${latte.id}`)
      .set(bearer(token))
      .send({ price: 18000 })
      .expect(404);
    await request(app).delete(`/api/products/${latte.id}`).set(bearer(token)).expect(404);
  });

  it("пустое обновление отклоняется", async () => {
    const latte = await createProduct("Латте", 15000);

    const res = await request(app).put(`/api/products/${latte.id}`).set(bearer(token)).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Нечего обновлять");
  });
});
