import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PCPController {
  constructor() {}

  // ------------------------------
  // GetChapasComment Function
  // ------------------------------
  async getChapas(query, filterCriteria, sortOrder, sortBy) {
    let data = await prisma.chapas.findMany({ include: { conjugacoes: true } });

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

      if (sortOrder === "asc") {
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
    const chapaItems = await prisma.chapa_Item.findMany({
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
    const { partNumber, chapas } = body;

    for (const { quantity } of chapas) {
      if (!quantity) throw new Error("Todas as chapas devem ter uma quantidade");
    }

    let item;

    for (const { chapaID, quantity } of chapas) {
      const chapa = await prisma.chapas.findUnique({ where: { id_chapa: chapaID } });

      if (!chapa) throw new Error("Chapa não encontrada");
      if (!quantity) throw new Error("Informe a quantidade de chapas a serem reservadas");
      if (quantity > chapa.quantidade_comprada) throw new Error("Chapas insuficientes");

      if (!item) {
        item = await prisma.item.findUnique({ where: { part_number: partNumber } });

        if (!item) {
          item = await prisma.item.create({
            data: {
              part_number: partNumber,
              status: "RESERVADO",
            },
          });
        } else if (item.status !== "RESERVADO") {
          throw new Error("Item em processo");
        }
      }

      await prisma.chapas.update({
        where: { id_chapa: chapa.id_chapa },
        data: { quantidade_estoque: { decrement: parseInt(quantity) } },
      });

      if (chapa.quantidade_comprada + chapa.quantidade_estoque === 0 || (chapa.status === "recebido" && chapa.quantidade_estoque === 0)) {
        await prisma.chapas.update({
          where: { id_chapa: chapa.id_chapa },
          data: { status: "USADO" },
        });
      }

      let chapaItem = await prisma.chapa_Item.findFirst({
        where: {
          AND: [{ chapa: { id_chapa: chapaID } }, { item: { id_item: item.id_item } }],
        },
      });

      if (chapaItem) {
        await prisma.chapa_Item.update({
          where: { id_chapa_item: chapaItem.id_chapa_item },
          data: { quantidade: { increment: Number(quantity) } },
        });
      } else {
        await prisma.chapa_Item.create({
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
  // PostItemsComment Function
  // ------------------------------
  async deleteItem(itemId) {
    const item = await prisma.item.findUnique({
      where: { id_item: itemId },
      include: { chapas: { include: { chapa_item: true } } },
    });

    const operations = [];

    for (const chapa of item.chapas) {
      operations.push(
        prisma.chapas.update({
          where: { id_chapa: chapa.id_chapa },
          data: { quantidade_estoque: { increment: chapa.quantidade_estoque } },
        }),
      );

      operations.push(prisma.chapas.delete({ where: { id_chapa: chapa.id_chapa } }));
    }

    operations.push(prisma.item.delete({ where: { id_item: itemId } }));

    await prisma.$transaction(operations);
  }
}

export default PCPController;
