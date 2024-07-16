const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Destruição do banco de dados em 3 segundos...");

  // Momento dramático até vc cancelar/ Set pra zero
  let counter = 0;
  let countdown = setInterval(async () => {
    counter--;
    if (counter > 1) {
      console.log(`${counter} segundos restantes...`);
    } else if (counter === 1) {
      console.log("1 segundo restante...");
    } else {
      console.log("# Limpando todos os dados...");
      clearInterval(countdown);

      await prisma.conjugacoes.deleteMany();
      await prisma.chapa_Item.deleteMany();
      await prisma.chapas.deleteMany();
      await prisma.item_Maquina.deleteMany();
      await prisma.item.deleteMany();
      await prisma.maquina.deleteMany();
      await prisma.usuarios.deleteMany();
      await prisma.historico.deleteMany();

      console.log(`finalizado, parabéns vc destruiu tudo!`);

      await prisma.$disconnect();
    }
  }, 1000);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
