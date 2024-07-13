import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Função de validação para os objetos de dados
function validateData(data) {
  const requiredFields = ["id_chapa", "quantidade", "modificacao", "modificado_por", "data_modificacao", "pedido_venda"];
  for (const field of requiredFields) {
    if (!data.hasOwnProperty(field) || data[field] === null || data[field] === undefined) {
      return false;
    }
  }
  return true;
}

export async function getAll(request, reply) {
  try {
    const data = await prisma.historico.findMany();
    reply.send(data);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}

export async function add(request, reply) {
  if (!request.body || !Array.isArray(request.body) || request.body.length === 0) {
    return reply.status(400).send({ error: "Um array de dados é necessário para a criação." });
  }

  const invalidItems = request.body.filter(item => !validateData(item));
  if (invalidItems.length > 0) {
    return reply.status(400).send({ error: "Todos os campos obrigatórios devem estar presentes e não nulos." });
  }
  
  try {
    const entities = await prisma.historico.createMany({
      data: request.body,
    });
    reply.send({ count: entities.count, message: `${entities.count} registros criados com sucesso.` });
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
    await prisma.historico.delete({ where: { id_historico: parseInt(id) } });
    reply.send({ message: "Registro deletado com sucesso." });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}
