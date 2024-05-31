import Maquina from "../Models/maquinaModel.js";
import Chapa_Item from "../Models/chapa_itemModel.js";
import Item from "../Models/itemModel.js";
import Item_Maquina from "../Models/item_maquinaModel.js";

class AdmController {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getMaquina() {
    const maquinas = await Maquina.findMany();
    return maquinas;
  }

  async getChapasInItemsInMaquinas() {
    const maquinas = await Maquina.findMany({
      include: {
        items: {
          include: {
            Item: {
              include: {
                chapas: true,
              },
            },
          },
        },
      },
    });

    console.log(maquinas);

    return maquinas;
  }

  async getChapasInItems() {
    const chapaItems = await Chapa_Item.findMany({
      where: {
        item: {
          status: {
            contains: "RESERVADO",
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

  async changeItemStatusProduzindo(itemId, maquinaId) {
    try {
      // Atualiza o status do item para PRODUZINDO
      await Item.update({
        where: { id_item: itemId },
        data: { status: "PRODUZINDO" },
      });

      // Cria o relacionamento entre Item e Maquina
      await Item_Maquina.create({
        data: {
          maquinaId: maquinaId,
          itemId: itemId,
        },
      });
    } catch (error) {
      throw new Error("Erro ao atualizar o status do item para PRODUZINDO: " + error.message);
    }
  }
}

export default AdmController;
