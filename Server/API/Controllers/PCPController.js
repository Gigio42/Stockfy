import {getRepository} from 'typeorm';
import Chapas from '../Models/Chapas.js';

class PCPController {
    constructor() {
    }

    async getChapas(query, groupingCriteria, sortOrder, sortBy) {
        const chapasRepository = getRepository(Chapas);
        let data = await chapasRepository.find();

        if (sortOrder === 'asc') {
            data.sort((a, b) => a[sortBy] - b[sortBy]);
        } else if (sortOrder === 'desc') {
            data.sort((a, b) => b[sortBy] - a[sortBy]);
        }

        const grupoChapas = data.reduce((groups, chapa) => {
            const key = groupingCriteria.map(criterion => chapa[criterion]).join('-');
            if (!groups[key]) {
                groups[key] = {
                    chapas: [],
                    quantidade_comprada: 0
                };
                groupingCriteria.forEach(criterion => {
                    groups[key][criterion] = chapa[criterion];
                });
            }
            groups[key].quantidade_comprada += chapa.quantidade_comprada;
            groups[key].chapas.push(chapa);
            return groups;
        }, {});

        return Object.values(grupoChapas);
    }

    async orderItem(body) {
        /* TODO
        const chapasRepository = getRepository(Chapas);
        const newChapa = chapasRepository.create(body);
        await chapasRepository.save(newChapa); */
    }
}

export default PCPController;