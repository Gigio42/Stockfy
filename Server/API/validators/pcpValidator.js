export const getChapasSchema = {
  query: {
    type: "object",
    properties: {
    },
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
    properties: {
      partNumber: { type: "string" },
      chapas: {
        type: "array",
        not: { type: "null" },
        items: {
          type: "object",
          properties: {
            chapaID: { type: "integer" },
            quantity: { type: "integer" },
            medida: { type: "string" },
            keepRemaining: { type: "boolean" },
          },
          required: ["chapaID", "quantity", "medida", "keepRemaining"],
        },
      },
    },
    required: ["partNumber", "chapas"],
  },
};
