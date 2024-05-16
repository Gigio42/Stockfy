export const updateRecebimentoSchema = {
    body: {
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id_compra: { type: 'integer' },
                data_recebimento: { type: 'string', format: 'date-time' },
                quantidade_recebida: { type: 'number' },
                status: { type: 'string' }
            },
            required: ['id_compra', 'data_recebimento', 'quantidade_recebida', 'status']
        }
    }
};

export const getChapasByIdCompraSchema = {
    params: {
        type: 'object',
        properties: {
            id_compra: { type: 'string' },
        },
        required: ['id_compra']
    }
};