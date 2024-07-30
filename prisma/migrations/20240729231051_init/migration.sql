-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuarios" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cargo" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Usuarios" ("id_usuario", "password", "username") SELECT "id_usuario", "password", "username" FROM "Usuarios";
DROP TABLE "Usuarios";
ALTER TABLE "new_Usuarios" RENAME TO "Usuarios";
CREATE INDEX "Usuarios_id_usuario_idx" ON "Usuarios"("id_usuario");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
