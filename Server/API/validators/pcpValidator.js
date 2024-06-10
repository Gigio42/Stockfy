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
    required: ["partNumber", "chapas", "reservedBy"], // Add "reservedBy" here if it's required
    properties: {
      partNumber: {
        type: "string",
        pattern: "^\\d{4}\\.\\d{4}$",
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
            },
            quantity: {
              type: "number",
              minimum: 1,
            },
          },
        },
      },
      reservedBy: { type: "string" }, // Add this line
    },
  },
};
