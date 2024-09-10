BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Conjugacoes] (
    [id_conjugacoes] INT NOT NULL IDENTITY(1,1),
    [medida] NVARCHAR(1000) NOT NULL,
    [largura] INT NOT NULL,
    [comprimento] INT NOT NULL,
    [rendimento] INT NOT NULL CONSTRAINT [Conjugacoes_rendimento_df] DEFAULT 0,
    [quantidade] INT NOT NULL CONSTRAINT [Conjugacoes_quantidade_df] DEFAULT 0,
    [quantidade_disponivel] INT NOT NULL CONSTRAINT [Conjugacoes_quantidade_disponivel_df] DEFAULT 0,
    [usado] BIT NOT NULL CONSTRAINT [Conjugacoes_usado_df] DEFAULT 0,
    [part_number] NVARCHAR(1000) NOT NULL CONSTRAINT [Conjugacoes_part_number_df] DEFAULT '0',
    [pedido_venda] INT NOT NULL CONSTRAINT [Conjugacoes_pedido_venda_df] DEFAULT 0,
    [chapaId] INT NOT NULL,
    CONSTRAINT [Conjugacoes_pkey] PRIMARY KEY CLUSTERED ([id_conjugacoes])
);

-- CreateTable
CREATE TABLE [dbo].[Chapas] (
    [id_chapa] INT NOT NULL IDENTITY(1,1),
    [id_compra] INT NOT NULL CONSTRAINT [Chapas_id_compra_df] DEFAULT 0,
    [numero_cliente] INT NOT NULL CONSTRAINT [Chapas_numero_cliente_df] DEFAULT 0,
    [fornecedor] NVARCHAR(1000),
    [comprador] NVARCHAR(1000),
    [unidade] NVARCHAR(1000),
    [qualidade] NVARCHAR(1000),
    [medida] NVARCHAR(1000),
    [largura] INT,
    [comprimento] INT,
    [quantidade_comprada] INT CONSTRAINT [Chapas_quantidade_comprada_df] DEFAULT 0,
    [quantidade_recebida] INT CONSTRAINT [Chapas_quantidade_recebida_df] DEFAULT 0,
    [quantidade_estoque] INT CONSTRAINT [Chapas_quantidade_estoque_df] DEFAULT 0,
    [quantidade_disponivel] INT CONSTRAINT [Chapas_quantidade_disponivel_df] DEFAULT 0,
    [onda] NVARCHAR(1000),
    [coluna] FLOAT(53),
    [vincos] NVARCHAR(1000),
    [gramatura] FLOAT(53),
    [peso_total] FLOAT(53),
    [valor_unitario] NVARCHAR(1000),
    [valor_total] NVARCHAR(1000),
    [status] NVARCHAR(1000),
    [data_compra] NVARCHAR(1000),
    [data_prevista] NVARCHAR(1000),
    [data_recebimento] NVARCHAR(1000),
    [conjugado] BIT NOT NULL CONSTRAINT [Chapas_conjugado_df] DEFAULT 0,
    CONSTRAINT [Chapas_pkey] PRIMARY KEY CLUSTERED ([id_chapa]),
    CONSTRAINT [Chapas_id_chapa_id_compra_key] UNIQUE NONCLUSTERED ([id_chapa],[id_compra])
);

-- CreateTable
CREATE TABLE [dbo].[Chapa_Item] (
    [id_chapa_item] INT NOT NULL IDENTITY(1,1),
    [quantidade] INT NOT NULL CONSTRAINT [Chapa_Item_quantidade_df] DEFAULT 0,
    [terminado] BIT NOT NULL CONSTRAINT [Chapa_Item_terminado_df] DEFAULT 0,
    [itemId] INT NOT NULL,
    [chapaId] INT NOT NULL,
    [conjugacaoId] INT,
    CONSTRAINT [Chapa_Item_pkey] PRIMARY KEY CLUSTERED ([id_chapa_item])
);

-- CreateTable
CREATE TABLE [dbo].[Item] (
    [id_item] INT NOT NULL IDENTITY(1,1),
    [part_number] NVARCHAR(1000) NOT NULL CONSTRAINT [Item_part_number_df] DEFAULT '0',
    [pedido_venda] INT NOT NULL CONSTRAINT [Item_pedido_venda_df] DEFAULT 0,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Item_status_df] DEFAULT '',
    [reservado_por] NVARCHAR(1000),
    CONSTRAINT [Item_pkey] PRIMARY KEY CLUSTERED ([id_item]),
    CONSTRAINT [Item_part_number_key] UNIQUE NONCLUSTERED ([part_number])
);

