import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAll(request, reply) {
  try {
    const data = await prisma.historico.findMany();
    reply.send(data);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}

export async function add(request, reply) {
  if (!request.body || Object.keys(request.body).length === 0) {
    return reply.status(400).send({ error: "Dados para criação são necessários." });
  }
  
  try {
    const entity = await prisma.historico.create({ data: request.body });
    reply.send(entity);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}

export async function deleteEntity(request, reply) {
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send({ error: "ID é necessário para deletar o registro." });
  }
  
  try {
    const entity = await prisma.historico.delete({ where: { id_historico: parseInt(id) } });
    reply.send({ message: "Registro deletado com sucesso." });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}
