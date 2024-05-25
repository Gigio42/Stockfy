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
      throw new Error(`No Chapa_Item found`);
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

    let item;
    let chapasToSave = [];
    let chapaItemsToSave = [];

    for (const { chapaID, quantity, medida, keepRemaining } of chapas) {
      const chapa = await prisma.chapas.findUnique({ where: { id_chapa: chapaID } });

      if (!chapa) throw new Error("Chapa not found");
      if (!quantity) throw new Error("Quantity is required");
      if (quantity > chapa.quantidade_comprada) throw new Error("Insufficient chapas");

      if (!item) {
        item = await prisma.item.findUnique({ where: { part_number: partNumber } });

        if (!item) {
          item = await prisma.item.create({
            data: {
              part_number: partNumber,
              status: "RESERVADO",
            },
          });
        }
      }

      await prisma.chapas.update({
        where: { id_chapa: chapa.id_chapa },
        data: { quantidade_estoque: { decrement: parseInt(quantity) } },
      });

      if (chapa.quantidade_comprada + chapa.quantidade_estoque === 0 || (chapa.status === "recebido" && chapa.quantidade_estoque === 0)) {
        chapa.status = "USADO";
      }

      if (keepRemaining) {
        const [chapaWidth, chapaHeight] = chapa.medida.split("x").map(Number);
        const [chosenWidth, chosenHeight] = medida.split("x").map(Number);

        if (chapaWidth < chosenWidth || chapaHeight < chosenHeight) {
          throw new Error("Not enough chapas of the specified dimensions");
        }

        const originalArea = chapaWidth * chapaHeight;
        const usedArea = chosenWidth * chosenHeight;
        const remainingArea = originalArea - usedArea;

        const { id_chapa, medida, ...chapaProps } = chapa;

        const newChapa = await prisma.chapas.create({
          data: {
            ...chapaProps,
            area: remainingArea,
            quantidade_estoque: quantity,
            status: "RESTO",
          },
        });

        chapasToSave.push(newChapa);
      }

      chapasToSave.push(chapa);

      let chapaItem = await prisma.chapa_Item.findFirst({
        where: {
          AND: [{ chapa: { id_chapa: chapaID } }, { item: { id_item: item.id_item } }],
        },
      });

      if (chapaItem) {
        chapaItem.quantidade += Number(quantity);
      } else {
        chapaItem = await prisma.chapa_Item.create({
          data: {
            quantidade: Number(quantity),
            chapa: { connect: { id_chapa: chapaID } },
            item: { connect: { id_item: item.id_item } },
          },
        });
      }

      chapaItemsToSave.push(chapaItem);
    }

    for (const chapa of chapasToSave) {
      await prisma.chapas.update({
        where: { id_chapa: chapa.id_chapa },
        data: { quantidade_estoque: { decrement: chapa.quantidade_estoque } },
      });
    }

    for (const chapaItem of chapaItemsToSave) {
      const existingChapaItem = await prisma.chapa_Item.findUnique({
        where: { id_chapa_item: chapaItem.id_chapa_item },
      });

      if (existingChapaItem) {
        await prisma.chapa_Item.update({
          where: { id_chapa_item: chapaItem.id_chapa_item },
          data: { quantidade: { increment: chapaItem.quantidade } },
        });
      } else {
        await prisma.chapa_Item.create({
          data: chapaItem,
        });
      }
    }

    return item;
  }
}

export default PCPController;
