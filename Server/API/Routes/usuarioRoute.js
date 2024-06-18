import UsuarioController from "../Controllers/usuarioController.js";
import { usuarioSchema, addUserSchema } from "../validators/usuarioValidator.js";

async function usuarioRoutes(fastify, options) {
  const usuarioController = new UsuarioController(options.db);

  fastify.get("/", async (request, reply) => {
    const { name, password } = request.query;
    try {
      const result = await usuarioController.getUsuario({ name, password });
      if (result.success) {
        reply.send({ success: true });
      } else {
        reply.send({ success: false, message: "Usuário ou senha inválidos!" });
      }
    } catch (error) {
      reply.status(500).send({ error: "Erro ao verificar o usuário" });
    }
  });

  fastify.post("/add", async (request, reply) => {
    const { name, password } = request.body;
    try {
      const newUser = await usuarioController.addUsuario({ name, password });
      reply.send(newUser); // Aqui enviamos a resposta detalhada do controlador
    } catch (error) {
      reply.status(500).send({ success: false, message: "Erro ao adicionar o usuário" });
    }
  });
}

export default usuarioRoutes;
