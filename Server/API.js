import Fastify from 'fastify';
import pino from 'pino';
import cors from '@fastify/cors';
import database from './Database.js';
import stream from 'stream';
import chalk from 'chalk';

const logThrough = new stream.Transform({
  transform(chunk, encoding, callback) {
    let logData = JSON.parse(chunk.toString());
    let logTime = new Date(logData.time);
    let formattedTime = `${logTime.getHours().toString().padStart(2, '0')}:${logTime.getMinutes().toString().padStart(2, '0')}:${logTime.getSeconds().toString().padStart(2, '0')}`;
    let maskedMessage = logData.msg.replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, '***.***.***.***').replace(/\[::1\]/g, 'localhost');
    let formattedMessage = `[${chalk.green(formattedTime)}] ${maskedMessage}\n`;

    if (logData.req && logData.req.remoteAddress) {
      let maskedAddress = logData.req.remoteAddress.replace(/\d{1,3}(?=\.\d{1,3}\.\d{1,3}\.\d{1,3})/g, '***');
      formattedMessage += `Request: ${chalk.blue(`${logData.req.method} ${logData.req.url} from ${maskedAddress}:${logData.req.remotePort}`)}\n`;
    }

    if (logData.res) {
      formattedMessage += `Response: ${chalk.red(logData.res.statusCode)}\n`;
    }

    this.push(formattedMessage + '\n');
    callback();
  }
});

const log = pino({ level: 'info' }, logThrough);
logThrough.pipe(process.stdout);

const fastify = Fastify({ logger: log });

fastify.register(cors);

fastify.get('/', async (request, reply) => {
  return { text: 'Hello, World!' };
});

import recebimentoRoutes from './Routes/recebimento.js';

database().then(() => {
  fastify.register(recebimentoRoutes, { prefix: '/recebimento' });

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