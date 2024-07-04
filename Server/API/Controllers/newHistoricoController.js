import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getAll(request, reply) {
  const { model } = request.params;
  try {
    const data = await prisma[model].findMany();
    reply.send(data);
  } catch (error) {
    reply.status(500).send(error.message);
  }
}

export async function getById(request, reply) {
  const { model, id } = request.params;

  // Validar a presença do parâmetro ID
  if (!id) {
    return reply.status(400).send({ error: "ID é necessário para buscar o registro." });
  }

  // Validar se o ID é um número
  if (isNaN(parseInt(id))) {
    return reply.status(400).send({ error: "ID deve ser um número." });
  }

  // Identificar o campo correto de ID com base no modelo
  const idField = model === "historicoChapa" ? "id_chapa" : "id_item";

  try {
    const whereClause = {};
    whereClause[idField] = parseInt(id);

    const data = await prisma[model].findMany({
      where: whereClause,
    });

    if (data.length === 0) {
      return reply.status(404).send({ error: "Registro não encontrado." });
    }

    reply.send(data);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}

export async function getByDateRange(request, reply) {
  console.log("Acessando getByDateRange");
  console.log("Query Params:", request.query);
  const { model } = request.params;
  const { startDate, endDate } = request.query;

  // Validar a presença das datas de início e fim
  if (!startDate || !endDate) {
    return reply.status(400).send({ error: "As datas de início e fim são necessárias." });
  }

  try {
    // As datas são comparadas como strings
    const data = await prisma[model].findMany({
      where: {
        data_modificacao: {
          gte: startDate, // Deve ser uma string no formato 'YYYY-MM-DD'
          lte: endDate, // Deve ser uma string no formato 'YYYY-MM-DD'
        },
      },
    });

    if (data.length === 0) {
      return reply.status(404).send({ error: "Nenhum registro encontrado neste intervalo de datas." });
    }

    reply.send(data);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}

export async function add(request, reply) {
  const { model } = request.params;

  // Validar a presença do corpo da requisição
  if (!request.body || Object.keys(request.body).length === 0) {
    return reply.status(400).send({ error: "Dados para criação são necessários." });
  }

  try {
    const entity = await prisma[model].create({
      data: request.body,
    });
    reply.send(entity);
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}

export async function deleteEntity(request, reply) {
  const { model, id } = request.params;

  // Validar a presença do parâmetro ID
  if (!id) {
    return reply.status(400).send({ error: "ID é necessário para deletar o registro." });
  }

  try {
    const entity = await prisma[model].delete({
      where: { id: parseInt(id) },
    });
    reply.send({ message: "Registro deletado com sucesso." });
  } catch (error) {
    reply.status(500).send({ error: error.message });
  }
}
