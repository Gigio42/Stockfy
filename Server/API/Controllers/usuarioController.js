import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UsuarioController {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUsuario(data) {
    const { name, password } = data;

    const usuario = await this.prisma.usuarios.findFirst({
      where: {
        username: name,
        password: password,
      },
    });

    if (usuario) {
      return { success: true, cargo: usuario.cargo };  // Incluído 'cargo' no retorno
    } else {
      return { success: false, message: "Usuário ou senha inválidos!" };
    }
  }

  async addUsuario(data) {
    const { username, password, cargo } = data;
  
    console.log("Iniciando adição de usuário", data);
  
    if (!cargo) {
      console.log("Erro: Cargo não fornecido");
      return { success: false, message: "Cargo não fornecido" };
    }
  
    try {
      const existingUser = await this.prisma.usuarios.findFirst({
        where: {
          username: {
            equals: username, // Certifique-se de que 'name' está sendo passado corretamente
          }
        },
      });
  
      console.log("Usuário existente:", existingUser);
  
      if (existingUser) {
        console.log("Erro: O nome de usuário já existe");
        return { success: false, message: "O nome de usuário já existe" };
      }
  
      const newUser = await this.prisma.usuarios.create({
        data: {
          username: username, // Certifique-se de que 'name' está sendo passado corretamente
          password: password,
          cargo: cargo
        },
      });
  
      console.log("Usuário criado com sucesso:", newUser);
      return { success: true, message: "Usuário cadastrado com sucesso!", id: newUser.id };
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return { success: false, message: "Erro ao adicionar o usuário" };
    }
  }
  
}

export default UsuarioController;
