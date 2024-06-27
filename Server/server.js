import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import log from "./logger.js";
import registerRoutes from "./API/Routes/index.js";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import AjvErrors from "ajv-errors";

const fastify = Fastify({ logger: log });

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: "array",
});

addFormats(ajv);
AjvErrors(ajv);

fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
  return ajv.compile(schema);
});

fastify.register(cors);
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

fastify.get("/", async () => {
  return { text: "Hello, World!" };
});

fastify.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    fastify.decorate("db", prisma);

    registerRoutes(fastify);

    fastify.listen({ port: port, host: host }, (err, address) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      fastify.log.info(`Server running on ${address}`);
      console.log("acesse esse link:https://stockfysite.onrender.com/login/login.html ");
    });
  })
  .catch((err) => {
    fastify.log.error(err);
  });
