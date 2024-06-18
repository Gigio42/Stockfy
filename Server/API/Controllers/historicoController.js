import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class HistoricoController {
  constructor() {}

  async getChapas() {
    const chapas = await prisma.Chapas.findMany();
    return chapas;
  }

  async getItems() {
    const items = await prisma.Item.findMany({
      include: {
        maquinas: {
          include: {
            maquina: true,
          },
        },
      },
    });
    return items;
  }
}

export default HistoricoController;
