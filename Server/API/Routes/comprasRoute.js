import ComprasController from "../Controllers/ComprasController.js";
import { compraSchema } from "../validators/compraValidators.js";

async function comprasRoutes(fastify, options) {
  const comprasController = new ComprasController(options.db);

  fastify.post("/", {
    schema: compraSchema,
    handler: async (request, reply) => {
      console.log(request.body);
      try {
        await comprasController.criarChapas(request.body);
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

// Rota para receber os cartões criados do cliente
fastify.post("/compras/cartoes", async (request, reply) => {
  const cartoesCriados = request.body;

  try {
    const resultado = await comprasController.adicionarCartoesCriados(cartoesCriados);
    reply.send({ message: 'Cartões criados recebidos com sucesso', data: resultado });
  } catch (error) {
    console.error('Erro ao processar cartões criados:', error);
    reply.code(500).send({ error: 'Erro ao processar cartões criados' });
  }
});

// Rota para receber os cartões criados do cliente
fastify.post("/conjugacoes/confirmed", async (request, reply) => {
  const medidasConjugConfimed = request.body;

  try {
    const resultado = await comprasController.adicionarMedidasConjugadas(medidasConjugConfimed);
    reply.send({ message: 'Cartões criados recebidos com sucesso', data: resultado });
  } catch (error) {
    console.error('Erro ao processar cartões criados:', error);
    reply.code(500).send({ error: 'Erro ao processar cartões criados' });
  }
});

}

export default comprasRoutes;
