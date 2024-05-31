import AdmController from "../Controllers/admController.js";
import { postChapaItemMaquinaSchema, getChapaItemMaquinaSchema, getItemSchema } from "../validators/admValidator.js";

async function admRoute(fastify, options) {
  const admController = new AdmController(options.db);

  fastify.get("/maquina", async (request, reply) => {
    try {
      const maquina_id = await admController.getMaquina(request.params.item);
      reply.send(maquina_id);
    } catch (err) {
      console.log(err.message);
      reply.code(500).send({ message: "Error retrieving data from SQLite database", error: err.message });
    }
  });

  fastify.get("/maquinas/items/chapas", async (request, reply) => {
    try {
      const maquina_id = await admController.getChapasInItemsInMaquinas();
      reply.send(maquina_id);
    } catch (err) {
      console.log(err.message);
      reply.code(500).send({ message: "Error retrieving data from SQLite database", error: err.message });
    }
  });

  fastify.get("/items/chapas", async (request, reply) => {
    try {
      const chapas = await admController.getChapasInItems();
      reply.send(chapas);
    } catch (err) {
      console.error(err); // Registrar o erro no console do servidor
      reply.code(500).send({ message: "Internal Server Error" });
    }
  });

  fastify.post("/maquina/:maquinaId/item/:itemId/produzindo", async (request, reply) => {
    console.log(request.params.itemId)
    try {
      const maquinaId = parseInt(request.params.maquinaId, 10); // Captura o ID do item da URL
      const itemId = parseInt(request.params.itemId, 10); // Captura o ID do item da URL
      await admController.changeItemStatusProduzindo(itemId, maquinaId); // Chama a função no controller para atualizar o status
      reply.send({ message: "Status do item atualizado para PRODUZINDO" });
    } catch (err) {
      console.error(err); // Registrar o erro no console do servidor
      reply.code(500).send({ message: "Internal Server Error" });
    }
  });
  
}

export default admRoute;
