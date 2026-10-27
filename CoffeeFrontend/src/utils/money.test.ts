import { describe, expect, it } from "vitest";
import { formatMoney, kopecksToRubles, rublesToKopecks } from "./money";

// Intl ставит неразрывные пробелы — для сравнения заменяем их обычными
const format = (kopecks: number) => formatMoney(kopecks).replace(/\s/g, " ");

describe("formatMoney", () => {
  it.each([
    [19999, "199,99 ₽"],
    [30000, "300 ₽"],
    [15050, "150,5 ₽"],
    [5, "0,05 ₽"],
    [0, "0 ₽"],
    [123456789, "1 234 567,89 ₽"],
  ])("%i коп. → %s", (kopecks, expected) => {
    expect(format(kopecks)).toBe(expected);
  });
});

describe("rublesToKopecks", () => {
  it.each([
    ["199.99", 19999],
    ["199,99", 19999],
    ["150", 15000],
    ["  150  ", 15000],
    ["0,5", 50],
    ["0.01", 1],
    // 19.99 * 100 = 1998.9999999999998 во float — должно округлиться
    ["19.99", 1999],
    ["1.15", 115],
  ])("%j → %i", (input, expected) => {
    expect(rublesToKopecks(input)).toBe(expected);
  });

  it.each(["", "   ", "abc", "12р", "1,2,3", "0", "0,00", "-5", "Infinity"])(
    "некорректный ввод %j → null",
    (input) => {
      expect(rublesToKopecks(input)).toBeNull();
    }
  );
});

describe("kopecksToRubles", () => {
  it.each([
    [19999, "199.99"],
    [15000, "150"],
    [1, "0.01"],
  ])("%i → %s", (kopecks, expected) => {
    expect(kopecksToRubles(kopecks)).toBe(expected);
  });

  it("значение для поля ввода переводится обратно без потерь", () => {
    expect(rublesToKopecks(kopecksToRubles(19999))).toBe(19999);
  });
});
