import ComprasController from "../Controllers/ComprasController.js";
import { compraSchema } from "../validators/compraValidators.js";

async function comprasRoutes(fastify, options) {
  const comprasController = new ComprasController(options.db);

  fastify.post("/", {
    schema: compraSchema,
    handler: async (request, reply) => {
      console.log(request.body);
      try {
        await comprasController.createCompra(request.body);
        reply.send({ message: "Data received and inserted into SQLite database successfully" });
      } catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: "Error inserting data into SQLite database", error: err.message });
      }
    },
  });

  // Rota para listar chapas em estoque
  fastify.get("/chapas/estoque", async (request, reply) => {
    try {
      console.log('Recebida requisição para listar chapas em estoque...');
      const chapasEmEstoque = await comprasController.listarChapasEmEstoque();
      reply.send(chapasEmEstoque);
    } catch (error) {
      console.error('Erro ao buscar chapas em estoque:', error);
      reply.code(500).send({ error: "Erro ao buscar chapas em estoque." });
    }
  });

// Rota para receber as medidas conjugadas do cliente
fastify.post("/conjugacoes/confirmed", async (request, reply) => {
  const medidasConjugadas = request.body;

  try {
      const resultado = await comprasController.adicionarMedidasConjugadas(medidasConjugadas);
      reply.send({ message: 'Medidas conjugadas recebidas com sucesso', data: resultado });
  } catch (error) {
      console.error('Erro ao processar medidas conjugadas:', error);
      reply.code(500).send({ error: 'Erro ao processar medidas conjugadas' });
  }
});

}

export default comprasRoutes;
