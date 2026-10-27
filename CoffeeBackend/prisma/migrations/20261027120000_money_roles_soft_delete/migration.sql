-- Роли: TEXT -> enum
CREATE TYPE "Role" AS ENUM ('admin', 'cashier');

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING ("role"::"Role");
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'cashier';

-- Деньги: рубли (DOUBLE PRECISION) -> копейки (INTEGER)
ALTER TABLE "Product" ALTER COLUMN "price" TYPE INTEGER USING (ROUND("price" * 100)::INTEGER);
ALTER TABLE "Order" ALTER COLUMN "total" TYPE INTEGER USING (ROUND("total" * 100)::INTEGER);

-- Мягкое удаление товаров
ALTER TABLE "Product" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Снимок названия и цены товара в позиции заказа
ALTER TABLE "OrderItem" ADD COLUMN "name" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN "price" INTEGER;

UPDATE "OrderItem" oi
SET "name" = p."name", "price" = p."price"
FROM "Product" p
WHERE p."id" = oi."productId";

ALTER TABLE "OrderItem" ALTER COLUMN "name" SET NOT NULL;
ALTER TABLE "OrderItem" ALTER COLUMN "price" SET NOT NULL;

-- Товар больше нельзя удалить физически, если он есть в заказах
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productId_fkey";
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
