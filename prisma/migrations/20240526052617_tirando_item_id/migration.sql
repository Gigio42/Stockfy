/*
  Warnings:

  - You are about to drop the column `itemId` on the `Chapa_Item_Maquina` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapa_Item_Maquina" (
    "id_chapa_item_maquina" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordem" INTEGER,
    "prazo" DATETIME,
    "status" TEXT,
    "maquinaId" INTEGER NOT NULL,
    "chapaItemId" INTEGER NOT NULL,
    CONSTRAINT "Chapa_Item_Maquina_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "Maquina" ("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapa_Item_Maquina_chapaItemId_fkey" FOREIGN KEY ("chapaItemId") REFERENCES "Chapa_Item" ("id_chapa_item") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chapa_Item_Maquina" ("chapaItemId", "id_chapa_item_maquina", "maquinaId", "ordem", "prazo", "status") SELECT "chapaItemId", "id_chapa_item_maquina", "maquinaId", "ordem", "prazo", "status" FROM "Chapa_Item_Maquina";
DROP TABLE "Chapa_Item_Maquina";
ALTER TABLE "new_Chapa_Item_Maquina" RENAME TO "Chapa_Item_Maquina";
PRAGMA foreign_key_check("Chapa_Item_Maquina");
PRAGMA foreign_keys=ON;
