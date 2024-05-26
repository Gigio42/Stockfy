/*
  Warnings:

  - You are about to drop the `Chapa_Item_Maquina` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Chapa_Item_Maquina";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Item_Maquina" (
    "id_item_maquina" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordem" INTEGER,
    "prazo" DATETIME,
    "status" TEXT,
    "maquinaId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "Item_Maquina_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "Maquina" ("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_Maquina_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id_item") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chapaItemMaquinaId" INTEGER NOT NULL DEFAULT 0,
    "part_number" TEXT NOT NULL DEFAULT '0',
    "status" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Item" ("id_item", "part_number", "status") SELECT "id_item", "part_number", "status" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_part_number_key" ON "Item"("part_number");
PRAGMA foreign_key_check("Item");
PRAGMA foreign_keys=ON;
