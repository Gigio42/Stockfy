import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify();

fastify.register(cors);
const port = process.env.LICENSE_PORT || 4000;
const host = process.env.LICENSE_HOST || "localhost";

const licenses = {
  JFerres: { status: "active" }
};

fastify.get("/validate", async (req, reply) => {
  const { clientId } = req.query;

  const license = licenses[clientId];

  console.log(`Validating license for ${clientId}:`, license); // Add this line

  if (license && license.status === "active") {
    return { status: "active" };
  } else {
    return { status: "inactive" };
  }
});

fastify.post("/update-license", async (req, reply) => {
  const { clientId, status } = req.body;

  licenses[clientId] = { status: status };

  return { message: "License updated successfully", license: licenses[clientId] };
});

fastify.listen({ port: port, host: host }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`License server running on ${address}`);
});
