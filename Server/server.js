//server.js
import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import log from "./logger.js";
import configureAjv from "./ajv.js";
import registerRoutes from "./API/Routes/index.js";

const fastify = Fastify({ logger: log });
const ajv = configureAjv(); 

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

// async function ValidarLicensa() {
//   try {
//     const response = await axios.get("https://foo.com/validate", {
//       params: { clientId: "JFerres" }
//     });
//     if (response.data.status !== "active") {
//       fastify.log.error("Subscription inactive. Shutting down.");
//       process.exit(1);
//     }
//   } catch (error) {
//     fastify.log.error("Error validating subscription:", error);
//     process.exit(1);
//   }
// }

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
    });
  })
  .catch((err) => {
    fastify.log.error(err);
  });
