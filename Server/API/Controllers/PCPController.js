//Detalhes: As funções de deletar eu usei o prisma.$transaction por achar que seria mais seguro, pois
//se uma das operações falhar, ele vai dar rollback
import Chapas from "../Models/chapasModel.js";
import Chapa_Item from "../Models/chapa_itemModel.js";
import Item from "../Models/itemModel.js";
import Conjugacoes from "../Models/conjugacoesModel.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PCPController {
  constructor() {}

  // ------------------------------
  // GetChapasComment Function
  // ------------------------------
  async getChapas(query, filterCriteria, sortOrder, sortBy) {
    let data = await Chapas.findMany({ include: { conjugacoes: true } });

    data = data.filter((chapa) => chapa.status !== "USADO");

    if (filterCriteria) {
      for (let key in filterCriteria) {
        if (key === "comprimento" || key === "largura") {
          data = data.filter((chapa) => {
            let isValid = chapa.conjugacoes.some((conjugacao) => {
              const [comprimento, largura] = conjugacao.medida.split("x");
              if (key === "comprimento") {
                return comprimento === filterCriteria[key];
              } else {
                return largura === filterCriteria[key];
              }
            });

            const [cardComprimento, cardLargura] = chapa.medida.split("x");
            if (key === "comprimento") {
              isValid = isValid || cardComprimento === filterCriteria[key];
            } else {
              isValid = isValid || cardLargura === filterCriteria[key];
            }

            return isValid;
          });
        } else {
          data = data.filter((chapa) => chapa[key].toLowerCase() === filterCriteria[key].toLowerCase());
        }
      }
    }

    const sortedChapas = data.sort((a, b) => {
      const getValue = (obj, prop) => prop.split(".").reduce((acc, part) => acc && acc[part], obj);

      if (sortOrder === "descending") {
        return getValue(a, sortBy) < getValue(b, sortBy) ? -1 : getValue(a, sortBy) > getValue(b, sortBy) ? 1 : 0;
      } else {
        return getValue(a, sortBy) > getValue(b, sortBy) ? -1 : getValue(a, sortBy) < getValue(b, sortBy) ? 1 : 0;
      }
    });

    return sortedChapas;
  }

  // ------------------------------
  // GetItemsComment Function
  // ------------------------------
  async getItems(searchQuery = "") {
    const chapaItems = await Chapa_Item.findMany({
      where: { item: { part_number: { contains: searchQuery } } },
      include: { item: true, chapa: { include: { conjugacoes: true } } },
    });

    if (!chapaItems.length) throw new Error(`Chapas não encontradas para o item ${searchQuery}`);

    const items = chapaItems.reduce((acc, { item, chapa }) => {
      acc[item.id_item] = acc[item.id_item] || { ...item, chapas: [] };

      if (!acc[item.id_item].chapas.some(({ id_chapa }) => id_chapa === chapa.id_chapa)) {
        acc[item.id_item].chapas.push(chapa);
      }

      return acc;
    }, {});

    return Object.values(items);
  }

  // ------------------------------
  // PostItemsComment Function
  // ------------------------------
  async validateQuantities(chapas, conjugacoes) {
    chapas.forEach(({ quantity }) => {
      if (!quantity) throw new Error("Todas as chapas devem ter uma quantidade");
    });

    conjugacoes.forEach(({ quantity }) => {
      if (!quantity) throw new Error("Todas as conjugacoes devem ter uma quantidade");
    });
  }

  async findOrCreateItem(partNumber, pedidoVenda, reservedBy) {
    let item = await Item.findUnique({ where: { part_number: partNumber } });

    if (!item) {
      item = await Item.create({
        data: {
          part_number: partNumber,
          pedido_venda: parseInt(pedidoVenda),
          status: "RESERVADO",
          reservado_por: reservedBy,
        },
      });
    } else if (item.status !== "RESERVADO") {
      throw new Error("Item em processo");
    }

    return item;
  }

  async updateChapa(chapaID, quantity) {
    const chapa = await Chapas.findUnique({ where: { id_chapa: chapaID } });

    if (!chapa) throw new Error("Chapa não encontrada");
    if (!quantity || quantity <= 0) throw new Error("Informe a quantidade de chapas a serem reservadas");
    if (quantity > chapa.quantidade_disponivel) throw new Error(`Chapa ${chapaID} não possui quantidade suficiente`);

    const updatedChapa = await Chapas.update({
      where: { id_chapa: chapa.id_chapa },
      data: {
        quantidade_disponivel: { decrement: parseInt(quantity) },
        quantidade_estoque: { decrement: parseInt(quantity) },
      },
    });

    if (updatedChapa.quantidade_disponivel === 0) {
      await Chapas.update({
        where: { id_chapa: chapa.id_chapa },
        data: { status: "USADO" },
      });
    }

    return chapa;
  }

  async updateConjugacao(conjugacoesID, quantity) {
    const conjugacao = await Conjugacoes.findUnique({ where: { id_conjugacoes: conjugacoesID } });
    const chapa = await Chapas.findUnique({ where: { id_chapa: conjugacao.chapaId } });

    if (!conjugacao) throw new Error("Conjugação não encontrada");
    if (!quantity || quantity <= 0) throw new Error("Informe a quantidade de conjugações a serem reservadas");
    if (quantity > conjugacao.quantidade_disponivel) throw new Error(`Conjugação ${conjugacoesID} não possui quantidade suficiente`);
    if (!chapa) throw new Error("Chapa não encontrada");

    await Conjugacoes.update({
      where: { id_conjugacoes: conjugacao.id_conjugacoes },
      data: {
        quantidade_disponivel: { decrement: parseInt(quantity) },
        usado: parseInt(quantity) === conjugacao.quantidade_disponivel,
      },
    });

    const allConjugacoes = await Conjugacoes.findMany({ where: { chapaId: conjugacao.chapaId } });
    const allUsed = allConjugacoes.every((c) => c.usado);

    if (allUsed) {
      await Chapas.update({
        where: { id_chapa: conjugacao.chapaId },
        data: { quantidade_disponivel: { decrement: Math.min(...allConjugacoes.map((c) => c.quantidade_disponivel)) } },
      });
    }

    return conjugacao;
  }

  async upsertChapaItem(chapaID, itemID, quantity, conjugacoesID = null) {
    const whereCondition = {
      AND: [{ chapa: { id_chapa: chapaID } }, { item: { id_item: itemID } }],
    };

    if (conjugacoesID) {
      whereCondition.AND.push({ conjugacao: { id_conjugacoes: conjugacoesID } });
    }

    let chapaItem = await Chapa_Item.findFirst({ where: whereCondition });

    if (chapaItem) {
      await Chapa_Item.update({
        where: { id_chapa_item: chapaItem.id_chapa_item },
        data: {
          quantidade: { increment: Number(quantity) },
          ...(conjugacoesID && { conjugacao: { connect: { id_conjugacoes: conjugacoesID } } }),
        },
      });
    } else {
      await Chapa_Item.create({
        data: {
          quantidade: Number(quantity),
          chapa: { connect: { id_chapa: chapaID } },
          item: { connect: { id_item: itemID } },
          ...(conjugacoesID && { conjugacao: { connect: { id_conjugacoes: conjugacoesID } } }),
        },
      });
    }
  }

  async createItemWithChapa(body) {
    try {
      console.log(body);
      const { partNumber, pedidoVenda, chapas, conjugacoes, reservedBy } = body; // Add pedidoVenda here

      await this.validateQuantities(chapas, conjugacoes);

      const item = await this.findOrCreateItem(partNumber, pedidoVenda, reservedBy); // Pass pedidoVenda here

      for (const { chapaID, quantity } of chapas) {
        await this.updateChapa(chapaID, quantity);
        await this.upsertChapaItem(chapaID, item.id_item, quantity);
      }

      for (const { conjugacoesID, quantity } of conjugacoes) {
        const conjugacao = await this.updateConjugacao(conjugacoesID, quantity);
        await this.upsertChapaItem(conjugacao.chapaId, item.id_item, quantity, conjugacoesID);
      }

      return item;
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }

  // ------------------------------
  // delete item
  // ------------------------------
  async deleteItem(itemId) {
    const item = await Item.findUnique({
      where: { id_item: itemId },
      include: { chapas: true },
    });

    const operations = [];

    for (const chapaItem of item.chapas) {
      const conjugacoes = await Conjugacoes.findMany({ where: { chapaId: chapaItem.chapaId } });

      for (const conjugacao of conjugacoes) {
        operations.push(
          Conjugacoes.update({
            where: { id_conjugacoes: conjugacao.id_conjugacoes },
            data: {
              quantidade_disponivel: { increment: chapaItem.quantidade },
              usado: false,
            },
          }),
        );
      }

      operations.push(
        Chapas.update({
          where: { id_chapa: chapaItem.chapaId },
          data: { quantidade_estoque: { increment: chapaItem.quantidade } },
        }),
      );

      operations.push(Chapa_Item.delete({ where: { id_chapa_item: chapaItem.id_chapa_item } }));
    }

    operations.push(Item.delete({ where: { id_item: itemId } }));

    await prisma.$transaction(operations);
  }

  // ------------------------------
  // delete chapa
  // ------------------------------
  async deleteChapaFromItem(itemId, chapaId) {
    const chapaItem = await Chapa_Item.findFirst({
      where: {
        itemId: itemId,
        chapaId: chapaId,
      },
    });

    if (!chapaItem) {
      throw new Error("Chapa não encontrada no item");
    }

    const operations = [];

    const conjugacoes = await Conjugacoes.findMany({ where: { chapaId: chapaId } });

    for (const conjugacao of conjugacoes) {
      operations.push(
        Conjugacoes.update({
          where: { id_conjugacoes: conjugacao.id_conjugacoes },
          data: {
            quantidade_disponivel: { increment: chapaItem.quantidade },
            usado: false,
          },
        }),
      );
    }

    operations.push(
      Chapas.update({
        where: { id_chapa: chapaId },
        data: { quantidade_estoque: { increment: chapaItem.quantidade } },
      }),
    );

    operations.push(Chapa_Item.delete({ where: { id_chapa_item: chapaItem.id_chapa_item } }));

    await prisma.$transaction(operations);
  }
}

export default PCPController;
