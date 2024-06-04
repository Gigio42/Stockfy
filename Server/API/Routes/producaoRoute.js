import ProducaoController from "../Controllers/producaoController.js";

async function producaoRoute(fastify, options) {
  const producaoController = new ProducaoController(options.db);

  fastify.get("/maquina/:name/itens/chapas", {
    handler: async (request, reply) => {
      try {
        const name = request.params.nome;
        const data = await producaoController.getChapasInItemsInMaquinas(name);
        reply.send(data);
      } catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: "Error retrieving data from SQLite database", error: err.message });
      }
    },
  });

  fastify.put("/item/:id/maquina/:maquinaName", {
    handler: async (request, reply) => {
      try {
        const id = parseInt(request.params.id, 10);
        const maquinaName = request.params.maquinaName;
        const result = await producaoController.markItemAsFinalizado(id, maquinaName);
        reply.send(result);
      } catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: "Error updating item status in SQLite database", error: err.message });
      }
    },
  });
}

export default producaoRoute;
