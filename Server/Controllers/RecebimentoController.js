import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';

class RecebimentoController {
    constructor() {}

    async createRecebimentos(data) {
    const chapasRepository = getRepository(Chapas);

    const promises = data.info_prod_comprados.map(item => {
        const chapa = chapasRepository.create(item);
        return chapasRepository.save(chapa);
    });

    return await Promise.all(promises);
    }
}
  
export default RecebimentoController;