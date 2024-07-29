import Maquina from "../Models/maquinaModel.js";
import Chapa_Item from "../Models/chapa_itemModel.js";
import Item from "../Models/itemModel.js";
import Item_Maquina from "../Models/item_maquinaModel.js";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class AdmController {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getMaquina() {
    const maquinas = await Maquina.findMany();
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
        conjugacao: true, // Certifique-se de incluir a relação com conjugação
      },
    });

    if (!chapaItems.length) {
      throw new Error(`Nenhum Chapa_Item encontrado`);
    }

    const items = chapaItems.reduce((acc, chapaItem) => {
      const { item } = chapaItem;
      if (!acc[item.id_item]) {
        acc[item.id_item] = {
          ...item,
          chapas: [],
        };
      }
      // Monta o objeto de chapa com seus dados
      const chapaInfo = {
        chapa: chapaItem.chapa,
        quantidade: chapaItem.quantidade,
        terminado: chapaItem.terminado,
      };
      // Adiciona a conjugação, se existir
      if (chapaItem.conjugacao) {
        chapaInfo.conjugacao = chapaItem.conjugacao; // Certifique-se de incluir a conjugação aqui
      }
      acc[item.id_item].chapas.push(chapaInfo);
      return acc;
    }, {});

    return Object.values(items);
  }

  async changeItemStatusProduzindo(
    itemId,
    maquinaId,
    prazo,
    ordem,
    medida,
    op,
    sistema,
    cliente,
    quantidade,
    colaborador,
    prioridade,
    nomeUsuario // Parâmetro adicional para o nome de usuário
  ) {
    try {
      // Formatando o prazo para dd/mm/aaaa
      const prazoFormatado = new Date(prazo).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      console.log(`Prioridade recebida no servidor: ${prioridade}`);
      console.log("Nome do usuário recebido no controlador:", nomeUsuario);

      const status = prioridade === 1 ? "PRODUZINDO" : "PROGRAMADO";

      await prisma.item.update({
        where: { id_item: itemId },
        data: { status: status },
      });

      await prisma.item_Maquina.create({
        data: {
          maquinaId: maquinaId,
          itemId: itemId,
          prazo: prazoFormatado,
          ordem: parseInt(ordem, 10),
          medida: medida,
          op: parseInt(op, 10),
          sistema: sistema,
          cliente: cliente,
          quantidade: parseInt(quantidade, 10),
          colaborador: colaborador,
          prioridade: prioridade,
          executor: nomeUsuario, // Definir o executor como o nome do usuário passado como parâmetro
        },
      });

      const item = await prisma.item.findUnique({
        where: { id_item: itemId },
        select: {
          part_number: true,
          pedido_venda: true,
        },
      });

      if (!item || !item.part_number || !item.pedido_venda) {
        throw new Error("Item não encontrado ou dados incompletos.");
      }

      const maquina = await prisma.maquina.findUnique({
        where: { id_maquina: maquinaId },
        select: { nome: true },
      });

      await prisma.historico.create({
        data: {
          part_number: item.part_number,
          quantidade: parseInt(quantidade, 10),
          modificacao: "PROGRAMADO",
          modificado_por: nomeUsuario,
          data_modificacao: new Date().toLocaleDateString("pt-BR"),
          data_prevista: prazoFormatado,
          pedido_venda: item.pedido_venda.toString(),
          ordem: parseInt(ordem, 10),
          maquina: maquina.nome,
        },
      });

      console.log(
        `Item ${itemId} atualizado para status ${status} com prazo ${prazoFormatado}, ordem ${ordem}, medida ${medida}, op ${op}, sistema ${sistema}, cliente ${cliente}, quantidade ${quantidade}, colaborador ${colaborador}, prioridade ${prioridade}, executor ${nomeUsuario},`
      );
    } catch (error) {
      console.error(
        "Erro ao atualizar o status do item para PRODUZINDO:",
        error
      );
      throw new Error(
        "Erro ao atualizar o status do item para PRODUZINDO: " + error.message
      );
    }
  }

  async getAllItemsPriorities(existingItemMaquinaIds) {
    try {
      // Busca os itens pelos IDs fornecidos com suas prioridades
      const items = await Item_Maquina.findMany({
        where: {
          id_item_maquina: {
            in: existingItemMaquinaIds,
          },
        },
        select: {
          id_item_maquina: true,
          prioridade: true,
        },
      });

      return items;
    } catch (error) {
      throw new Error(
        "Erro ao buscar itens e suas prioridades: " + error.message
      );
    }
  }

  async getAllItemsByMaquina(maquinaId) {
    try {
      const items = await Item_Maquina.findMany({
        where: {
          maquinaId: maquinaId,
        },
        include: {
          Item: true,
        },
        orderBy: {
          prioridade: "asc", // Ordena por prioridade em ordem ascendente
        },
      });

      // Mapeia os itens e inclui o id_item_maquina e a ordem de cada item
      return items.map((item_maquina) => {
        const item = item_maquina.Item;
        return {
          ...item,
          id_item_maquina: item_maquina.id_item_maquina,
          ordem: item_maquina.ordem, // Inclui a coluna "ordem"
          prioridade: item_maquina.prioridade, // Inclui a prioridade
        };
      });
    } catch (error) {
      throw new Error("Erro ao buscar itens para a máquina: " + error.message);
    }
  }

  async updateItemPriorities(newPriorities) {
    try {
      console.log("Recebido para atualização de prioridades:", newPriorities);

      // Verificar se todos os itens existem antes de atualizar
      for (const { id_item_maquina } of newPriorities) {
        const itemMaquinaExists = await Item_Maquina.findUnique({
          where: { id_item_maquina: id_item_maquina },
        });

        if (!itemMaquinaExists) {
          throw new Error(
            `Item_Maquina com id ${id_item_maquina} não encontrado`
          );
        }
      }

      // Encontrar a menor prioridade
      const minPriority = Math.min(
        ...newPriorities.map(({ prioridade }) => prioridade)
      );

      await Promise.all(
        newPriorities.map(async ({ id_item_maquina, prioridade }) => {
          console.log(
            `Atualizando prioridade para item_maquina ${id_item_maquina} para prioridade ${prioridade}`
          );

          // Atualizar a prioridade na tabela Item_Maquina
          await Item_Maquina.update({
            where: { id_item_maquina: id_item_maquina },
            data: { prioridade: prioridade },
          });

          // Obter o id_item associado ao id_item_maquina
          const itemMaquina = await Item_Maquina.findUnique({
            where: { id_item_maquina: id_item_maquina },
            include: { Item: true },
          });

          const itemId = itemMaquina.itemId;

          // Atualizar o status do item na tabela Item
          await Item.update({
            where: { id_item: itemId },
            data: {
              status: prioridade === minPriority ? "PRODUZINDO" : "PROGRAMADO",
            },
          });
        })
      );

      console.log("Prioridades dos itens atualizadas com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar as prioridades dos itens:", error);
      throw new Error(
        "Erro ao atualizar as prioridades dos itens: " + error.message
      );
    }
  }

  async getAllItemMaquina() {
    try {
      const itemMaquinas = await Item_Maquina.findMany({
        include: {
          maquina: true,
          Item: true,
        },
      });
      console.log(itemMaquinas); // Verifique a estrutura dos dados aqui
      return itemMaquinas;
    } catch (error) {
      throw new Error("Erro ao buscar todos os Item_Maquina: " + error.message);
    }
  }

  async deleteItemMaquina(id) {
    try {
      await prisma.item_Maquina.delete({
        where: {
          id_item_maquina: parseInt(id, 10), // Certifique-se de que o ID é um número
        },
      });
      return { success: true };
    } catch (error) {
      console.error("Erro ao excluir o Item_Maquina:", error); // Adicionar log detalhado
      throw new Error("Erro ao excluir o Item_Maquina: " + error.message);
    }
  }

  async checkItemMaquinaExists(itemId, maquinaId) {
    try {
      console.log(
        `Checking existence for itemId: ${itemId}, maquinaId: ${maquinaId}`
      );
      const existingItemMaquina = await Item_Maquina.findFirst({
        where: {
          itemId: itemId,
          maquinaId: maquinaId,
        },
      });

      console.log(`Existence check result: ${!!existingItemMaquina}`);
      return !!existingItemMaquina;
    } catch (error) {
      console.error("Erro ao verificar a existência do item_maquina:", error);
      throw new Error(
        "Erro ao verificar a existência do item_maquina: " + error.message
      );
    }
  }

  async createItemMaquina(itemId, maquinaId) {
    try {
      // Busca o último Item_Maquina para o itemId fornecido
      const lastItem = await Item_Maquina.findFirst({
        where: { itemId: itemId },
        orderBy: { ordem: "desc" },
      });
  
      if (!lastItem) {
        throw new Error(
          `Nenhum Item_Maquina encontrado para o itemId: ${itemId}`
        );
      }
  
      // Define o valor de finalizado baseado na condição
      const finalizadoValue = lastItem.finalizado ? false : lastItem.finalizado;
  
      // Cria uma cópia do último Item_Maquina encontrado
      const newItemMaquina = {
        prazo: lastItem.prazo,
        ordem: lastItem.ordem + 1, // Incrementa a ordem
        executor: lastItem.executor,
        finalizado: finalizadoValue,
        corte: lastItem.corte,
        medida: lastItem.medida,
        op: lastItem.op,
        prioridade: lastItem.prioridade + 1,
        sistema: lastItem.sistema,
        cliente: lastItem.cliente,
        quantidade: lastItem.quantidade,
        colaborador: lastItem.colaborador,
        maquinaId: maquinaId, // Atualiza a máquinaId
        itemId: itemId,
      };
  
      // Cria o novo Item_Maquina com base na cópia ajustada
      const createdItemMaquina = await Item_Maquina.create({
        data: newItemMaquina,
      });
  
      // Formatação e registro no histórico
      const prazoFormatado = new Date(newItemMaquina.prazo).toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );
  
      const item = await prisma.item.findUnique({
        where: { id_item: itemId },
        select: {
          part_number: true,
          pedido_venda: true,
        },
      });
  
      if (!item || !item.part_number || !item.pedido_venda) {
        throw new Error("Item não encontrado ou dados incompletos.");
      }
  
      const maquina = await prisma.maquina.findUnique({
        where: { id_maquina: newItemMaquina.maquinaId },
        select: { nome: true },
      });
  
      await prisma.historico.create({
        data: {
          part_number: item.part_number,
          quantidade: newItemMaquina.quantidade,
          modificacao: "PROGRAMADO",
          modificado_por: newItemMaquina.executor,
          data_modificacao: new Date().toLocaleDateString("pt-BR"),
          pedido_venda: item.pedido_venda.toString(),
          ordem: newItemMaquina.ordem,
          maquina: maquina.nome,
        },
      });
  
      console.log(
        `Item_Maquina duplicado com sucesso para o item ${itemId} e a nova máquina ${maquinaId}.`
      );
  
      return createdItemMaquina; // Retorna o novo Item_Maquina criado
    } catch (error) {
      console.error("Erro ao duplicar Item_Maquina:", error);
      throw new Error("Erro ao duplicar Item_Maquina: " + error.message);
    }
  }
  

  // Método para criar uma nova máquina
  async createMaquina(nome) {
    try {
      const newMaquina = await Maquina.create({
        data: {
          nome: nome,
        },
      });
      return newMaquina;
    } catch (error) {
      console.error("Erro ao criar uma nova máquina:", error);
      throw new Error("Erro ao criar uma nova máquina: " + error.message);
    }
  }
}

async function deleteMaquina(maquinaId) {
  console.log(`Tentando deletar a máquina com ID: ${maquinaId}`);
  try {
    // Verifica se a máquina possui itens associados
    const maquina = await Maquina.findUnique({
      where: {
        id_maquina: maquinaId,
      },
      include: {
        items: true, // Inclui os itens associados à máquina
      },
    });

    if (!maquina) {
      throw new Error(`Máquina com ID ${maquinaId} não encontrada.`);
    }

    // Verifica se há itens associados à máquina
    if (maquina.items.length > 0) {
      // Lança um erro indicando que a máquina possui itens associados
      throw new Error(
        "Não é possível deletar a máquina porque há itens associados a ela."
      );
    }

    // Remove a máquina se não houver itens associados
    const deletedMaquina = await Maquina.delete({
      where: {
        id_maquina: maquinaId,
      },
    });

    console.log(`Máquina com ID ${maquinaId} deletada com sucesso.`);
  } catch (error) {
    console.error("Erro ao deletar a máquina no controlador:", error);
    // Lança o erro novamente para que seja capturado no local onde a função deleteMaquina é chamada
    throw error;
  }
}

export default AdmController;
export { deleteMaquina };
