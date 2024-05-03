import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';

class RecebimentoController {
    constructor() {}

    async createRecebimentos(data) {
        const chapasRepository = getRepository(Chapas);

        const promises = data.map(item => {
            // Assegure que os campos correspondam ao modelo Chapas
            const chapa = chapasRepository.create({
                fornecedor: item.supplier,
                qualidade: item.quality,
                medida: item.measure,
                quantidade_recebida: parseFloat(item.quantity), // Certifique-se de converter para o tipo esperado
                onda: item.waveType,
                vincos: item.creased,
                valor_total: parseFloat(item.totalPrice), // Conversão para decimal conforme definido no modelo
                status: item.status,
                data_compra: new Date(item.purchaseDate),
                data_recebimento: new Date(item.lastUpdated) // Supondo que lastUpdated seja a data de recebimento
            });

            return chapasRepository.save(chapa);
        });

        return await Promise.all(promises);
    }

    async getChapasByFornecedor(fornecedor) {
        const chapasRepository = getRepository(Chapas);
        return await chapasRepository.find({
            where: {
                fornecedor: fornecedor
            }
        });
    }
    
}

export default RecebimentoController;
