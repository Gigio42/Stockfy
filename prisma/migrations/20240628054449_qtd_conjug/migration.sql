-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Conjugacoes" (
    "id_conjugacoes" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medida" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "chapaId" INTEGER NOT NULL,
    CONSTRAINT "Conjugacoes_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas" ("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Conjugacoes" ("chapaId", "id_conjugacoes", "medida", "usado") SELECT "chapaId", "id_conjugacoes", "medida", "usado" FROM "Conjugacoes";
DROP TABLE "Conjugacoes";
ALTER TABLE "new_Conjugacoes" RENAME TO "Conjugacoes";
CREATE INDEX "Conjugacoes_chapaId_idx" ON "Conjugacoes"("chapaId");
PRAGMA foreign_key_check("Conjugacoes");
PRAGMA foreign_keys=ON;
