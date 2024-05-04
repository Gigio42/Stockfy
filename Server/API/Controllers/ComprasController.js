import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';

class ComprasController {
  constructor() {}

  async createCompra(orderData) {
    const chapasRepository = getRepository(Chapas);

    const promises = orderData.info_prod_comprados.map(async item => {
      const [id_compra, id_compra_chapa] = item.id_compra.split('/').map(Number);

      const newChapa = chapasRepository.create({
        ...item,
        id_compra,
        id_compra_chapa: id_compra_chapa || 1,
      });

      return chapasRepository.save(newChapa);
    });

    return await Promise.all(promises);
  }
}

export default ComprasController;