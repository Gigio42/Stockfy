/*
  Warnings:

  - You are about to drop the column `quantidade_usada` on the `Chapas` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapas" (
    "id_chapa" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_compra" INTEGER NOT NULL DEFAULT 0,
    "numero_cliente" INTEGER NOT NULL DEFAULT 0,
    "fornecedor" TEXT,
    "comprador" TEXT,
    "unidade" TEXT,
    "qualidade" TEXT NOT NULL,
    "medida" TEXT,
    "quantidade_comprada" INTEGER DEFAULT 0,
    "quantidade_recebida" INTEGER DEFAULT 0,
    "quantidade_estoque" INTEGER DEFAULT 0,
    "quantidade_disponivel" INTEGER DEFAULT 0,
    "onda" TEXT,
    "coluna" REAL,
    "vincos" TEXT,
    "gramatura" REAL,
    "peso_total" REAL,
    "valor_unitario" TEXT,
    "valor_total" TEXT,
    "status" TEXT,
    "data_compra" TEXT,
    "data_prevista" TEXT,
    "data_recebimento" TEXT
);
INSERT INTO "new_Chapas" ("coluna", "comprador", "data_compra", "data_prevista", "data_recebimento", "fornecedor", "gramatura", "id_chapa", "id_compra", "medida", "numero_cliente", "onda", "peso_total", "qualidade", "quantidade_comprada", "quantidade_estoque", "quantidade_recebida", "status", "unidade", "valor_total", "valor_unitario", "vincos") SELECT "coluna", "comprador", "data_compra", "data_prevista", "data_recebimento", "fornecedor", "gramatura", "id_chapa", "id_compra", "medida", "numero_cliente", "onda", "peso_total", "qualidade", "quantidade_comprada", "quantidade_estoque", "quantidade_recebida", "status", "unidade", "valor_total", "valor_unitario", "vincos" FROM "Chapas";
DROP TABLE "Chapas";
ALTER TABLE "new_Chapas" RENAME TO "Chapas";
CREATE UNIQUE INDEX "Chapas_id_chapa_id_compra_key" ON "Chapas"("id_chapa", "id_compra");
CREATE TABLE "new_Conjugacoes" (
    "id_conjugacoes" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medida" TEXT NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "chapaId" INTEGER NOT NULL,
    CONSTRAINT "Conjugacoes_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas" ("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conjugacoes" ("chapaId", "id_conjugacoes", "medida") SELECT "chapaId", "id_conjugacoes", "medida" FROM "Conjugacoes";
DROP TABLE "Conjugacoes";
ALTER TABLE "new_Conjugacoes" RENAME TO "Conjugacoes";
CREATE INDEX "Conjugacoes_chapaId_idx" ON "Conjugacoes"("chapaId");
PRAGMA foreign_key_check("Chapas");
PRAGMA foreign_key_check("Conjugacoes");
PRAGMA foreign_keys=ON;
