import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';

class RecebimentoController {
  constructor() {}

  async updateRecebimento(data) {
    if (!Array.isArray(data)) {
      throw new Error('Data must be an array');
    }

    console.log(data);
  
    const chapasRepository = getRepository(Chapas);
  
    const promises = data.map(async item => {
      if (!item.id_chapa) {
        throw new Error('id_chapa is undefined');
      }
  
      const chapaProcurada = item.id_chapa;
      const chapa = await chapasRepository.findOne({ where: { id_chapa: chapaProcurada } });
      if (!chapa) {
        throw new Error(`Chapa with id ${item.id_chapa} not found`);
      }
  
      chapa.data_recebimento = item.data_recebimento;
      chapa.quantidade_recebida += item.quantidade_recebida;
      chapa.quantidade_estoque += item.quantidade_recebida; 
      chapa.status = item.status;
  
      return chapasRepository.save(chapa);
    });
  
    return await Promise.all(promises);
  }

  async getChapasByIdCompra(id_compra) {
    if (!id_compra) throw new Error('id_compra is undefined');
  
    const chapasRepository = getRepository(Chapas);
  
    const chapas = await chapasRepository.find({ 
      where: { id_compra },
      select: [
        'id_chapa',
        'id_compra',
        'fornecedor',
        'qualidade',
        'medida',
        'onda',
        'vincos',
        'status',
        'data_compra',
        'data_prevista',
        'data_recebimento',
        'quantidade_comprada',
        'valor_unitario',
        'quantidade_recebida',
        'valor_total'
      ],

    });
  
    if (!chapas.length) {
      throw new Error(`No chapas found with id_compra ${id_compra}`);
    }
  
    return chapas;
  }
}

export default RecebimentoController;