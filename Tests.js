import { getRepository } from 'typeorm';
import Lotes from '../Server/Models/Lotes';
import Chapas from '../Server/Models/Chapas';

async function insertChapasToLote() {
    const loteRepository = getRepository(Lotes);
    const chapaRepository = getRepository(Chapas);

    // Assuming you already have a Lote entity
    const lote = await loteRepository.findOne({ id: 1 });

    // Create new Chapas entities
    const chapas = [
        chapaRepository.create({ lote: lote, /* other properties */ }),
        chapaRepository.create({ lote: lote, /* other properties */ }),
        // add as many Chapas as you want
    ];

    // Save the Chapas entities
    await chapaRepository.save(chapas);
}

insertChapasToLote();