import ComprasController from '../Controllers/ComprasController.js';

async function comprasRoutes (fastify, options) {
  const comprasController = new ComprasController(options.db);

  fastify.post('/', async (request, reply) => {
    console.log(request.body);

    try {
      await comprasController.createCompra(request.body);
      reply.send({ message: 'Data received and inserted into SQLite database successfully' });
    } catch (err) {
      console.log(err.message);
      reply.code(500).send({ message: 'Error inserting data into SQLite database', error: err.message });
    }
  });

};

export default comprasRoutes;