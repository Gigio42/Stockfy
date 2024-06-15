import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class HistoricoController {
  constructor() {}

  async getChapas() {
    const chapas = await prisma.chapas.findMany();
    return chapas;
  }
}

export default HistoricoController;
