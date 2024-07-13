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

  /* async createCompra(orderData) {
    try {
      const promises = orderData.info_prod_comprados.map(async (chapaData) => {
        // Extração e formatação das dimensões da chapa
        const chapa = this.extractDimensions(chapaData);
  
        // Definindo a quantidade_disponivel da Chapa igual à quantidade_comprada
        chapa.quantidade_disponivel = chapa.quantidade_comprada;
  
        // Inserindo a chapa no banco de dados usando Prisma
        const createdChapa = await prisma.chapas.create({
          data: {
            medida: chapa.medida,
            largura: chapa.largura,
            comprimento: chapa.comprimento,
            quantidade_comprada: chapa.quantidade_comprada,
            qualidade: chapa.qualidade, // Certifique-se de passar qualidade se estiver presente
            fornecedor: chapa.fornecedor,
            // Adicione outros campos conforme necessário
          },
        });
  
        // Criando uma entrada no histórico para a chapa
        const idChapaHistorico = `${chapa.largura} X ${chapa.comprimento} - ${chapa.vincos} - ${chapa.qualidade}/${chapa.onda}`;
        await prisma.historico.create({
          data: {
            id_chapa: idChapaHistorico,
            quantidade: chapa.quantidade_comprada,
            modificacao: chapa.status,
            modificado_por: chapa.comprador,
            data_modificacao: chapa.data_compra,
            // Adicione outros campos conforme necessário
          },
        });
      });
  
      return Promise.all(promises);
    } catch (error) {
      console.error('Erro ao processar dados de compra:', error);
      throw error; // Propaga o erro para o caller lidar com ele
    }
  }*/
  
   // Função para adicionar os cartões criados ao banco de dados
   async criarChapas(cartoes) {
    try {
      const resultados = await prisma.chapas.createMany({
        data: cartoes.info_prod_comprados.map(cartao => ({
          numero_cliente: cartao.numero_cliente,
          quantidade_comprada: cartao.quantidade_comprada,
          unidade: cartao.unidade,
          qualidade: cartao.qualidade,
          onda: cartao.onda,
          gramatura: cartao.gramatura,
          peso_total: cartao.peso_total,
          valor_unitario: cartao.valor_unitario,
          valor_total: cartao.valor_total,
          largura: cartao.largura,
          comprimento: cartao.comprimento,
          vincos: cartao.vincos,
          status: cartao.status,
          comprador: cartao.comprador,
          data_compra: cartao.data_compra,
          fornecedor: cartao.fornecedor,
          id_compra: cartao.id_compra,
          data_prevista: cartao.data_prevista,
        })),
      });
      return resultados;
    } catch (error) {
      throw new Error(`Erro ao adicionar cartões criados: ${error.message}`);
    }
  }
  
  async listarChapasEmEstoque() {
    try {
      // Consulta todas as chapas em estoque no banco de dados usando Prisma
      const chapas = await prisma.chapas.findMany({
        select: {
          id_chapa: true,
          medida: true,
          largura: true,
          comprimento: true,
          quantidade_comprada: true,
          qualidade: true,
          fornecedor: true,
          // Adicione outros campos conforme necessário
        },
      });

      return chapas;
    } catch (error) {
      throw new Error(`Erro ao listar chapas em estoque: ${error.message}`);
    }
  }

  async adicionarMedidasConjugadas(medidasConjugadas) {
    try {
      const resultados = await Promise.all(medidasConjugadas.map(async (medida) => {
        // Concatenando largura e comprimento como medida
        const medidaText = `${medida.largura} X ${medida.comprimento}`;
        
        // Criando uma nova conjugação no banco de dados usando Prisma
        const novaConjugacao = await prisma.conjugacoes.create({
          data: {
            medida: medidaText,
            largura: medida.largura,
            comprimento: medida.comprimento,
            quantidade: medida.quantidade,
            rendimento: medida.rendimento || 0,
            quantidade_disponivel: medida.quantidade_disponivel || 0,
            usado: medida.usado || false,
            chapaId: medida.chapaId,
          },
        });

        return novaConjugacao;
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
