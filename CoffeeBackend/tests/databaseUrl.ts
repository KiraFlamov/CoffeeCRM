// Тесты работают на отдельной базе, чтобы не трогать рабочие данные.
// По умолчанию имя берётся из DATABASE_URL с суффиксом: CoffeeCRM -> CoffeeCRM_test.
// Можно задать явно через TEST_DATABASE_URL / E2E_DATABASE_URL.
export const deriveDatabaseUrl = (suffix: "_test" | "_e2e"): string => {
  const explicit =
    suffix === "_test" ? process.env.TEST_DATABASE_URL : process.env.E2E_DATABASE_URL;
  const base = explicit ?? process.env.DATABASE_URL;

  if (!base) {
    throw new Error("Задайте DATABASE_URL в CoffeeBackend/.env");
  }

  const url = new URL(base);

  if (!explicit) {
    url.pathname += suffix;
  }

  // Тесты очищают таблицы — защищаемся от запуска на рабочей базе
  if (!url.pathname.endsWith(suffix)) {
    throw new Error(`Имя тестовой базы должно заканчиваться на ${suffix}`);
  }

  return url.toString();
};
