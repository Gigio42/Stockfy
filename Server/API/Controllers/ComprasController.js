import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class ComprasController {
  constructor() {}

  async createCompra(orderData) {
    const promises = orderData.info_prod_comprados.map(async item => {
      return prisma.chapas.create({ data: item });
    });

    return await Promise.all(promises);
  }
}

export default ComprasController;