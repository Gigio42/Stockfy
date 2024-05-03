import Fastify from 'fastify';
import cors from '@fastify/cors';
import database from './Database.js';
import log from './logger.js';

import comprasRoute from './Routes/compras.js'
import recebimentoRoute from './Routes/recebimento.js';
import pcpRoute from './Routes/PCP.js';


const fastify = Fastify({ logger: log });
fastify.register(cors);

fastify.get('/', async (request, reply) => {
  return { text: 'Hello, World!' };
});

database().then(() => {

  fastify.register(comprasRoute, { prefix: '/compras' });

  fastify.register(recebimentoRoute, { prefix: '/recebimento' });

  fastify.register(pcpRoute, { prefix: '/PCP' });

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