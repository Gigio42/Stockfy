import Fastify from 'fastify';
import cors from '@fastify/cors';
import database from './Database.js';
import log from './logger.js';

import recebimentoRoutes from './Routes/recebimento.js';
import comprasRoutes from './Routes/compras.js'

const fastify = Fastify({ logger: log });
fastify.register(cors);

fastify.get('/', async (request, reply) => {
  return { text: 'Hello, World!' };
});

database().then(() => {

  fastify.register(recebimentoRoutes, { prefix: '/recebimento' });

  fastify.register(comprasRoutes, { prefix: '/compras' });

  fastify.listen({ port: 5500, host: 'localhost' }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server running on ${address}`);
  });
}).catch(err => {
  fastify.log.error(err);
});