/*
  Warnings:

  - You are about to drop the column `corte` on the `Item_Maquina` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item_Maquina" (
    "id_item_maquina" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prazo" TEXT,
    "ordem" INTEGER,
    "ordemTotal" INTEGER,
    "executor" TEXT,
    "finalizado" BOOLEAN NOT NULL DEFAULT false,
    "medida" TEXT,
    "maquinaId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "op" TEXT,
    "sistema" TEXT,
    "cliente" TEXT,
    "quantidade" INTEGER,
    "colaborador" TEXT,
    CONSTRAINT "Item_Maquina_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "Maquina" ("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_Maquina_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id_item") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item_Maquina" ("executor", "finalizado", "id_item_maquina", "itemId", "maquinaId", "ordem", "ordemTotal", "prazo") SELECT "executor", "finalizado", "id_item_maquina", "itemId", "maquinaId", "ordem", "ordemTotal", "prazo" FROM "Item_Maquina";
DROP TABLE "Item_Maquina";
ALTER TABLE "new_Item_Maquina" RENAME TO "Item_Maquina";
PRAGMA foreign_key_check("Item_Maquina");
PRAGMA foreign_keys=ON;
