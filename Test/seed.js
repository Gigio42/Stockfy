const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const maquinas = [
    "riscador",
    "grampeador",
    "impressora",
    "rotativa",
    "coladeira",
    "serra",
    "prensa",
    "corte e vinco plana",
    "corte e vinco 3",
    "corte e vinco 4",
    "corte e vinco 5",
    "corte e vinco 7",
  ];

  for (const nome of maquinas) {
    const existingMaquina = await prisma.maquina.findUnique({
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
