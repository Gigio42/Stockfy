import {getRepository} from 'typeorm';
import Chapas from '../Models/Chapas.js';
import Item from '../Models/Item.js';

class PCPController {
    constructor() {}

    async getChapas(query, groupingCriteria, sortOrder, sortBy) {
        const chapasRepository = getRepository(Chapas);
        let data = await chapasRepository.find();

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

        if (sortOrder === 'asc') {
            data.sort((a, b) => a[sortBy] - b[sortBy]);
        } else if (sortOrder === 'desc') {
            data.sort((a, b) => b[sortBy] - a[sortBy]);
        }

        return Object.values(grupoChapas);
    }

    async createItemWithChapa(body) {
        const { chapaId: chapaID, quantity, partNumber } = body;

        const chapasRepository = getRepository(Chapas);
        const itemRepository = getRepository(Item);

        const chapa = await chapasRepository.findOne({ where: { id_chapa: chapaID } });
        console.log(chapa);
    
        if (!chapa) {
            throw new Error('Chapa not found');
        }
    
        chapa.quantidade_estoque -= quantity;
    
        const item = itemRepository.create({
            part_number: partNumber,
            quantidade_part_number: quantity,
            Status: 'RESERVADO',
            chapas: [chapa]
        });
    
        await chapasRepository.save(chapa);
        await itemRepository.save(item);
    
        return item;
    }
}

export default PCPController;