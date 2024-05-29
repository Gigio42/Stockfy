import Maquina from "../Models/maquina.js";
import Chapa_Item from "../Models/chapa_item.js";

class AdmController {
  constructor() {}

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
}

export default AdmController;
