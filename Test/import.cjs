const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const readline = require("readline");
const path = require("path");
const crypto = require("crypto");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Nome vinculado ao banco (gigio): ", (name) => {
  rl.question("Chave criptografada: ", (key) => {
    main(name, key)
      .catch((e) => {
        console.error(e);
        process.exit(1);
      })
      .finally(async () => {
        await prisma.$disconnect();
        rl.close();
      });
  });
});

async function main(name, key) {
  const dir = "temp_db_imports";
  const filePath = path.join(dir, `${name}.data.json`);

  const encryptedData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.createHash('sha256').update(key).digest(), Buffer.from(encryptedData.iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData.content, 'hex')), decipher.final()]);

  const data = JSON.parse(decrypted.toString("utf8"));

  for (const conjugacao of data.conjugacoes) {
    await prisma.conjugacoes.create({ data: conjugacao });
  }

  for (const chapa of data.chapas) {
    await prisma.chapas.create({ data: chapa });
  }

  for (const item of data.items) {
    await prisma.item.create({ data: item });
  }

  for (const maquina of data.maquinas) {
    await prisma.maquina.create({ data: maquina });
  }

  for (const itemMaquina of data.itemMaquinas) {
    await prisma.item_Maquina.create({ data: itemMaquina });
  }

  for (const chapaItem of data.chapaItems) {
    await prisma.chapa_Item.create({ data: chapaItem });
  }

  for (const usuario of data.usuarios) {
    await prisma.usuarios.create({ data: usuario });
  }
}