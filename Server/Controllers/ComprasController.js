import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';

class ComprasController {
  constructor() {}

  async createCompra(orderData) {
    const chapasRepository = getRepository(Chapas);

    const promises = orderData.info_prod_comprados.map(async item => {
      const {
        fornecedor, data_compra, descrição: codigoDoProduto, "quant.": quantidade_comprada, 
        "valor_lote_chapa": valorUnitario, "valor_lote_chapa": valor_total, 
        "qual.": qualidade, descrição: medida, onda, "coluna": vincos, 
        "pedido_compra": status
      } = item;

      const newChapa = chapasRepository.create({
        fornecedor, data_compra, codigoDoProduto, quantidade_comprada, valorUnitario,
        valor_total, qualidade, medida, onda, vincos, status
      });

      return chapasRepository.save(newChapa);
    });

    return await Promise.all(promises);
  }
}

export default ComprasController;