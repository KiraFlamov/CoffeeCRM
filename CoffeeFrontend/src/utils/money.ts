const rubFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// 19999 -> "199,99 ₽"
export const formatMoney = (kopecks: number) => rubFormatter.format(kopecks / 100);

// "199,99" -> 19999; null, если значение некорректно
export const rublesToKopecks = (value: string): number | null => {
  const rubles = Number(value.trim().replace(",", "."));

  if (!value.trim() || !Number.isFinite(rubles) || rubles <= 0) {
    return null;
  }

  return Math.round(rubles * 100);
};

// 19999 -> "199.99" (для полей ввода)
export const kopecksToRubles = (kopecks: number) => String(kopecks / 100);
