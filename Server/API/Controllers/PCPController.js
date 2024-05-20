import { getRepository } from 'typeorm';
import Chapas from '../Models/Chapas.js';
import Item from '../Models/Item.js';
import Chapa_Item from '../Models/Chapa_Item.js';

class PCPController {
    constructor() { }

    async getChapas(query, groupingCriteria, sortOrder, sortBy) {
        const chapasRepository = getRepository(Chapas);
        let data = await chapasRepository.find({ relations: ['conjugacoes'] });

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

        const sortedChapas = Object.values(grupoChapas).sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy] < b[sortBy] ? -1 : a[sortBy] > b[sortBy] ? 1 : 0;
            } else {
                return a[sortBy] > b[sortBy] ? -1 : a[sortBy] < b[sortBy] ? 1 : 0;
            }
        });

        return sortedChapas;
    }

    async createItemWithChapa(body) {
        console.log(body)
        const { chapaID, quantity, medida, partNumber, keepRemaining } = body;
    
        const chapasRepository = getRepository(Chapas);
        const itemRepository = getRepository(Item);
        const chapaItemRepository = getRepository(Chapa_Item);

        console.log("the chapa id is: ", chapaID)
    
        const chapa = await chapasRepository.findOne({ where: { id_chapa: chapaID } });

        console.log(chapa)
    
        if (!chapa) {
            throw new Error('Chapa not found');
        }
    
        if (!quantity) {
            throw new Error('Quantity is required');
        }
    
        chapa.quantidade_estoque -= quantity;

        if (keepRemaining) {
            const [chapaWidth, chapaHeight] = chapa.medida.split('x').map(Number);
            const [chosenWidth, chosenHeight] = medida.split('x').map(Number);

            if (chapaWidth < chosenWidth || chapaHeight < chosenHeight) {
                throw new Error('Not enough chapas of the specified dimensions');
            }

            const originalArea = chapaWidth * chapaHeight;
            const usedArea = chosenWidth * chosenHeight;
            const remainingArea = originalArea - usedArea;

            const { id_chapa, medida, ...chapaProps } = chapa;

            const newChapa = chapasRepository.create({
                ...chapaProps,
                area: remainingArea,
                quantidade_estoque: quantity,
                status: 'RESTO'
            });

            await chapasRepository.save(newChapa);
        }

        await chapasRepository.save(chapa);

        const item = itemRepository.create({
            part_number: partNumber,
            Status: 'RESERVADO',
            chapas: [chapa]
        });

        await itemRepository.save(item);

        const chapaItem = chapaItemRepository.create({
            chapa: chapa,
            item: item,
            quantidade: quantity
        });

        await chapaItemRepository.save(chapaItem);

        return item;
    }
}

export default PCPController;