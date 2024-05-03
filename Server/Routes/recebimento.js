import RecebimentoController from '../Controllers/RecebimentoController.js';

async function recebimentoRoute(fastify, options) {
  const recebimentoController = new RecebimentoController(options.db);

  fastify.post('/', async (request, reply) => {
    console.log(request.body);

    try {
      await recebimentoController.createRecebimentos(request.body);
      reply.send({ message: 'Data received and inserted into SQLite database successfully' });
    } catch (err) {
      console.log(err.message);
      reply.code(500).send({ message: 'Error inserting data into SQLite database', error: err.message });
    }
  });

  fastify.get('/chapafornecedor/:fornecedor', async (request, reply) => {
    try {
      const fornecedor = request.params.fornecedor;
      const chapas = await recebimentoController.getChapasByFornecedor(fornecedor);
      return reply.send(chapas);
    } catch (err) {
      console.log(err.message);
      return reply.code(500).send({ message: 'Error retrieving data from SQLite database', error: err.message });
    }
  });
};

export default recebimentoRoute;