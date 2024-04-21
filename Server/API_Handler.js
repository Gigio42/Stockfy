const fastify = require('fastify')({ logger: {
  level: 'info',
  redact: ['req.headers.authorization']
} });
const cors = require('@fastify/cors');
const Database = require('./Database');

fastify.register(cors); // middleware to solve issue with different hosts (3000 for server and 5500 for client)

const database = new Database('./estoque.db'); 

const recebimentoRoutes = require('./Routes/recebimento');
fastify.register(recebimentoRoutes, { prefix: '/recebimento', db: database });

fastify.listen({ port: 5500, host: 'localhost' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server running on ${address}`);
});