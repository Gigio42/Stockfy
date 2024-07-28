import { getAll, deleteEntity, findChapaByCriteria } from "../Controllers/historicoController.js";

async function historicoRoutes(fastify) {
  fastify.get("/", getAll);
  fastify.get("/buscar-chapa", findChapaByCriteria);
  fastify.delete("/:id", deleteEntity);
}

export default historicoRoutes;