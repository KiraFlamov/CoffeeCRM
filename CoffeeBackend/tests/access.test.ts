import jwt from "jsonwebtoken";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { prisma } from "../src/prisma/client";
import { app, bearer, loginAs } from "./helpers";

type Method = "get" | "post" | "put" | "delete";

describe("Доступ к API", () => {
  it.each<[Method, string]>([
    ["get", "/api/auth/me"],
    ["get", "/api/products"],
    ["post", "/api/products"],
    ["get", "/api/orders"],
    ["post", "/api/orders"],
    ["get", "/api/users"],
    ["get", "/api/dashboard"],
  ])("%s %s без токена — 401", async (method, url) => {
    const res = await request(app)[method](url);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Требуется авторизация");
  });

  it("токен, подписанный чужим ключом, — 401", async () => {
    const { user } = await loginAs("admin");
    const forged = jwt.sign({ id: user.id, role: "admin" }, "not-the-real-secret");

    const res = await request(app).get("/api/users").set(bearer(forged));

    expect(res.status).toBe(401);
  });

  it.each<[Method, string]>([
    ["get", "/api/users"],
    ["post", "/api/users"],
    ["delete", "/api/users/1"],
    ["get", "/api/dashboard"],
    ["post", "/api/products"],
    ["put", "/api/products/1"],
    ["delete", "/api/products/1"],
  ])("кассир на %s %s — 403", async (method, url) => {
    const { token } = await loginAs("cashier");

    const res = await request(app)[method](url).set(bearer(token)).send({});

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Недостаточно прав");
  });

  it("кассир видит товары и заказы", async () => {
    const { token } = await loginAs("cashier");

    await request(app).get("/api/products").set(bearer(token)).expect(200);
    await request(app).get("/api/orders").set(bearer(token)).expect(200);
  });

  it("удалённый пользователь сразу теряет доступ, даже с действующим токеном", async () => {
    const admin = await loginAs("admin");
    const cashier = await loginAs("cashier");

    await request(app).get("/api/orders").set(bearer(cashier.token)).expect(200);
    await request(app)
      .delete(`/api/users/${cashier.user.id}`)
      .set(bearer(admin.token))
      .expect(204);

    const res = await request(app).get("/api/orders").set(bearer(cashier.token));

    expect(res.status).toBe(401);
  });

  it("смена роли применяется сразу, без перевыпуска токена", async () => {
    const { user, token } = await loginAs("admin");

    await request(app).get("/api/users").set(bearer(token)).expect(200);
    await prisma.user.update({ where: { id: user.id }, data: { role: "cashier" } });

    const res = await request(app).get("/api/users").set(bearer(token));

    expect(res.status).toBe(403);
  });
});
