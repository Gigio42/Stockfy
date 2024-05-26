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
    required: ['partNumber', 'chapas'],
    properties: {
      partNumber: {
        pattern: '^\\d{4}\\.\\d{4}$'
      },
      chapas: {
        items: {
          required: ['chapaID', 'quantity'],
          properties: {
            chapaID: {
              minimum: 1 
            },
            quantity: {
              minimum: 1 
            }
          }
        }
      }
    }
  }
};
