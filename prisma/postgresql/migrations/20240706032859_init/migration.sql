-- CreateTable
CREATE TABLE "Conjugacoes" (
    "id_conjugacoes" SERIAL NOT NULL,
    "medida" TEXT NOT NULL,
    "largura" INTEGER NOT NULL,
    "comprimento" INTEGER NOT NULL,
    "rendimento" INTEGER NOT NULL DEFAULT 0,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "quantidade_disponivel" INTEGER NOT NULL DEFAULT 0,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "chapaId" INTEGER NOT NULL,

    CONSTRAINT "Conjugacoes_pkey" PRIMARY KEY ("id_conjugacoes")
);

-- CreateTable
CREATE TABLE "Chapas" (
    "id_chapa" SERIAL NOT NULL,
    "id_compra" INTEGER NOT NULL DEFAULT 0,
    "numero_cliente" INTEGER NOT NULL DEFAULT 0,
    "fornecedor" TEXT,
    "comprador" TEXT,
    "unidade" TEXT,
    "qualidade" TEXT NOT NULL,
    "medida" TEXT,
    "largura" INTEGER,
    "comprimento" INTEGER,
    "quantidade_comprada" INTEGER DEFAULT 0,
    "quantidade_recebida" INTEGER DEFAULT 0,
    "quantidade_estoque" INTEGER DEFAULT 0,
    "quantidade_disponivel" INTEGER DEFAULT 0,
    "onda" TEXT,
    "coluna" DOUBLE PRECISION,
    "vincos" TEXT,
    "gramatura" DOUBLE PRECISION,
    "peso_total" DOUBLE PRECISION,
    "valor_unitario" TEXT,
    "valor_total" TEXT,
    "status" TEXT,
    "data_compra" TEXT,
    "data_prevista" TEXT,
    "data_recebimento" TEXT,

    CONSTRAINT "Chapas_pkey" PRIMARY KEY ("id_chapa")
);

-- CreateTable
CREATE TABLE "Chapa_Item" (
    "id_chapa_item" SERIAL NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "terminado" BOOLEAN NOT NULL DEFAULT false,
    "itemId" INTEGER NOT NULL,
    "chapaId" INTEGER NOT NULL,
    "conjugacaoId" INTEGER,

    CONSTRAINT "Chapa_Item_pkey" PRIMARY KEY ("id_chapa_item")
);

-- CreateTable
CREATE TABLE "Item" (
    "id_item" SERIAL NOT NULL,
    "part_number" TEXT NOT NULL DEFAULT '0',
    "pedido_venda" INTEGER NOT NULL DEFAULT 0,
    "prioridade" INTEGER,
    "status" TEXT NOT NULL DEFAULT '',
    "reservado_por" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id_item")
);

-- CreateTable
CREATE TABLE "Item_Maquina" (
    "id_item_maquina" SERIAL NOT NULL,
    "prazo" TEXT,
    "ordem" INTEGER,
    "ordemTotal" INTEGER,
    "executor" TEXT,
    "finalizado" BOOLEAN NOT NULL DEFAULT false,
    "medida" TEXT,
    "op" INTEGER,
    "sistema" TEXT,
    "cliente" TEXT,
    "quantidade" INTEGER,
    "colaborador" TEXT,
    "maquinaId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,

    CONSTRAINT "Item_Maquina_pkey" PRIMARY KEY ("id_item_maquina")
);

-- CreateTable
CREATE TABLE "Maquina" (
    "id_maquina" SERIAL NOT NULL,
    "nome" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Maquina_pkey" PRIMARY KEY ("id_maquina")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id_usuario" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "HistoricoChapa" (
    "id_historico_chapa" SERIAL NOT NULL,
    "id_chapa" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "modificacao" TEXT NOT NULL,
    "modificado_por" TEXT NOT NULL,
    "data_modificacao" TEXT NOT NULL,
    "part_number" TEXT NOT NULL,

    CONSTRAINT "HistoricoChapa_pkey" PRIMARY KEY ("id_historico_chapa")
);

-- CreateTable
CREATE TABLE "HistoricoItem" (
    "id_historico_item" SERIAL NOT NULL,
    "id_item" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "modificacao" TEXT NOT NULL,
    "modificado_por" TEXT NOT NULL,
    "data_modificacao" TEXT NOT NULL,
    "maquina" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "pedido_venda" TEXT NOT NULL,

    CONSTRAINT "HistoricoItem_pkey" PRIMARY KEY ("id_historico_item")
);

-- CreateTable
CREATE TABLE "_MaquinaToUsuarios" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
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
CREATE INDEX "HistoricoChapa_id_chapa_idx" ON "HistoricoChapa"("id_chapa");

-- CreateIndex
CREATE INDEX "HistoricoItem_id_item_idx" ON "HistoricoItem"("id_item");

-- CreateIndex
CREATE UNIQUE INDEX "_MaquinaToUsuarios_AB_unique" ON "_MaquinaToUsuarios"("A", "B");

-- CreateIndex
CREATE INDEX "_MaquinaToUsuarios_B_index" ON "_MaquinaToUsuarios"("B");

-- AddForeignKey
ALTER TABLE "Conjugacoes" ADD CONSTRAINT "Conjugacoes_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas"("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapa_Item" ADD CONSTRAINT "Chapa_Item_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapa_Item" ADD CONSTRAINT "Chapa_Item_chapaId_fkey" FOREIGN KEY ("chapaId") REFERENCES "Chapas"("id_chapa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapa_Item" ADD CONSTRAINT "Chapa_Item_conjugacaoId_fkey" FOREIGN KEY ("conjugacaoId") REFERENCES "Conjugacoes"("id_conjugacoes") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Maquina" ADD CONSTRAINT "Item_Maquina_maquinaId_fkey" FOREIGN KEY ("maquinaId") REFERENCES "Maquina"("id_maquina") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item_Maquina" ADD CONSTRAINT "Item_Maquina_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id_item") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaquinaToUsuarios" ADD CONSTRAINT "_MaquinaToUsuarios_A_fkey" FOREIGN KEY ("A") REFERENCES "Maquina"("id_maquina") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaquinaToUsuarios" ADD CONSTRAINT "_MaquinaToUsuarios_B_fkey" FOREIGN KEY ("B") REFERENCES "Usuarios"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;
