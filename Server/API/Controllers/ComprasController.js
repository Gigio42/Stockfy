import Chapas from "../Models/chapasModel.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class ComprasController {
  constructor() {}

  extractDimensions(chapa) {
    if (chapa.medida) {
      const dimensions = chapa.medida
        .toLowerCase()
        .replace(/\s/g, "")
        .split("x")
        .map((dim) => parseFloat(dim.replace(",", ".").replace(".", "")));
      if (dimensions.length === 2) {
        chapa.largura = dimensions[0];
        chapa.comprimento = dimensions[1];
      }
    } else if (chapa.largura && chapa.comprimento) {
      chapa.medida = `${chapa.largura}x${chapa.comprimento}`;
    }
    return chapa;
  }

  async createCompra(orderData) {
    const promises = orderData.info_prod_comprados.map(async (chapa) => {
      chapa = this.extractDimensions(chapa);

      // Define a quantidade_disponivel da Chapa igual à quantidade_comprada
      chapa.quantidade_disponivel = chapa.quantidade_comprada;

      // Se existem conjugacoes, define a quantidade_disponivel igual à quantidade
      if (chapa.conjugacoes && chapa.conjugacoes.create) {
        chapa.conjugacoes.create = chapa.conjugacoes.create.map((conjugacao) => {
          conjugacao.quantidade_disponivel = conjugacao.quantidade;
          return conjugacao;
        });
      }

      // Inserir a chapa no banco de dados
      const createdChapa = await prisma.chapas.create({
        data: {
          ...chapa,
          medida: `${chapa.largura}x${chapa.comprimento}`,
        }
      });

      // Criação do ID da chapa para o histórico
      const idChapaHistorico = `${chapa.largura} X ${chapa.comprimento} - ${chapa.vincos} - ${chapa.qualidade}/${chapa.onda}`;

      // Adicionar uma entrada no histórico
      await prisma.historico.create({
        data: {
          id_chapa: idChapaHistorico,
          quantidade: chapa.quantidade_comprada,
          modificacao: chapa.status,
          modificado_por: chapa.comprador,
          data_modificacao: chapa.data_compra,
          part_number: null, // Assumindo que não há part_number nesse contexto
          maquina: null, // Assumindo que não há maquina nesse contexto
          ordem: null, // Assumindo que não há ordem nesse contexto
          conjulgacao: null, // ou outro valor conforme necessário
          pedido_venda: chapa.numero_cliente.toString()
        }
      });
    });

    return await Promise.all(promises);
  }

  async listarChapasEmEstoque() {
    try {
      // Consulta todas as chapas em estoque no banco de dados
      const chapas = await Chapas.findMany({
        select: {
          id_chapa: true,
          medida: true,
          largura: true,
          comprimento: true,
          quantidade_comprada: true,
          qualidade: true,
          fornecedor: true,
        },
      });

      return chapas;
    } catch (error) {
      throw new Error(`Erro ao listar chapas em estoque: ${error.message}`);
    }
  }

  async adicionarMedidasConjugadas(medida) {
    try {
      // Crie uma nova conjugação no banco de dados usando Prisma
      const novaConjugacao = await prisma.conjugacoes.create({
        data: {
          medida: medida.medida,
          largura: medida.largura,
          comprimento: medida.comprimento,
          quantidade: medida.quantidade,
          rendimento: 0, // Defina conforme necessário
          quantidade_disponivel: 0, // Defina conforme necessário
          usado: false, // Defina conforme necessário
          chapaId: medida.chapaId,
        },
      });

      console.log("Nova conjugação criada:", novaConjugacao);

      return novaConjugacao;
    } catch (error) {
      console.error("Erro ao adicionar medidas conjugadas:", error);
      throw error;
    }
  }

  async adicionarMedidasConjugadas(medidasConjugadas) {
    try {
        const resultados = await Promise.all(medidasConjugadas.map(medida => {
            // Concatenando largura e comprimento como medida
            const medidaText = `${medida.largura} X ${medida.comprimento}`;
            
            return prisma.conjugacoes.create({
                data: {
                    medida: medidaText,
                    largura: medida.largura,
                    comprimento: medida.comprimento,
                    quantidade: medida.quantidade,
                    rendimento: medida.quantasVezes,
                    quantidade_disponivel: 0,
                    usado: false,
                    chapaId: parseInt(medida.chapa),
                },
            });
        }));

        console.log('Medidas conjugadas adicionadas:', resultados);
        return resultados;
    } catch (error) {
        console.error('Erro ao adicionar medidas conjugadas:', error);
        throw error;
    }
}


}

export default ComprasController;
