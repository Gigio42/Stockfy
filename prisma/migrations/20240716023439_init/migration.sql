-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Historico" (
    "id_historico" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chapa" TEXT,
    "quantidade" INTEGER,
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
INSERT INTO "new_Historico" ("chapa", "conjugacao", "data_modificacao", "data_prevista", "id_historico", "maquina", "modificacao", "modificado_por", "ordem", "part_number", "pedido_venda", "quantidade") SELECT "chapa", "conjugacao", "data_modificacao", "data_prevista", "id_historico", "maquina", "modificacao", "modificado_por", "ordem", "part_number", "pedido_venda", "quantidade" FROM "Historico";
DROP TABLE "Historico";
ALTER TABLE "new_Historico" RENAME TO "Historico";
CREATE INDEX "Historico_id_historico_idx" ON "Historico"("id_historico");
PRAGMA foreign_key_check("Historico");
PRAGMA foreign_keys=ON;