-- CreateTable
CREATE TABLE [dbo].[Item_Maquina] (
    [id_item_maquina] INT NOT NULL IDENTITY(1,1),
    [prazo] NVARCHAR(1000),
    [ordem] INT,
    [ordemTotal] INT,
    [executor] NVARCHAR(1000),
    [finalizado] BIT NOT NULL CONSTRAINT [Item_Maquina_finalizado_df] DEFAULT 0,
    [medida] NVARCHAR(1000),
    [op] INT,
    [prioridade] INT,
    [sistema] NVARCHAR(1000),
    [cliente] NVARCHAR(1000),
    [quantidade] INT,
    [colaborador] NVARCHAR(1000),
    [maquinaId] INT NOT NULL,
    [itemId] INT NOT NULL,
    CONSTRAINT [Item_Maquina_pkey] PRIMARY KEY CLUSTERED ([id_item_maquina])
);

-- CreateTable
CREATE TABLE [dbo].[Maquina] (
    [id_maquina] INT NOT NULL IDENTITY(1,1),
    [nome] NVARCHAR(1000) NOT NULL CONSTRAINT [Maquina_nome_df] DEFAULT '',
    CONSTRAINT [Maquina_pkey] PRIMARY KEY CLUSTERED ([id_maquina])
);

-- CreateTable
CREATE TABLE [dbo].[Usuarios] (
    [id_usuario] INT NOT NULL IDENTITY(1,1),
    [username] NVARCHAR(1000) NOT NULL,
    [password] NVARCHAR(1000) NOT NULL,
    [cargo] NVARCHAR(1000) NOT NULL CONSTRAINT [Usuarios_cargo_df] DEFAULT '',
    CONSTRAINT [Usuarios_pkey] PRIMARY KEY CLUSTERED ([id_usuario])
);

-- CreateTable
CREATE TABLE [dbo].[Historico] (
    [id_historico] INT NOT NULL IDENTITY(1,1),
    [chapa] NVARCHAR(1000),
    [quantidade] INT,
    [modificacao] NVARCHAR(1000) NOT NULL,
    [modificado_por] NVARCHAR(1000) NOT NULL,
    [data_modificacao] NVARCHAR(1000) NOT NULL,
    [data_prevista] NVARCHAR(1000),
    [part_number] NVARCHAR(1000),
    [maquina] NVARCHAR(1000),
    [ordem] INT,
    [conjugacao] NVARCHAR(1000),
    [pedido_venda] NVARCHAR(1000),
    CONSTRAINT [Historico_pkey] PRIMARY KEY CLUSTERED ([id_historico])
);

-- CreateTable
CREATE TABLE [dbo].[_MaquinaToUsuarios] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_MaquinaToUsuarios_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Conjugacoes_chapaId_idx] ON [dbo].[Conjugacoes]([chapaId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Usuarios_id_usuario_idx] ON [dbo].[Usuarios]([id_usuario]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Historico_id_historico_idx] ON [dbo].[Historico]([id_historico]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_MaquinaToUsuarios_B_index] ON [dbo].[_MaquinaToUsuarios]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Conjugacoes] ADD CONSTRAINT [Conjugacoes_chapaId_fkey] FOREIGN KEY ([chapaId]) REFERENCES [dbo].[Chapas]([id_chapa]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Chapa_Item] ADD CONSTRAINT [Chapa_Item_itemId_fkey] FOREIGN KEY ([itemId]) REFERENCES [dbo].[Item]([id_item]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Chapa_Item] ADD CONSTRAINT [Chapa_Item_chapaId_fkey] FOREIGN KEY ([chapaId]) REFERENCES [dbo].[Chapas]([id_chapa]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Chapa_Item] ADD CONSTRAINT [Chapa_Item_conjugacaoId_fkey] FOREIGN KEY ([conjugacaoId]) REFERENCES [dbo].[Conjugacoes]([id_conjugacoes]) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Item_Maquina] ADD CONSTRAINT [Item_Maquina_maquinaId_fkey] FOREIGN KEY ([maquinaId]) REFERENCES [dbo].[Maquina]([id_maquina]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Item_Maquina] ADD CONSTRAINT [Item_Maquina_itemId_fkey] FOREIGN KEY ([itemId]) REFERENCES [dbo].[Item]([id_item]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_MaquinaToUsuarios] ADD CONSTRAINT [_MaquinaToUsuarios_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Maquina]([id_maquina]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_MaquinaToUsuarios] ADD CONSTRAINT [_MaquinaToUsuarios_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Usuarios]([id_usuario]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
