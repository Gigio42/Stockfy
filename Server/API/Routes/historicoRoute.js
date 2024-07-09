import { getAll, add, deleteEntity } from "../Controllers/historicoController.js";

async function historicoRoutes(fastify) {
  fastify.get("/", getAll);
  fastify.post("/", add);
  fastify.delete("/:id", deleteEntity);
}

export default historicoRoutes;
