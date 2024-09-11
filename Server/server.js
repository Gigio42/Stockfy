//server.js
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import log from "./logger.js";
import configureAjv from "./ajv.js";
import registerRoutes from "./API/Routes/index.js";
import axios from 'axios';

const fastify = Fastify({ logger: log });
const ajv = configureAjv();

fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
  return ajv.compile(schema);
});

fastify.register(cors);
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

fastify.get("/", async () => {
  return { text: "Hello, World!" };
});
fastify.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const prisma = new PrismaClient();

let serverPaused = false;

async function ValidarLicensa() {
  try {
    const response = await axios.get("http://localhost:4000/validate", {
      params: { clientId: "JFerres" }
    });
    console.log('License server response:', response.data);
    if (response.data.status !== "active") {
      fastify.log.error("Subscription inactive. Pausing server.");
      serverPaused = true;
    } else {
      if (serverPaused) {
        fastify.log.info("Subscription active. Unpausing server.");
      }
      serverPaused = false;
    }
  } catch (error) {
    fastify.log.error("Error validating subscription:", error);
    serverPaused = true;
  }
}

fastify.addHook('preHandler', async (request, reply) => {
  if (serverPaused) {
    reply.code(503).send({ error: 'Server is paused due to inactive subscription.' });
  }
});

prisma
  .$connect()
  .then(async() => {
    fastify.decorate("db", prisma);

    registerRoutes(fastify);

    //setInterval(ValidarLicensa, 60 * 60 * 1000);

    fastify.listen({ port: port, host: host }, (err, address) => {
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