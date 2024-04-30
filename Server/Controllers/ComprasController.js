import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';
import Lote from '../Models/Lotes.js';

class ComprasController {
  constructor() {}

  async createCompra(orderData) {
    const chapasRepository = getRepository(Chapas);
    const loteRepository = getRepository(Lote);

    const promises = orderData.map(async item => {
      const [
        fornecedor, data_compra, codigoDoProduto, quantidade_comprada, valorUnitario,
        valor_total, qualidade, medida, onda, vincos, status
      ] = item;

      let lote = await loteRepository
        .createQueryBuilder('lote')
        .innerJoin('lote.chapas', 'chapa')
        .where('chapa.qualidade = :qualidade')
        .andWhere('chapa.medida = :medida')
        .andWhere('chapa.onda = :onda')
        .andWhere('chapa.vincos = :vincos')
        .setParameters({ qualidade, medida, onda, vincos })
        .getOne();

      if (!lote) {
        lote = loteRepository.create({ quantidade_total_comprada: quantidade_comprada });
      } else {
        lote.quantidade_total_comprada += quantidade_comprada;
      }

      await loteRepository.save(lote);

      const newChapa = chapasRepository.create({
        fornecedor, data_compra, codigoDoProduto, quantidade_comprada, valorUnitario,
        valor_total, qualidade, medida, onda, vincos, status, lote
      });

      return chapasRepository.save(newChapa);
    });

    return await Promise.all(promises);
  }
}

export default ComprasController;