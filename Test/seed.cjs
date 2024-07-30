const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const maquinas = [
    "riscador",
    "grampeador",
    "impressora",
    "rotativa",
    "coladeira 1",
    "coladeira 2",
    "serra",
    "prensa",
    "corte e vinco 3",
    "corte e vinco 4",
    "corte e vinco 5",
    "corte e vinco 7",
  ];

  for (const nome of maquinas) {
    const existingMaquina = await prisma.maquina.findFirst({
      where: {
        nome: nome,
      },
    });

    if (!existingMaquina) {
      await prisma.maquina.create({
        data: {
          nome: nome,
        },
      });
    }
  }

   // Criando usuário 'adm' se ele não existir
   const existingUser = await prisma.usuarios.findFirst({
    where: {
      username: 'adm',
    },
  });

  if (!existingUser) {
    await prisma.usuarios.create({
      data: {
        username: 'adm',
        password: 'adm',  // Importante considerar encriptar esta senha em uma aplicação real
        cargo: 'adm',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
