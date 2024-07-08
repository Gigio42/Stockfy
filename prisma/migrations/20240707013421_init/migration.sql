-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HistoricoChapa" (
    "id_historico_chapa" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_chapa" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "modificacao" TEXT NOT NULL,
    "modificado_por" TEXT NOT NULL,
    "data_modificacao" TEXT NOT NULL,
    "part_number" TEXT
);
INSERT INTO "new_HistoricoChapa" ("data_modificacao", "id_chapa", "id_historico_chapa", "modificacao", "modificado_por", "part_number", "quantidade") SELECT "data_modificacao", "id_chapa", "id_historico_chapa", "modificacao", "modificado_por", "part_number", "quantidade" FROM "HistoricoChapa";
DROP TABLE "HistoricoChapa";
ALTER TABLE "new_HistoricoChapa" RENAME TO "HistoricoChapa";
CREATE INDEX "HistoricoChapa_id_chapa_idx" ON "HistoricoChapa"("id_chapa");
CREATE TABLE "new_HistoricoItem" (
    "id_historico_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_item" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "modificacao" TEXT NOT NULL,
    "modificado_por" TEXT NOT NULL,
    "data_modificacao" TEXT NOT NULL,
    "maquina" TEXT,
    "ordem" INTEGER,
    "pedido_venda" TEXT NOT NULL
);
INSERT INTO "new_HistoricoItem" ("data_modificacao", "id_historico_item", "id_item", "maquina", "modificacao", "modificado_por", "ordem", "pedido_venda", "quantidade") SELECT "data_modificacao", "id_historico_item", "id_item", "maquina", "modificacao", "modificado_por", "ordem", "pedido_venda", "quantidade" FROM "HistoricoItem";
DROP TABLE "HistoricoItem";
ALTER TABLE "new_HistoricoItem" RENAME TO "HistoricoItem";
CREATE INDEX "HistoricoItem_id_item_idx" ON "HistoricoItem"("id_item");
PRAGMA foreign_key_check("HistoricoChapa");
PRAGMA foreign_key_check("HistoricoItem");
PRAGMA foreign_keys=ON;
