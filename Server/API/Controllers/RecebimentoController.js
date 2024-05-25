import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class RecebimentoController {
  constructor() {}

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

      const chapa = await prisma.chapas.findUnique({ where: { id_chapa: id_chapa_int } });
      if (!chapa) {
        throw new Error(`Chapa with id ${item.id_chapa} not found`);
      }

      return prisma.chapas.update({
        where: { id_chapa: id_chapa_int },
        data: {
          vincos: item.vincos,
          onda: item.onda,
          medida: item.medida,
          qualidade: item.qualidade,
          data_recebimento: item.data_recebimento,
          quantidade_recebida: {
            increment: item.quantidade_recebida,
          },
          quantidade_estoque: {
            increment: item.quantidade_recebida,
          },
          status: item.status,
        },
      });
    });

    return await Promise.all(promises);
  }

  async getChapasByIdCompra(id_compra) {
    if (!id_compra) throw new Error("id_compra is undefined");

    const id_compra_int = parseInt(id_compra, 10);
    if (isNaN(id_compra_int)) throw new Error("id_compra must be a number");

    const chapas = await prisma.chapas.findMany({
      where: { id_compra },
      select: {
        id_chapa: true,
        id_compra: true,
        fornecedor: true,
        qualidade: true,
        medida: true,
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
