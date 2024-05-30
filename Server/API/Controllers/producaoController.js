import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ProducaoController {
  constructor() {}

  async getChapasInItemsInMaquinas(name) {
    const maquina = await prisma.maquina.findFirst({
      where: {
        nome: name,
      },
      select: {
        nome: true,
        items: {
          where: {
            Item: {
              status: {
                not: "FINALIZADO",
              },
            },
          },
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

    console.log(JSON.stringify(maquina, null, 2));

    return maquina;
  }

  async markItemAsProduzido(id) {
    const item = await prisma.item.update({
      where: {
        id_item: id,
      },
      data: {
        status: "FINALIZADO",
      },
    });

    return item;
  }
}

export default ProducaoController;
