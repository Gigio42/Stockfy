import PCPController from '../Controllers/PCPController.js';

async function pcpRoute(fastify, options) {
  const pcpRouteController = new PCPController(options.db);

  fastify.get('/', async (request, reply) => {
    try {
        const data = await pcpRouteController.getChapas(request.query);
        reply.send(data);
    } catch (err) {
        console.log(err.message);
        reply.code(500).send({ message: 'Error retrieving data from SQLite database', error: err.message });
    }
  });

  fastify.post('/', async (request, reply) => {
    try {
      await pcpRouteController.orderItem(request.body);
      reply.send({ message: 'Data received and inserted into SQLite database successfully' });
    } catch (err) {
      console.log(err.message);
      reply.code(500).send({ message: 'Error inserting data into SQLite database', error: err.message });
    }
  });
};

export default pcpRoute;