import AdmController from "../Controllers/admController.js";
import { postChapaItemMaquinaSchema, getChapaItemMaquinaSchema, getItemSchema } from "../validators/admValidator.js";

async function admRoute(fastify, options) {
  const admController = new AdmController(options.db);

  fastify.get("/maquina", async (request, reply) => {
    try {
      const maquina_id = await admController.getMaquina(request.params.item);
      reply.send(maquina_id);
    } catch (err) {
      reply.code(500).send({ message: "Error retrieving data from SQLite database", error: err.message });
    }
  });

  fastify.get("/items/chapas", async (request, reply) => {
    try {
      const chapas = await admController.getChapasInItems();
      reply.send(chapas);
    } catch (err) {
      reply.code(500).send({ message: "Internal Server Error" });
    }
  });

  fastify.post("/maquina/:maquinaId/item/:itemId/produzindo", async (request, reply) => {
    try {
      const maquinaId = parseInt(request.params.maquinaId, 10); // Captura o ID da máquina da URL
      const itemId = parseInt(request.params.itemId, 10); // Captura o ID do item da URL
      const prazo = request.body.prazo; // Extrai o valor de prazo do corpo da solicitação
      const ordem = parseInt(request.body.ordem, 10); // Converte a ordem para um número inteiro
      const corte = request.body.corte; // Extrai o valor de corte do corpo da solicitação
      await admController.changeItemStatusProduzindo(itemId, maquinaId, prazo, ordem, corte); // Chama a função no controlador para atualizar o status
      reply.send({ message: "Status do item atualizado para PRODUZINDO" });
      console.log(`Solicitação POST para /maquina/${maquinaId}/item/${itemId}/produzindo realizada com sucesso`);
    } catch (err) {
      console.error("Erro ao processar a solicitação POST para /maquina/:maquinaId/item/:itemId/produzindo:", err);
      reply.code(500).send({ message: "Internal Server Error" });
    }
  });

  fastify.get("/maquina/:maquinaId/item", async (request, reply) => {
    try {
      const maquinaId = parseInt(request.params.maquinaId, 10);
      const items = await admController.getAllItemsByMaquina(maquinaId);
      reply.send(items);
    } catch (err) {
      reply.code(500).send({ message: "Internal Server Error" });
    }
  });

  // Nova rota para atualizar a prioridade de um item
  fastify.patch("/item/:itemId/prioridade", async (request, reply) => {
    try {
      const itemId = parseInt(request.params.itemId, 10); // Captura e converte o ID do item da URL para um número inteiro
      const newPriority = request.body.prioridade; // Extrai o valor de prioridade do corpo da solicitação
      const updatedItem = await admController.updateItemPriority(itemId, newPriority); // Chama a função no controlador para atualizar a prioridade
      reply.send({ message: "Prioridade do item atualizada com sucesso", item: updatedItem }); // Envia a resposta com o item atualizado
      console.log(`Solicitação PATCH para /item/${itemId}/prioridade realizada com sucesso`); // Loga o sucesso da operação
    } catch (err) {
      // Se ocorrer um erro, loga o erro e envia uma resposta de erro ao cliente
      console.error("Erro ao processar a solicitação PATCH para /item/:itemId/prioridade:", err);
      reply.code(500).send({ message: "Internal Server Error" });
    }
  });
}

export default admRoute;
