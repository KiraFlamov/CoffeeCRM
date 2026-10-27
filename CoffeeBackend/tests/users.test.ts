import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "../src/prisma/client";
import { app, bearer, createUser, loginAs } from "./helpers";

describe("Пользователи", () => {
  let admin: Awaited<ReturnType<typeof loginAs>>;

  beforeEach(async () => {
    admin = await loginAs("admin");
  });

  const createViaApi = (body: object) =>
    request(app).post("/api/users").set(bearer(admin.token)).send(body);

  it("администратор создаёт кассира, тот может войти", async () => {
    const res = await createViaApi({ email: "new@test.com", password: "pass1234" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: expect.any(Number), email: "new@test.com", role: "cashier" });

    await request(app)
      .post("/api/auth/login")
      .send({ email: "new@test.com", password: "pass1234" })
      .expect(200);
  });

  it("список пользователей не содержит паролей", async () => {
    await createUser("cashier");

    const res = await request(app).get("/api/users").set(bearer(admin.token));

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    for (const user of res.body) {
      expect(Object.keys(user).sort()).toEqual(["email", "id", "role"]);
    }
  });

  it("повторный email — 409, в том числе в другом регистре", async () => {
    await createUser("cashier", "cashier@test.com");

    const same = await createViaApi({ email: "cashier@test.com", password: "pass1234" });
    const otherCase = await createViaApi({ email: " Cashier@TEST.com", password: "pass1234" });

    expect(same.status).toBe(409);
    expect(otherCase.status).toBe(409);
    expect(await prisma.user.count()).toBe(2);
  });

  it("нельзя удалить другого администратора", async () => {
    const other = await createUser("admin", "other-admin@test.com");

    const res = await request(app).delete(`/api/users/${other.id}`).set(bearer(admin.token));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Администратора удалять нельзя");
    expect(await prisma.user.findUnique({ where: { id: other.id } })).not.toBeNull();
  });

  it("нельзя удалить самого себя", async () => {
    const res = await request(app)
      .delete(`/api/users/${admin.user.id}`)
      .set(bearer(admin.token));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Нельзя удалить самого себя");
  });

  it("кассира можно удалить, повторное удаление — 404", async () => {
    const cashier = await createUser("cashier");

    await request(app).delete(`/api/users/${cashier.id}`).set(bearer(admin.token)).expect(204);
    await request(app).delete(`/api/users/${cashier.id}`).set(bearer(admin.token)).expect(404);
  });
});
