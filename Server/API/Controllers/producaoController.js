import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ProducaoController {
  constructor() {}

  async getChapasInItemsInMaquinas(name) {
    const maquina = await prisma.maquina.findFirst({
      where: {
        name: name,
      },
      select: {
        name: true,
        items: {
          select: {
            ordem: true,
            prazo: true,
            Item: {
              select: {
                part_number: true,
                status: true,
                chapas: {
                  select: {
                    quantidade: true,
                    terminado: true,
                    chapa: {
                      select: {
                        qualidade: true,
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
}

export default ProducaoController;
