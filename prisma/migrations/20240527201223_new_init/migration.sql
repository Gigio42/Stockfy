/*
  Warnings:

  - You are about to drop the column `name` on the `Maquina` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Maquina" (
    "id_maquina" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Maquina" ("id_maquina") SELECT "id_maquina" FROM "Maquina";
DROP TABLE "Maquina";
ALTER TABLE "new_Maquina" RENAME TO "Maquina";
PRAGMA foreign_key_check("Maquina");
PRAGMA foreign_keys=ON;
