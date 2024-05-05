import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';

class PCPController {
    constructor() {}

    async getChapas(query) {
        const chapasRepository = getRepository(Chapas);
        const data = await chapasRepository.find();
    
        const grupoChapas = data.reduce((groups, chapa) => {
            const key = `${chapa.qualidade}-${chapa.medida}-${chapa.onda}-${chapa.coluna}-${chapa.vinco}`;
            if (!groups[key]) {
                groups[key] = {
                    qualidade: chapa.qualidade,
                    medida: chapa.medida,
                    onda: chapa.onda,
                    coluna: chapa.coluna,
                    vinco: chapa.vincos,
                    quantidade_comprada: 0
                };
            }
            groups[key].quantidade_comprada += chapa.quantidade_comprada;
            return groups;
        }, {});
    
        const groupedChapasArray = Object.values(grupoChapas);
    
        return groupedChapasArray;
    }

    async orderItem(body) {
        /* TODO
        const chapasRepository = getRepository(Chapas);
        const newChapa = chapasRepository.create(body);
        await chapasRepository.save(newChapa); */
    }
}

export default PCPController;