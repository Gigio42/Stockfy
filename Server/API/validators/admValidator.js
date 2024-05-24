export const getItemMaquinaSchema = {
    params: {
        type: 'object',
        properties: {
            itemId: { type: 'integer' },
        },
        required: ['itemId']
    }
};

export const getItemSchema = {
    params: {
        type: 'object',
        properties: {
            itemId: { type: 'integer' },
        },
        required: ['itemId']
    }
};

export const postItemMaquinaSchema = {
    body: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id_item_maquina: { type: 'integer' },
                ordem: { type: 'integer' },
                prazo: { type: 'string' },
                maquinaId: { type: 'integer' },
                itemId: { type: 'integer' },
                status: {type: 'string'}
            },
            required: ['ordem','prazo','maquinaId','itemId','status']
        }
    }
};