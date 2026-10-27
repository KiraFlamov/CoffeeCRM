import { describe, expect, it } from "vitest";
import { homePath } from "./homePath";

describe("homePath", () => {
  it("администратор попадает на дашборд, кассир — на кассу", () => {
    expect(homePath("admin")).toBe("/dashboard");
    expect(homePath("cashier")).toBe("/pos");
  });
});
