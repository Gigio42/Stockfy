/*
  Warnings:

  - You are about to drop the column `chapaItemMaquinaId` on the `Item` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "part_number" TEXT NOT NULL DEFAULT '0',
    "status" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Item" ("id_item", "part_number", "status") SELECT "id_item", "part_number", "status" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_part_number_key" ON "Item"("part_number");
PRAGMA foreign_key_check("Item");
PRAGMA foreign_keys=ON;
