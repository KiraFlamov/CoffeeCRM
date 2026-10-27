import request from "supertest";
import { describe, expect, it } from "vitest";
import { PASSWORD, app, bearer, createUser } from "./helpers";

const login = (email: string, password: string) =>
  request(app).post("/api/auth/login").send({ email, password });

describe("Вход", () => {
  it("с правильными данными выдаёт токен и данные пользователя без пароля", async () => {
    const user = await createUser("cashier");

    const res = await login(user.email, PASSWORD);

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toEqual({ id: user.id, email: user.email, role: "cashier" });

    const me = await request(app).get("/api/auth/me").set(bearer(res.body.token));
    expect(me.status).toBe(200);
    expect(me.body).toEqual(res.body.user);
  });

  it("email не зависит от регистра и пробелов", async () => {
    await createUser("cashier", "cashier@test.com");

    const res = await login("  Cashier@TEST.com ", PASSWORD);

    expect(res.status).toBe(200);
  });

  it("неверный пароль и несуществующий email дают одинаковый ответ", async () => {
    const user = await createUser("admin");

    const wrongPassword = await login(user.email, "wrong-password");
    const unknownEmail = await login("nobody@test.com", PASSWORD);

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    expect(wrongPassword.body).toEqual({ message: "Неверный email или пароль" });
    expect(unknownEmail.body).toEqual(wrongPassword.body);
  });

  it("без пароля — 400 с понятным сообщением", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "admin@test.com" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Введите пароль");
  });
});
