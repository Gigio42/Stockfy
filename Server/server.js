import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import log from "./logger.js";
import registerRoutes from "./API/Routes/index.js";

const fastify = Fastify({ logger: log });
fastify.register(cors);
const port = process.env.PORT || 3000;

fastify.get("/", async () => {
  return { text: "Hello, World!" };
});

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    fastify.decorate("db", prisma);

    registerRoutes(fastify);

    fastify.listen({ port: port, host: "localhost" }, (err, address) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      fastify.log.info(`Server running on ${address}`);
    });
  })
  .catch((err) => {
    fastify.log.error(err);
  });
