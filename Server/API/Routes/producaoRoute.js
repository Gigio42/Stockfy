import ProducaoController from "../Controllers/producaoController.js";

async function producaoRoute(fastify, options) {
  const producaoController = new ProducaoController(options.db);

  fastify.get("/maquina/:name/itens/chapas", {
    handler: async (request, reply) => {
      try {
        const name = request.params.name;
        const data = await producaoController.getChapasInItemsInMaquinas(name);
        reply.send(data);
      } catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: "Error retrieving data from SQLite database", error: err.message });
      }
    },
  });
}

export default producaoRoute;
