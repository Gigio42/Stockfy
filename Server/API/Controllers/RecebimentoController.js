import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';

class RecebimentoController {
  constructor() {}

  async updateRecebimento(data) {
    if (!data.info_prod_recebidos) {
      throw new Error('info_prod_recebidos is undefined');
    }
  
    const chapasRepository = getRepository(Chapas);
  
    const promises = data.info_prod_recebidos.map(async item => {
      if (!item.id_compra) {
        throw new Error('id_compra is undefined');
      }
  
      const [id_compra, id_compra_chapa_inicial] = item.id_compra.split('/').map(Number);
      let id_compra_chapa = !isNaN(id_compra_chapa_inicial) ? id_compra_chapa_inicial : 1;
  
      const chapa = await chapasRepository.findOne({ where: { id_compra, id_compra_chapa } });
      if (!chapa) {
        throw new Error(`Chapa with id ${item.id_compra} not found`);
      }
  
      chapa.data_recebimento = item.data_recebimento;
      chapa.quantidade_recebida = item.quantidade_recebida;
      // Perguntar se no XML, quando recebe parcialmente, a quantidade
      //vem depois só o que restou ou a quantidade total que foi comprada
      chapa.quantidade_estoque += item.quantidade_recebida - chapa.quantidade_estoque; 
      chapa.status = item.status;
  
      return chapasRepository.save(chapa);
    });
  
    return await Promise.all(promises);
  }

  async getChapasByIdCompra(id_compra) {
    if (!id_compra) {
      throw new Error('id_compra is undefined');
    }
  
    const chapasRepository = getRepository(Chapas);
  
    const chapas = await chapasRepository.find({ 
      where: { id_compra },
      select: [
        'id_compra',
        'id_compra_chapa',
        'fornecedor',
        'qualidade',
        'medida',
        'quantidade_comprada',
        'onda',
        'coluna',
        'vincos',
        'status'
      ],
    });
  
    if (!chapas.length) {
      throw new Error(`No chapas found with id_compra ${id_compra}`);
    }
  
    return chapas;
  }
}

export default RecebimentoController;