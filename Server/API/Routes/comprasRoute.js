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
      console.log('Chapas em estoque encontradas:', chapasEmEstoque);
      reply.send(chapasEmEstoque);
    } catch (error) {
      console.error('Erro ao buscar chapas em estoque:', error);
      reply.code(500).send({ error: "Erro ao buscar chapas em estoque." });
    }
  });
}

export default comprasRoutes;
