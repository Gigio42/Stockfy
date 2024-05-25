export const compraSchema = {
  body: {
    type: "object",
    properties: {
      info_prod_comprados: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id_compra: { type: "integer" },
            numero_cliente: { type: "integer" },
            fornecedor: { type: "string" },
            unidade: { type: "string" },
            qualidade: { type: "string", maxLength: 200 },
            medida: { type: "string" },
            quantidade_comprada: { type: "number" },
            quantidade_recebida: { type: "number" },
            quantidade_estoque: { type: "number" },
            onda: { type: "string", maxLength: 2 },
            coluna: { type: "integer" },
            vincos: { type: "string", maxLength: 200 },
            gramatura: { type: "number" },
            peso_total: { type: "number" },
            valor_unitario: { type: "string" },
            valor_total: { type: "string" },
            status: { type: "string", maxLength: 10 },
            data_compra: { type: "string" },
            data_prevista: { type: "string" },
            data_recebimento: { type: "string" },
          },
          required: ["id_compra", "numero_cliente", "qualidade"],
        },
      },
    },
  },
};
