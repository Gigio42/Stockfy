-- CreateTable
CREATE TABLE "Conjugacoes" (
    "id_conjugacoes" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "medida" TEXT NOT NULL,
    "chapaId" INTEGER NOT NULL,
    CONSTRAINT "Conjugacoes_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas" ("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Chapas" (
    "id_chapa" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_compra" INTEGER NOT NULL,
    "numero_cliente" INTEGER NOT NULL,
    "fornecedor" TEXT,
    "unidade" TEXT,
    "qualidade" TEXT NOT NULL,
    "medida" TEXT,
    "quantidade_comprada" REAL,
    "quantidade_recebida" REAL,
    "quantidade_estoque" REAL,
    "onda" TEXT,
    "coluna" REAL,
    "vincos" TEXT,
    "gramatura" REAL,
    "peso_total" REAL,
    "valor_unitario" DECIMAL,
    "valor_total" DECIMAL,
    "status" TEXT,
    "data_compra" TEXT,
    "data_prevista" TEXT,
    "data_recebimento" TEXT
);

-- CreateTable
CREATE TABLE "Chapa_Item" (
    "id_chapa_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "chapaId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "Chapa_Item_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas" ("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapa_Item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id_item") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "part_number" TEXT NOT NULL DEFAULT '0',
    "status" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Chapa_Item_Maquina" (
    "id_chapa_item_maquina" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ordem" INTEGER,
    "prazo" DATETIME,
    "status" TEXT,
    "itemId" INTEGER NOT NULL,
    "maquinaId" INTEGER NOT NULL,
    "chapaItemId" INTEGER NOT NULL,
    CONSTRAINT "Chapa_Item_Maquina_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id_item") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapa_Item_Maquina_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "Maquina" ("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapa_Item_Maquina_chapaItemId_fkey" FOREIGN KEY ("chapaItemId") REFERENCES "Chapa_Item" ("id_chapa_item") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Maquina" (
    "id_maquina" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MaquinaToUsuarios" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_MaquinaToUsuarios_A_fkey" FOREIGN KEY ("A") REFERENCES "Maquina" ("id_maquina") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MaquinaToUsuarios_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuarios" ("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Conjugacoes_chapaId_idx" ON "Conjugacoes"("chapaId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapas_id_chapa_id_compra_key" ON "Chapas"("id_chapa", "id_compra");

-- CreateIndex
CREATE INDEX "Usuarios_id_usuario_idx" ON "Usuarios"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "_MaquinaToUsuarios_AB_unique" ON "_MaquinaToUsuarios"("A", "B");

-- CreateIndex
CREATE INDEX "_MaquinaToUsuarios_B_index" ON "_MaquinaToUsuarios"("B");
