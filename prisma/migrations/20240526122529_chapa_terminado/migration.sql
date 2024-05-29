-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chapa_Item" (
    "id_chapa_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "terminado" BOOLEAN NOT NULL DEFAULT false,
    "chapaId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "Chapa_Item_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas" ("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapa_Item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id_item") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chapa_Item" ("chapaId", "id_chapa_item", "itemId", "quantidade") SELECT "chapaId", "id_chapa_item", "itemId", "quantidade" FROM "Chapa_Item";
DROP TABLE "Chapa_Item";
ALTER TABLE "new_Chapa_Item" RENAME TO "Chapa_Item";
PRAGMA foreign_key_check("Chapa_Item");
PRAGMA foreign_keys=ON;
