import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';

class ComprasController {
  constructor() {}

  async createCompra(orderData) {
    const chapasRepository = getRepository(Chapas);
  
    const promises = orderData.info_prod_comprados.map(async item => {
      const newChapa = chapasRepository.create(item);
      return chapasRepository.save(newChapa);
    });
  
    return await Promise.all(promises);
  }
}

export default ComprasController;