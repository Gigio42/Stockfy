-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conjugacoes" (
    "id_conjugacoes" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medida" TEXT NOT NULL,
    "largura" INTEGER NOT NULL,
    "comprimento" INTEGER NOT NULL,
    "rendimento" INTEGER NOT NULL DEFAULT 0,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "quantidade_disponivel" INTEGER NOT NULL DEFAULT 0,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "part_number" TEXT NOT NULL DEFAULT '0',
    "pedido_venda" INTEGER NOT NULL DEFAULT 0,
    "chapaId" INTEGER NOT NULL,
    CONSTRAINT "Conjugacoes_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas" ("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conjugacoes" ("chapaId", "comprimento", "id_conjugacoes", "largura", "medida", "quantidade", "quantidade_disponivel", "rendimento", "usado") SELECT "chapaId", "comprimento", "id_conjugacoes", "largura", "medida", "quantidade", "quantidade_disponivel", "rendimento", "usado" FROM "Conjugacoes";
DROP TABLE "Conjugacoes";
ALTER TABLE "new_Conjugacoes" RENAME TO "Conjugacoes";
CREATE UNIQUE INDEX "Conjugacoes_part_number_key" ON "Conjugacoes"("part_number");
CREATE INDEX "Conjugacoes_chapaId_idx" ON "Conjugacoes"("chapaId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
