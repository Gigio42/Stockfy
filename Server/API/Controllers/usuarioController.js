import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UsuarioController {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUsuario(data) {
    if (!data) throw new Error("Data is undefined");

    const { name, password } = data;

    // Buscar usuário com nome e senha correspondentes
    const usuario = await prisma.usuarios.findFirst({
      where: {
        username: name,
        password: password, // Aqui você deve idealmente comparar hashes, não senhas em texto plano
      },
    });

    // Logar o resultado da verificação
    if (usuario) {
      console.log(`Usuario found: ${name}`);
      return true;
    } else {
      console.log(`No usuario found with name ${name} and the provided password.`);
      return false;
    }
  }

  async addUsuario(data) {
    console.log("test2")
    const { name, password } = data;
    const hashedPassword = password; // Substitua isso por uma hash real com bcrypt

    const newUser = await this.prisma.usuarios.create({
      data: {
        username: name,
        password: hashedPassword,
      },
    });

    return newUser;
  }
}

export default UsuarioController;
