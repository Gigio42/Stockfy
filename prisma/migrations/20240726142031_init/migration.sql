-- CreateTable
CREATE TABLE "Conjugacoes" (
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

-- CreateTable
CREATE TABLE "Chapas" (
    "id_chapa" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_compra" INTEGER NOT NULL DEFAULT 0,
    "numero_cliente" INTEGER NOT NULL DEFAULT 0,
    "fornecedor" TEXT,
    "comprador" TEXT,
    "unidade" TEXT,
    "qualidade" TEXT,
    "medida" TEXT,
    "largura" INTEGER,
    "comprimento" INTEGER,
    "quantidade_comprada" INTEGER DEFAULT 0,
    "quantidade_recebida" INTEGER DEFAULT 0,
    "quantidade_estoque" INTEGER DEFAULT 0,
    "quantidade_disponivel" INTEGER DEFAULT 0,
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
    "data_recebimento" TEXT,
    "conjugado" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Chapa_Item" (
    "id_chapa_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "terminado" BOOLEAN NOT NULL DEFAULT false,
    "itemId" INTEGER NOT NULL,
    "chapaId" INTEGER NOT NULL,
    "conjugacaoId" INTEGER,
    CONSTRAINT "Chapa_Item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id_item") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapa_Item_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas" ("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Chapa_Item_conjugacaoId_fkey" FOREIGN KEY ("conjugacaoId") REFERENCES "Conjugacoes" ("id_conjugacoes") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "part_number" TEXT NOT NULL DEFAULT '0',
    "pedido_venda" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT '',
    "reservado_por" TEXT
);

-- CreateTable
CREATE TABLE "Item_Maquina" (
    "id_item_maquina" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "prazo" TEXT,
    "ordem" INTEGER,
    "ordemTotal" INTEGER,
    "executor" TEXT,
    "finalizado" BOOLEAN NOT NULL DEFAULT false,
    "medida" TEXT,
    "op" INTEGER,
    "prioridade" INTEGER,
    "sistema" TEXT,
    "cliente" TEXT,
    "quantidade" INTEGER,
    "colaborador" TEXT,
    "maquinaId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    CONSTRAINT "Item_Maquina_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "Maquina" ("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_Maquina_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item" ("id_item") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Maquina" (
    "id_maquina" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL DEFAULT ''
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Historico" (
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
CREATE UNIQUE INDEX "Item_part_number_key" ON "Item"("part_number");

-- CreateIndex
CREATE INDEX "Usuarios_id_usuario_idx" ON "Usuarios"("id_usuario");

-- CreateIndex
CREATE INDEX "Historico_id_historico_idx" ON "Historico"("id_historico");

-- CreateIndex
CREATE UNIQUE INDEX "_MaquinaToUsuarios_AB_unique" ON "_MaquinaToUsuarios"("A", "B");

-- CreateIndex
CREATE INDEX "_MaquinaToUsuarios_B_index" ON "_MaquinaToUsuarios"("B");
