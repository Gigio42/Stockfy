import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ProducaoController {
  constructor() {}

  async getChapasInItemsInMaquinas(id) {
    const maquina = await prisma.maquina.findUnique({
      where: {
        id: id,
      },
      include: {
        Item_Maquina: {
          include: {
            Item: {
              include: {
                chapas: {
                  include: {
                    chapa: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log(maquina);

    return maquina;
  }
}

export default ProducaoController;
