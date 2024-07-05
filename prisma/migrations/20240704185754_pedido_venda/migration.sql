-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "part_number" TEXT NOT NULL DEFAULT '0',
    "pedido_venda" INTEGER NOT NULL DEFAULT 0,
    "prioridade" INTEGER,
    "status" TEXT NOT NULL DEFAULT '',
    "reservado_por" TEXT
);
INSERT INTO "new_Item" ("id_item", "part_number", "prioridade", "reservado_por", "status") SELECT "id_item", "part_number", "prioridade", "reservado_por", "status" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
CREATE UNIQUE INDEX "Item_part_number_key" ON "Item"("part_number");
PRAGMA foreign_key_check("Item");
PRAGMA foreign_keys=ON;