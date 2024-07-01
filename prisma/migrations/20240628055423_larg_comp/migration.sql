/*
  Warnings:

  - Added the required column `comprimento` to the `Conjugacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `largura` to the `Conjugacoes` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conjugacoes" (
    "id_conjugacoes" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medida" TEXT NOT NULL,
    "largura" INTEGER NOT NULL,
    "comprimento" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "chapaId" INTEGER NOT NULL,
    CONSTRAINT "Conjugacoes_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas" ("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conjugacoes" ("chapaId", "id_conjugacoes", "medida", "quantidade", "usado") SELECT "chapaId", "id_conjugacoes", "medida", "quantidade", "usado" FROM "Conjugacoes";
DROP TABLE "Conjugacoes";
ALTER TABLE "new_Conjugacoes" RENAME TO "Conjugacoes";
CREATE INDEX "Conjugacoes_chapaId_idx" ON "Conjugacoes"("chapaId");
PRAGMA foreign_key_check("Conjugacoes");
PRAGMA foreign_keys=ON;
