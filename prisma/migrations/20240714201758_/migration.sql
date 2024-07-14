/*
  Warnings:

  - You are about to drop the column `conjulgacao` on the `Historico` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Historico" (
    "id_historico" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chapa" TEXT,
    "quantidade" INTEGER NOT NULL,
    "modificacao" TEXT NOT NULL,
    "modificado_por" TEXT NOT NULL,
    "data_modificacao" TEXT NOT NULL,
    "data_prevista" TEXT,
    "part_number" TEXT,
    "maquina" TEXT,
    "ordem" INTEGER,
    "conjugacao" TEXT,
    "pedido_venda" TEXT
);
INSERT INTO "new_Historico" ("chapa", "data_modificacao", "data_prevista", "id_historico", "maquina", "modificacao", "modificado_por", "ordem", "part_number", "pedido_venda", "quantidade") SELECT "chapa", "data_modificacao", "data_prevista", "id_historico", "maquina", "modificacao", "modificado_por", "ordem", "part_number", "pedido_venda", "quantidade" FROM "Historico";
DROP TABLE "Historico";
ALTER TABLE "new_Historico" RENAME TO "Historico";
CREATE INDEX "Historico_id_historico_idx" ON "Historico"("id_historico");
PRAGMA foreign_key_check("Historico");
PRAGMA foreign_keys=ON;
