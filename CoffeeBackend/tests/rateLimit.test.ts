import request from "supertest";
import { describe, expect, it } from "vitest";
import { LOGIN_ATTEMPTS } from "../src/routes/auth";
import { PASSWORD, app, createUser } from "./helpers";

// Отдельный файл: у Vitest свои модули на каждый файл, значит, и свой счётчик попыток
describe("Ограничение попыток входа", () => {
  const login = (email: string, password: string) =>
    request(app).post("/api/auth/login").send({ email, password });

  it("успешные входы не расходуют лимит", async () => {
    const user = await createUser("cashier");

    for (let i = 0; i < LOGIN_ATTEMPTS + 2; i++) {
      await login(user.email, PASSWORD).expect(200);
    }
  });

  it("после серии неудачных попыток блокируется даже верный пароль", async () => {
    const user = await createUser("cashier");

    for (let i = 0; i < LOGIN_ATTEMPTS; i++) {
      await login(user.email, "wrong-password").expect(401);
    }

    const res = await login(user.email, PASSWORD);

    expect(res.status).toBe(429);
    expect(res.body.message).toBe("Слишком много попыток входа, попробуйте через 15 минут");
  });
});
