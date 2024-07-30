import UsuarioController from "../Controllers/usuarioController.js";
import { usuarioSchema, addUserSchema } from "../validators/usuarioValidator.js";

async function usuarioRoutes(fastify, options) {
  const usuarioController = new UsuarioController(options.db);

  fastify.get("/", async (request, reply) => {
    const { name, password } = request.query;
    try {
      const result = await usuarioController.getUsuario({ name, password });
      if (result.success) {
        reply.send({ success: true, cargo: result.cargo });  // Incluído 'cargo' na resposta
      } else {
        reply.send({ success: false, message: "Usuário ou senha inválidos!" });
      }
    } catch (error) {
      reply.status(500).send({ error: "Erro ao verificar o usuário" });
    }
  });
  

  fastify.post("/add", async (request, reply) => {
    const { username, password, cargo } = request.body;
    console.log("Dados recebidos para adição de novo usuário:", request.body); // Log dos dados recebidos
  
    try {
      const newUser = await usuarioController.addUsuario({ username, password, cargo });
      console.log("Resposta da tentativa de criação de usuário:", newUser); // Log da resposta do controlador
      reply.send(newUser);
    } catch (error) {
      console.error("Erro na rota de adicionar usuário:", error); // Log de erro na rota
      reply.status(500).send({ success: false, message: "Erro ao adicionar o usuário" });
    }
  });
  
}

export default usuarioRoutes;
