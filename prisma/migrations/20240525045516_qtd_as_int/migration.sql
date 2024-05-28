-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapas" (
    "id_chapa" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_compra" INTEGER NOT NULL DEFAULT 0,
    "numero_cliente" INTEGER NOT NULL DEFAULT 0,
    "fornecedor" TEXT,
    "unidade" TEXT,
    "qualidade" TEXT NOT NULL,
    "medida" TEXT,
    "quantidade_comprada" INTEGER DEFAULT 0,
    "quantidade_recebida" INTEGER DEFAULT 0,
    "quantidade_estoque" INTEGER DEFAULT 0,
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
INSERT INTO "new_Chapas" ("coluna", "data_compra", "data_prevista", "data_recebimento", "fornecedor", "gramatura", "id_chapa", "id_compra", "medida", "numero_cliente", "onda", "peso_total", "qualidade", "quantidade_comprada", "quantidade_estoque", "quantidade_recebida", "status", "unidade", "valor_total", "valor_unitario", "vincos") SELECT "coluna", "data_compra", "data_prevista", "data_recebimento", "fornecedor", "gramatura", "id_chapa", "id_compra", "medida", "numero_cliente", "onda", "peso_total", "qualidade", "quantidade_comprada", "quantidade_estoque", "quantidade_recebida", "status", "unidade", "valor_total", "valor_unitario", "vincos" FROM "Chapas";
DROP TABLE "Chapas";
ALTER TABLE "new_Chapas" RENAME TO "Chapas";
CREATE UNIQUE INDEX "Chapas_id_chapa_id_compra_key" ON "Chapas"("id_chapa", "id_compra");
PRAGMA foreign_key_check("Chapas");
PRAGMA foreign_keys=ON;
