import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UsuarioController {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUsuario(data) {
    if (!data) throw new Error("Data is undefined");

    const { name, password } = data;

    const usuario = await prisma.usuarios.findFirst({
      where: {
        username: name,
        password: password,
      },
    });

    if (usuario) {
      console.log(`Usuario found: ${name}`);
      return { success: true };
    } else {
      console.log(`No usuario found with name ${name} and the provided password.`);
      return { success: false, message: "Usuário ou senha inválidos!" };
    }
  }

  async addUsuario(data) {
    const { name, password } = data;

    const existingUser = await this.prisma.usuarios.findFirst({
      where: {
        username: name,
      },
    });

    if (existingUser) {
      return { success: false, message: "O nome de usuário já existe" };
    }

    const newUser = await this.prisma.usuarios.create({
      data: {
        username: name,
        password: password,
      },
    });

    return { success: true, message: "Usuário cadastrado com sucesso!", id: newUser.id };
  }
}

export default UsuarioController;
