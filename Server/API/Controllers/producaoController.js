import Maquina from "../Models/maquinaModel.js";
import Item from "../Models/itemModel.js";
import Item_Maquina from "../Models/item_maquinaModel.js";

class ProducaoController {
  constructor() {}

  async getChapasInItemsInMaquinas(name) {
    const maquina = await Maquina.findFirst({
      where: {
        nome: name,
      },
      select: {
        id_maquina: true,
        nome: true,
        items: {
          select: {
            ordem: true,
            prazo: true,
            Item: {
              select: {
                id_item: true,
                part_number: true,
                status: true,
                chapas: {
                  select: {
                    quantidade: true,
                    terminado: true,
                    chapa: {
                      select: {
                        qualidade: true,
                        numero_cliente: true,
                        medida: true,
                        largura: true,
                        comprimento: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (maquina) {
      const allItemsMaquinas = await Item_Maquina.findMany({
        select: {
          ordem: true,
          finalizado: true,
          itemId: true,
          maquinaId: true,
        },
      });

      const groupedItems = allItemsMaquinas.reduce((groups, item) => {
        if (!groups[item.itemId]) {
          groups[item.itemId] = [];
        }
        groups[item.itemId].push(item);
        return groups;
      }, {});

      Object.values(groupedItems).forEach((items) => {
        items.sort((a, b) => a.ordem - b.ordem);
        const currentItem = items.find((item) => !item.finalizado);

        items.forEach((item) => {
          if (item.finalizado) {
            item.estado = "FEITO";
          } else if (item === currentItem && item.maquinaId === maquina.id_maquina) {
            item.estado = "ATUAL";
          } else {
            item.estado = "PROXIMAS";
          }
        });
      });

      maquina.items.forEach((item) => {
        const itemMaquina = groupedItems[item.Item.id_item];
        if (itemMaquina) {
          const correspondingItem = maquina.items.find((i) => i.Item.id_item === item.Item.id_item);
          correspondingItem.estado = itemMaquina[0].estado;
        }
      });
    }

    return maquina;
  }

  async markItemAsFinalizado(itemId, maquinaName) {
    const maquina = await Maquina.findFirst({
      where: {
        nome: maquinaName,
      },
    });

    if (!maquina) {
      throw new Error(`Maquina com nome ${maquinaName} não encontrada.`);
    }

    const itemMaquina = await Item_Maquina.findFirst({
      where: {
        itemId: itemId,
        maquinaId: maquina.id_maquina,
      },
    });
    if (!itemMaquina) {
      throw new Error("Esse item não está associado a essa máquina.");
    }

    const previousOrders = await Item_Maquina.findMany({
      where: {
        itemId: itemId,
        ordem: {
          lt: itemMaquina.ordem,
        },
        finalizado: false,
      },
    });

    if (previousOrders.length > 0) {
      throw new Error("Não é possível marcar um processo como finalizado antes de finalizar os processos anteriores.");
    }

    await Item_Maquina.update({
      where: {
        id_item_maquina: itemMaquina.id_item_maquina,
      },
      data: {
        finalizado: true,
      },
    });

    const remainingOrders = await Item_Maquina.findMany({
      where: {
        itemId: itemId,
        finalizado: false,
      },
    });

    if (remainingOrders.length === 0) {
      await Item.update({
        where: {
          id_item: itemId,
        },
        data: {
          status: "FINALIZADO", //TODO talvez mudar para AGUARDANDO futuramente? para confirmar que foi a última ordem mesmo.
        },
      });
    }

    return {
      message: `Processo do item ${itemId} na máquina ${maquina.id_maquina} marcado como finalizado`,
    };
  }
}

export default ProducaoController;
