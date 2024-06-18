import HistoricoController from "../Controllers/historicoController.js";

async function historicoRoute(fastify, options) {
  const historicoController = new HistoricoController(options.db);

  fastify.get("/chapas", async (request, reply) => {
    try {
      const data = await historicoController.getChapas();
      reply.send(data);
    } catch (err) {
      console.log(err.message);
      reply.code(500).send({ message: "Error retrieving chapas from SQLite database", error: err.message });
    }
  });

  fastify.get("/items", async (request, reply) => {
    try {
      const data = await historicoController.getItems();
      reply.send(data);
    } catch (err) {
      console.log(err.message);
      reply.code(500).send({ message: "Error retrieving items from SQLite database", error: err.message });
    }
  });

  // fastify.get("/historico/maquinas", async (request, reply) => {
  //   try {
  //     const data = await historicoController.getMaquinas();
  //     reply.send(data);
  //   } catch (err) {
  //     console.log(err.message);
  //     reply.code(500).send({ message: "Error retrieving maquinas from SQLite database", error: err.message });
  //   }
  // });

  // fastify.get("/historico/usuarios", async (request, reply) => {
  //   try {
  //     const data = await historicoController.getUsuarios();
  //     reply.send(data);
  //   } catch (err) {
  //     console.log(err.message);
  //     reply.code(500).send({ message: "Error retrieving usuarios from SQLite database", error: err.message });
  //   }
  // });
}

export default historicoRoute;
