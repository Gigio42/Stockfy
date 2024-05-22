export const getItemMaquinaSchema = {
    params: {
        type: 'object',
        properties: {
            id_item_maquina: { type: 'integer' },
        },
        required: ['id_item_maquina']
    }
};

export const postItemMaquinaSchema = {
    body: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id_item_maquina: { type: 'integer' },
                id_maquina: { type: 'integer' },
                id_item: { type: 'integer' },
            },
            required: ['id_item_maquina','id_maquina','id_item']
        }
    }
};