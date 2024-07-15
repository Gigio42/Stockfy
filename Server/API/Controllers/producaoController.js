import Maquina from "../Models/maquinaModel.js";
import Item from "../Models/itemModel.js";
import Item_Maquina from "../Models/item_maquinaModel.js";
import Chapas from "../Models/chapasModel.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class ProducaoController {
  constructor() {}

  // ------------------------------
  // Allmaquinas Function
  // ------------------------------
  async getAllMachines() {
    const maquinas = await Maquina.findMany({
      select: {
        nome: true,
      },
    });
    return maquinas;
  }

  // ------------------------------
  // GetItemsInMaquinas Function
  // ------------------------------
  async getChapasInItemsInMaquinas(name) {
    // Fetch the machine details
    const maquina = await prisma.maquina.findFirst({
      where: { nome: name },
      select: {
        id_maquina: true,
        nome: true,
        items: {
          select: {
            id_item_maquina: true,
            ordem: true,
            prazo: true,
            medida: true,
            finalizado: true,
            op: true,
            sistema: true,
            cliente: true,
            quantidade: true,
            colaborador: true,
            prioridade: true,
            itemId: true,
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

    if (!maquina) {
      return null;
    }

    // Fetch all items' processes
    const allItemsMaquinas = await prisma.item_Maquina.findMany({
      select: {
        ordem: true,
        finalizado: true,
        itemId: true,
        maquinaId: true,
      },
    });

    // Group processes by itemId and calculate ordemTotal
    const groupedItems = allItemsMaquinas.reduce((groups, item) => {
      if (!groups[item.itemId]) {
        groups[item.itemId] = [];
      }
      groups[item.itemId].push(item);
      return groups;
    }, {});

    // Calculate ordemTotal and determine estado for each process
    Object.values(groupedItems).forEach((items) => {
      items.sort((a, b) => a.ordem - b.ordem);
      const ordemTotal = items.length;
      let currentItem = items.find((item) => !item.finalizado);

      items.forEach((item) => {
        item.ordemTotal = ordemTotal;
        if (item.finalizado) {
          item.estado = "FEITO";
        } else if (item === currentItem) {
          item.estado = "ATUAL";
          currentItem = null;
        } else {
          item.estado = "PROXIMAS";
        }
      });
    });

    // Assign estado to maquina items and sort by priority
    maquina.items.forEach((item) => {
      const itemProcesses = groupedItems[item.itemId];
      if (itemProcesses) {
        const currentItemProcess = itemProcesses.find((proc) => proc.ordem === item.ordem);
        if (currentItemProcess) {
          item.estado = currentItemProcess.estado;
          item.ordemTotal = currentItemProcess.ordemTotal;
        }
      }
    });

    // Sort items by priority
    maquina.items.sort((a, b) => a.prioridade - b.prioridade);

    // Mark the highest priority item as available and others as blocked
    let highestPriorityItem = true;
    maquina.items.forEach((item) => {
      if (highestPriorityItem && item.estado !== "FEITO") {
        item.disponivel = true;
        highestPriorityItem = false;
      } else {
        item.disponivel = false;
      }
    });

    return maquina;
  }

  // ------------------------------
  // MarkAsFinalizado Function
  // ------------------------------
  async markItemAsFinalizado(itemId, maquinaName, executor) {
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
        executor: executor,
      },
    });

    const remainingOrders = await Item_Maquina.findMany({
      where: {
        itemId: itemId,
        finalizado: false,
      },
    });

    if (remainingOrders.length === 0) {
      // Buscar todas as chapas associadas ao item cujo status é USADO
      const chapasUsadas = await Chapas.findMany({
        where: {
          items: {
            some: {
              itemId: itemId,
            },
          },
          status: "USADO",
        },
      });

      // Excluir todas as chapas cujo status é USADO
      for (const chapa of chapasUsadas) {
        // Verificar quantos itens ainda estão usando essa chapa
        const countItensUsandoChapa = await prisma.chapa_Item.count({
          where: {
            chapaId: chapa.id_chapa,
          },
        });

        //Se for a ultima...
        if (countItensUsandoChapa === 1) {
          // Tirando todas as conjugações associadas a essa chapa
          await prisma.conjugacoes.deleteMany({
            where: {
              chapaId: chapa.id_chapa,
            },
          });

          // Tirando a relação entre a chapa e o item
          await prisma.chapa_Item.deleteMany({
            where: {
              chapaId: chapa.id_chapa,
            },
          });

          // Excluindo a chapa
          await Chapas.delete({
            where: {
              id_chapa: chapa.id_chapa,
            },
          });
        }
      }

      // Remover todos os registros de Item_Maquina relacionados ao item
      await Item_Maquina.deleteMany({
        where: {
          itemId: itemId,
        },
      });

      // Remover todas as relações entre o item e as chapas
      await prisma.chapa_Item.deleteMany({
        where: {
          itemId: itemId,
        },
      });

      // Remover o item
      await Item.delete({
        where: {
          id_item: itemId,
        },
      });
    }

    return {
      message: `Processo do item ${itemId} na máquina ${maquina.id_maquina} marcado como finalizado`,
    };
  }
}

export default ProducaoController;
