-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Historico" (
    "id_historico" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_chapa" TEXT,
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
INSERT INTO "new_Historico" ("conjulgacao", "data_modificacao", "id_chapa", "id_historico", "maquina", "modificacao", "modificado_por", "ordem", "part_number", "pedido_venda", "quantidade") SELECT "conjulgacao", "data_modificacao", "id_chapa", "id_historico", "maquina", "modificacao", "modificado_por", "ordem", "part_number", "pedido_venda", "quantidade" FROM "Historico";
DROP TABLE "Historico";
ALTER TABLE "new_Historico" RENAME TO "Historico";
CREATE INDEX "Historico_id_historico_idx" ON "Historico"("id_historico");
PRAGMA foreign_key_check("Historico");
PRAGMA foreign_keys=ON;
