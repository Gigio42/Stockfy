//Detalhes: As funções de deletar eu usei o prisma.$transaction por achar que seria mais seguro, pois
//se uma das operações falhar, ele vai dar rollback
import Chapas from "../Models/chapasModel.js";
import Chapa_Item from "../Models/chapa_itemModel.js";
import Item from "../Models/itemModel.js";
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
            const [comprimento, largura] = chapa.medida.split("x");
            if (key === "comprimento") {
              return comprimento === filterCriteria[key];
            } else {
              return largura === filterCriteria[key];
            }
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
      where: {
        item: {
          part_number: {
            contains: searchQuery,
          },
        },
      },
      include: {
        item: true,
        chapa: true,
      },
    });

    if (!chapaItems.length) {
      throw new Error(`Chapas não encontradas para o item ${searchQuery}`);
    }

    const items = chapaItems.reduce((acc, chapaItem) => {
      const { item } = chapaItem;
      if (!acc[item.id_item]) {
        acc[item.id_item] = {
          ...item,
          chapas: [],
        };
      }
      acc[item.id_item].chapas.push(chapaItem.chapa);
      return acc;
    }, {});

    return Object.values(items);
  }

  // ------------------------------
  // PostItemsComment Function
  // ------------------------------
  async createItemWithChapa(body) {
    console.log(body);
    const { partNumber, chapas } = body;

    for (const { quantity, keepRemaining } of chapas) {
      if (keepRemaining) throw new Error("Reciclagem ainda está sendo desenvolvida"); //TODO Desenvolver reciclagem de chapas
      if (!quantity) throw new Error("Todas as chapas devem ter uma quantidade");
    }

    let item;

    for (const { chapaID, quantity } of chapas) {
      const chapa = await Chapas.findUnique({ where: { id_chapa: chapaID } });

      if (!chapa) throw new Error("Chapa não encontrada");
      if (!quantity || quantity <= 0) throw new Error("Informe a quantidade de chapas a serem reservadas");
      if (quantity > chapa.quantidade_disponivel) throw new Error(`Chapa ${chapaID} não possui quantidade suficiente`);

      if (!item) {
        item = await Item.findUnique({ where: { part_number: partNumber } });

        if (!item) {
          item = await Item.create({
            data: {
              part_number: partNumber,
              status: "RESERVADO",
            },
          });
        } else if (item.status !== "RESERVADO") {
          throw new Error("Item em processo");
        }
      }

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

      let chapaItem = await Chapa_Item.findFirst({
        where: {
          AND: [{ chapa: { id_chapa: chapaID } }, { item: { id_item: item.id_item } }],
        },
      });

      if (chapaItem) {
        await Chapa_Item.update({
          where: { id_chapa_item: chapaItem.id_chapa_item },
          data: { quantidade: { increment: Number(quantity) } },
        });
      } else {
        await Chapa_Item.create({
          data: {
            quantidade: Number(quantity),
            chapa: { connect: { id_chapa: chapaID } },
            item: { connect: { id_item: item.id_item } },
          },
        });
      }
    }

    return item;
  }

  // ------------------------------
  // deleteItemComment Function
  // ------------------------------
  async deleteItem(itemId) {
    const item = await Item.findUnique({
      where: { id_item: itemId },
      include: { chapas: true },
    });

    const operations = [];

    for (const chapaItem of item.chapas) {
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
  // deleteItemComment Function
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
