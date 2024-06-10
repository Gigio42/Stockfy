export const getChapasSchema = {
  query: {
    type: "object",
    properties: {},
  },
  filterCriteria: {
    type: "object",
    properties: {
      comprimento: { type: "string" },
      largura: { type: "string" },
    },
  },
  sortOrder: { type: "string", enum: ["asc", "desc"] },
  sortBy: { type: "string" },
};

export const getItemsSchema = {
  searchQuery: { type: "string" },
};

export const createItemWithChapaSchema = {
  body: {
    type: "object",
    required: ["partNumber", "chapas", "reservedBy"],
    properties: {
      partNumber: {
        type: "string",
        pattern: "^\\d{4}\\.\\d{4}$",
        errorMessage: "part number deve existir e estar no formato xxxx.xxxx",
      },
      chapas: {
        type: "array",
        items: {
          type: "object",
          required: ["chapaID", "quantity"],
          properties: {
            chapaID: {
              type: "number",
              minimum: 1,
              errorMessage: "chapaID deve ser um número e pelo menos 1",
            },
            quantity: {
              type: "number",
              minimum: 1,
              errorMessage: "quantidade deve ser um número maior que zero",
            },
          },
        },
      },
      reservedBy: {
        type: "string",
        errorMessage: "reservedBy deve ser uma string",
      },
    },
  },
};