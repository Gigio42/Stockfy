/*
  Warnings:

  - You are about to drop the `HistoricoChapa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HistoricoItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HistoricoChapa";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HistoricoItem";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Historico" (
    "id_historico" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_chapa" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "modificacao" TEXT NOT NULL,
    "modificado_por" TEXT NOT NULL,
    "data_modificacao" TEXT NOT NULL,
    "part_number" TEXT,
    "maquina" TEXT,
    "ordem" INTEGER,
    "conjulgacao" TEXT,
    "pedido_venda" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Historico_id_historico_idx" ON "Historico"("id_historico");
