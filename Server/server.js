import Fastify from 'fastify';
import cors from '@fastify/cors';
import database from './Database.js';
import log from './logger.js';
import registerRoutes from './API/Routes/index.js';

const fastify = Fastify({ logger: log });
fastify.register(cors);
const port = process.env.PORT || 5500;

fastify.get('/', async (request, reply) => {
  return { text: 'Hello, World!' };
});

database().then(() => {
  registerRoutes(fastify);

  fastify.listen({ port: port, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server running on ${address}`);
  });
}).catch(err => {
  fastify.log.error(err);
});