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

  fastify.post("/atualizar-prioridades", async (request, reply) => {
    try {
      const newPriorities = request.body;
      console.log("Dados recebidos na rota /atualizar-prioridades:", newPriorities);
      await admController.updateItemPriorities(newPriorities);
      reply.send({ message: "Prioridades atualizadas com sucesso" });
      console.log("Prioridades atualizadas com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar as prioridades:", err);
      reply.code(500).send({ message: "Erro ao atualizar as prioridades" });
    }
  });

  fastify.get("/item_maquina", async (request, reply) => {
    try {
      const itemMaquinas = await admController.getAllItemMaquina(); // Nova função no controlador para buscar todos os Item_Maquina
      reply.send(itemMaquinas);
    } catch (err) {
      reply.code(500).send({ message: "Internal Server Error" });
    }
  });

  fastify.post("/item_maquina/selecionar-maquinas", async (request, reply) => {
    try {
<<<<<<< HEAD
        const items = request.body;

        for (const { itemId, maquinaId, ordem } of items) {
            await admController.createItemMaquina(itemId, maquinaId, ordem);
        }

        reply.send({ message: "Itens_Maquina criados com sucesso." });
=======
      const items = request.body; // Espera que o corpo da requisição seja uma lista de objetos com itemId e maquinaId

      for (const { itemId, maquinaId } of items) {
        await admController.createItemMaquina(itemId, maquinaId);
      }

      reply.send({ message: "Itens_Maquina criados com sucesso." });
>>>>>>> c00d5fc42614d4b4e38d5c0e75940b4b903c561b
    } catch (err) {
        console.error("Erro ao criar Itens_Maquina:", err);
        reply.code(500).send({ message: "Erro ao criar Itens_Maquina." });
    }
<<<<<<< HEAD
});

  
  
  
  }
  
  
=======
  });
}
>>>>>>> c00d5fc42614d4b4e38d5c0e75940b4b903c561b

export default admRoute;
