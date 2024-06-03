import UsuarioController from "../Controllers/usuarioController.js";
import { usuarioSchema, addUserSchema } from "../validators/usuarioValidator.js";

async function usuarioRoutes(fastify, options) {
  const usuarioController = new UsuarioController(options.db);

  fastify.get("/", async (request, reply) => {
    const { name, password } = request.query;
    try {
      const exists = await verificaUsuario(name, password);
      reply.send({ exists });
    } catch (error) {
      reply.status(500).send({ error: "Erro ao verificar o usuário" });
    }
  });

  fastify.post("/add", async (request, reply) => {
    const { name, password } = request.body;
    try {
      // Função que adiciona o usuário no banco de dados
      const newUser = await adicionaUsuario(name, password);
      reply.send({ success: true });
    } catch (error) {
      reply.status(500).send({ success: false, error: "Erro ao adicionar o usuário" });
    }
  });
}

export default usuarioRoutes;
