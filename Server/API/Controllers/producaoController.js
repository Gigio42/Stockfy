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
    // Busca os detalhes da máquina e itens associados
    const maquina = await this.buscarDetalhesDaMaquina(name);
    if (!maquina) {
      return null;
    }

    // Busca todos os processos dos itens
    const allItemsMaquinas = await this.buscarTodosProcessosDosItens();

    // Agrupa processos por itemId e calcula ordemTotal
    const groupedItems = this.agruparItensPorId(allItemsMaquinas);

    // Calcula ordemTotal e determina estado para cada processo
    this.calcularEstadosDosItens(groupedItems);

    // Atribui estado aos itens da máquina e ordena por prioridade
    this.atribuirEstadosAosItens(maquina, groupedItems);

    // Ordena itens por prioridade
    this.ordenarItensPorPrioridade(maquina);

    // Marca o item de maior prioridade com todas as chapas no status "RECEBIDO" como disponível
    this.marcarItemDisponivel(maquina);

    return maquina;
  }

  // Método para buscar os detalhes da máquina e itens associados
  async buscarDetalhesDaMaquina(name) {
    return prisma.maquina.findFirst({
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
                        status: true, // Inclui status da chapa
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
  }

  // Método para buscar todos os processos dos itens
  async buscarTodosProcessosDosItens() {
    return prisma.item_Maquina.findMany({
      select: {
        ordem: true,
        finalizado: true,
        itemId: true,
        maquinaId: true,
      },
    });
  }

  // Método para agrupar processos por itemId
  agruparItensPorId(allItemsMaquinas) {
    return allItemsMaquinas.reduce((groups, item) => {
      if (!groups[item.itemId]) {
        groups[item.itemId] = [];
      }
      groups[item.itemId].push(item);
      return groups;
    }, {});
  }

  // Método para calcular ordemTotal e determinar estado para cada processo
  calcularEstadosDosItens(groupedItems) {
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
  }

  // Método para atribuir estado aos itens da máquina
  atribuirEstadosAosItens(maquina, groupedItems) {
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
  }

  // Método para ordenar itens por prioridade
  ordenarItensPorPrioridade(maquina) {
    maquina.items.sort((a, b) => a.prioridade - b.prioridade);
  }

  // Método para marcar o item de maior prioridade com todas as chapas no status "RECEBIDO" como disponível
  marcarItemDisponivel(maquina) {
    let highestPriorityItem = true;
    maquina.items.forEach((item) => {
      const allChapasReceived = item.Item.chapas.every((chapaItem) => chapaItem.chapa.status === "RECEBIDO");

      if (highestPriorityItem && item.estado !== "FEITO" && allChapasReceived) {
        item.disponivel = true;
        highestPriorityItem = false;
      } else {
        item.disponivel = false;
      }
    });
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

    const item = await prisma.item.findUnique({
      where: { id_item: itemId },
      select: {
        part_number: true,
        pedido_venda: true,
      },
    });

    //historico finalizou item na maquina
    await prisma.historico.createMany({
      data: {
        part_number: item.part_number,
        maquina: maquinaName,
        quantidade: itemMaquina.quantidade,
        modificacao: "PROCESSADO",
        modificado_por: executor, // usuario login
        data_modificacao: new Date().toLocaleDateString("pt-BR"),
        ordem: itemMaquina.ordem,
        pedido_venda: item.pedido_venda.toString(),
      },
    });

    const remainingOrders = await Item_Maquina.findMany({
      where: {
        itemId: itemId,
        finalizado: false,
      },
    });

    if (remainingOrders.length === 0) {
      // Buscar todas as chapas associadas ao item cuja quantidade disponível é 0
      const chapasUsadas = await Chapas.findMany({
        where: {
          items: {
            some: {
              itemId: itemId,
            },
          },
          quantidade_disponivel: 0,
        },
      });

      // Excluir todas as chapas cuja a quantidade disponível é 0
      for (const chapa of chapasUsadas) {
        // Verificar quantos itens estão usando a chapa
        const countItensUsandoChapa = await prisma.chapa_Item.count({
          where: {
            chapaId: chapa.id_chapa,
          },
        });

        //Se for a ultima...
        if (countItensUsandoChapa === 1) {
          //remover chapa!!!

          //historico deleta chapa
          await prisma.historico.createMany({
            data: {
              chapa: `${chapa.largura} X ${chapa.comprimento} - ${chapa.vincos} - ${chapa.qualidade}/${chapa.onda}`,
              part_number: item.part_number,
              quantidade: 0,
              modificacao: "FINALIZADA",
              modificado_por: executor, // usuario login
              data_modificacao: new Date().toLocaleDateString("pt-BR"),
              pedido_venda: item.pedido_venda.toString(),
            },
          });

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

      //remover item!!

      //historico deleta item
      await prisma.historico.createMany({
        data: {
          part_number: item.part_number,
          modificacao: "FINALIZADO",
          modificado_por: executor, // usuario login
          data_modificacao: new Date().toLocaleDateString("pt-BR"),
          pedido_venda: item.pedido_venda.toString(),
        },
      });

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
