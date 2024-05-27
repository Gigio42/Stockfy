import AdmController from "../Controllers/admController.js";

async function producaoRoute(fastify, options) {
  const admController = new AdmController(options.db);

  fastify.get("/maquina/:id/itens/chapas", {
    handler: async (request, reply) => {
      try {
        const id = request.params.id;
        const data = await admController.getChapasInItemsInMaquinas(id);
        reply.send(data);
      } catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: "Error retrieving data from SQLite database", error: err.message });
      }
    },
  });
}

export default producaoRoute;
