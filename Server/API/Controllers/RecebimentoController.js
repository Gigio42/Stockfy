import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class RecebimentoController {
  constructor() {}

  formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = [
      ('0' + date.getDate()).slice(-2),
      ('0' + (date.getMonth() + 1)).slice(-2),
      date.getFullYear(),
    ].join('/');
    return formattedDate;
  }

  async updateRecebimento(data) {
    if (!Array.isArray(data)) {
      throw new Error("Data must be an array");
    }

    const promises = data.map(async (item) => {
      if (!item.id_chapa) {
        throw new Error("id_chapa is undefined");
      }

      const id_chapa_int = parseInt(item.id_chapa, 10);
      if (isNaN(id_chapa_int)) throw new Error("id_chapa must be a number");

      const chapa = await prisma.chapas.findUnique({
        where: { id_chapa: id_chapa_int },
        select: {
          vincos: true,
          data_prevista: true,
          quantidade_comprada: true,
          quantidade_disponivel: true,
          status: true // Seleciona o status atual da chapa
        }
      });
      if (!chapa) {
        throw new Error(`Chapa with id ${item.id_chapa} not found`);
      }

      const formattedDataRecebimento = this.formatDate(item.data_recebimento);
      const originalStatus = chapa.status; // Armazena o status original antes de qualquer modificação

      const updateData = {
        data_recebimento: formattedDataRecebimento,
        status: item.status,
      };

      // Só atualiza as quantidades se o status atual não for "RECEBIDO"
      if (originalStatus !== "RECEBIDO") {
        updateData.quantidade_recebida = {
          increment: item.quantidade_recebida
        };
        updateData.quantidade_estoque = {
          increment: item.quantidade_recebida
        };
      }

      await prisma.chapas.update({
        where: { id_chapa: id_chapa_int },
        data: updateData,
      });

      // Após o primeiro update, verifique se a quantidade recebida é maior que a comprada
      const updatedChapa = await prisma.chapas.findUnique({
        where: { id_chapa: id_chapa_int },
        select: { quantidade_recebida: true }
      });

      if (updatedChapa.quantidade_recebida > chapa.quantidade_comprada) {
        const excess = updatedChapa.quantidade_recebida - chapa.quantidade_comprada;
        if (originalStatus !== "RECEBIDO") { // Só incrementa se o status original não era "RECEBIDO"
          await prisma.chapas.update({
            where: { id_chapa: id_chapa_int },
            data: {
              quantidade_disponivel: {
                increment: excess,
              },
              status: "RECEBIDO"
            },
          });
        }
      }

      await prisma.historico.createMany({
        data: {
          chapa: `${item.largura} X ${item.comprimento} - ${chapa.vincos} - ${item.qualidade}/${item.onda}`,
          quantidade: item.quantidade_recebida,
          modificacao: item.status,
          modificado_por: item.senderName,
          data_prevista: chapa.data_prevista,
          data_modificacao: formattedDataRecebimento,
        }
      });

      return 0;
    });

    return await Promise.all(promises);
  }

  async getChapasByIdCompra(id_compra) {
    id_compra = parseInt(id_compra, 10);
    if (isNaN(id_compra)) throw new Error("id_compra must be a number");

    const chapas = await prisma.chapas.findMany({
      where: { id_compra },
      select: {
        id_chapa: true,
        id_compra: true,
        fornecedor: true,
        qualidade: true,
        largura: true,
        comprimento: true,
        onda: true,
        vincos: true,
        status: true,
        data_compra: true,
        data_prevista: true,
        data_recebimento: true,
        quantidade_comprada: true,
        valor_unitario: true,
        quantidade_recebida: true,
        valor_total: true,
      },
    });

    if (!chapas.length) {
      throw new Error(`No chapas found with id_compra ${id_compra}`);
    }

    return chapas;
  }
}

export default RecebimentoController;
