export const getChapaItemMaquinaSchema = {
    params: {
        type: 'object',
        properties: {
            item: { type: 'integer' },
        },
        required: ['item']
    }
};

export const getItemSchema = {
    params: {
        type: 'object',
        properties: {
            item: { type: 'integer' },
        },
        required: ['item']
    }
};

export const postChapaItemMaquinaSchema = {
    body: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id_item_maquina: { type: 'integer' },
                ordem: { type: 'integer' },
                prazo: { type: 'string' },
                maquina: { type: 'integer' },
                item: { type: 'integer' },
                chapa: { type: 'integer' },
                status: {type: 'string'}
            },
            required: ['ordem','prazo','maquina','item','chapa','status']
        }
    }
};