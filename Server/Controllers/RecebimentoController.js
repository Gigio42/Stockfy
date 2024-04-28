import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';

class RecebimentoController {
    constructor() {}

    async createRecebimentos(data) {
        const chapasRepository = getRepository(Chapas);

        const promises = data.map(item => {
            const [qualidade, medida, quantidade, vincos] = item;
            const chapa = chapasRepository.create({ qualidade, medida, quantidade, vincos });
            return chapasRepository.save(chapa);
        });

        return await Promise.all(promises);
    }
}
  
export default RecebimentoController;