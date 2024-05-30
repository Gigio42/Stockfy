const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const key = process.env.ENCRYPTION_KEY;

rl.question('Vincular nome ao banco: ', (name) => {
  main(nome, key)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      rl.close();
    });
});

async function main(name, key) {
  const conjugacoes = await prisma.conjugacoes.findMany();
  const chapas = await prisma.chapas.findMany();
  const chapaItems = await prisma.chapa_Item.findMany();
  const items = await prisma.item.findMany();
  const itemMaquinas = await prisma.item_Maquina.findMany();
  const maquinas = await prisma.maquina.findMany();
  const usuarios = await prisma.usuarios.findMany();

  const data = {
    conjugacoes,
    chapas,
    chapaItems,
    items,
    itemMaquinas,
    maquinas,
    usuarios,
  };

  console.log(data);

  const dir = 'temp_db_imports';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, `${name}.data.json`);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', crypto.createHash('sha256').update(key).digest(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(data, null, 2), 'utf8'), cipher.final()]);

  const encryptedData = {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  };

  fs.writeFileSync(filePath, JSON.stringify(encryptedData));
}