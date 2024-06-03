export const usuarioSchema = {
  querystring: {
    type: "object",
    properties: {
      name: { type: "string" },
      password: { type: "string" }
    },
    required: ["name", "password"]
  }
};

export const addUserSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1 },
      password: { type: 'string', minLength: 1 }
    },
    required: ['name', 'password']
  }
};

