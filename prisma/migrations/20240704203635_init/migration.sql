-- CreateTable
CREATE TABLE "HistoricoChapa" (
    "id_historico_chapa" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_chapa" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "modificacao" TEXT NOT NULL,
    "modificado_por" TEXT NOT NULL,
    "data_modificacao" DATETIME NOT NULL,
    "part_number" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "HistoricoItem" (
    "id_historico_item" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_item" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "modificacao" TEXT NOT NULL,
    "modificado_por" TEXT NOT NULL,
    "data_modificacao" DATETIME NOT NULL,
    "maquina" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "pedido_venda" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "HistoricoChapa_id_chapa_idx" ON "HistoricoChapa"("id_chapa");

-- CreateIndex
CREATE INDEX "HistoricoItem_id_item_idx" ON "HistoricoItem"("id_item");
