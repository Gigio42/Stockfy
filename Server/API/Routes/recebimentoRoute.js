import RecebimentoController from "../Controllers/RecebimentoController.js";
import { updateRecebimentoSchema, getChapasByIdCompraSchema } from "../validators/recebimentoValidators.js";

async function recebimentoRoute(fastify, options) {
  const recebimentoController = new RecebimentoController(options.db);

  fastify.put("/", {
    schema: updateRecebimentoSchema,
    handler: async (request, reply) => {
      console.log(request.body);

      try {
        await recebimentoController.updateRecebimento(request.body);
        reply.send({ message: "Data received and inserted into SQLite database successfully" });
      } catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: "Error inserting data into SQLite database", error: err.message });
      }
    },
  });

  fastify.get("/:id_compra", {
    schema: getChapasByIdCompraSchema,
    handler: async (request, reply) => {
      console.log(request.params.id_compra);

      try {
        const chapas = await recebimentoController.getChapasByIdCompra(request.params.id_compra);
        reply.send(chapas);
      } catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: "Error retrieving data from SQLite database", error: err.message });
      }
    },
  });
}

export default recebimentoRoute;
