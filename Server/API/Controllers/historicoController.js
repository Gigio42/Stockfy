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
        maquinas: true, // Include all Item_Maquina related to each Item
      },
    });
    return items;
  }
}

export default HistoricoController;
