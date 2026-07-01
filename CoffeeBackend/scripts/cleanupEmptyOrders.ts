import { prisma } from "../src/prisma/client";

async function cleanupEmptyOrders() {
  try {
    console.log("🧹 Начинаем очистку пустых заказов...");

    // Найдём все пустые заказы
    const emptyOrders = await prisma.order.findMany({
      where: {
        items: {
          none: {},
        },
      },
    });

    console.log(`📊 Найдено пустых заказов: ${emptyOrders.length}`);

    if (emptyOrders.length === 0) {
      console.log("✅ Нет пустых заказов для удаления");
      return;
    }

    // Удаляем пустые заказы
    const deleted = await prisma.order.deleteMany({
      where: {
        items: {
          none: {},
        },
      },
    });

    console.log(`✅ Удалено заказов: ${deleted.count}`);
  } catch (error) {
    console.error("❌ Ошибка при очистке заказов:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupEmptyOrders();
