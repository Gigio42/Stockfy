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

export async function findChapaByCriteria(request, reply) {
  const { medida, vincos, qualidade, onda } = request.query;

  // Validação básica para garantir que todos os parâmetros necessários foram fornecidos
  if (!medida || !vincos || !qualidade || !onda) {
    return reply.status(400).send({ error: "Todos os parâmetros (medida, vincos, qualidade, onda) são necessários." });
  }
  
  try {
    const chapa = await prisma.chapas.findFirst({
      where: {
        medida: medida,
        vincos: vincos,
        qualidade: qualidade,
        onda: onda
      }
    });
    
    if (chapa) {
      reply.send(chapa);
    } else {
      reply.status(404).send({ error: "Nenhuma chapa encontrada com os critérios especificados." });
    }
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
