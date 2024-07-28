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

  // Função para adicionar os cartões criados ao banco de dados
  async criarChapas(cartoes) {
    try {
      const resultados = await prisma.chapas.createMany({
        data: cartoes.info_prod_comprados.map((cartao) => ({
          numero_cliente: cartao.numero_cliente,
          quantidade_comprada: cartao.quantidade_comprada,
          quantidade_disponivel: cartao.quantidade_comprada,
          unidade: cartao.unidade,
          qualidade: cartao.qualidade,
          onda: cartao.onda,
          gramatura: cartao.gramatura,
          peso_total: cartao.peso_total,
          valor_unitario: cartao.valor_unitario,
          valor_total: cartao.valor_total,
          largura: cartao.largura,
          comprimento: cartao.comprimento,
          medida: `${cartao.largura} X ${cartao.comprimento}`, // Concatenando largura e comprimento
          vincos: cartao.vincos,
          status: cartao.status,
          comprador: cartao.comprador,
          data_compra: cartao.data_compra,
          fornecedor: cartao.fornecedor,
          id_compra: cartao.id_compra,
          data_prevista: cartao.data_prevista,
          conjugado: cartao.conjugado,
        })),
      });

    
      await prisma.historico.createMany({
        data: cartoes.info_prod_comprados.map((cartao) => ({ 
          chapa: `${cartao.largura} X ${cartao.comprimento} - ${cartao.vincos} - ${cartao.qualidade}/${cartao.onda}`,
          quantidade: cartao.quantidade_comprada,
          modificacao: cartao.status,
          modificado_por: cartao.executor, // usuario login
          data_modificacao: cartao.data_compra,
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
      // Consulta chapas com conjugado: true no banco de dados usando Prisma
      const chapas = await prisma.chapas.findMany({
        where: {
          conjugado: true, // Filtra chapas com o campo conjugado igual a true
        },
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
  
  

  async adicionarMedidasConjugadas(medidasConjugConfimed) {
    try {
      const resultados = await Promise.all(
        medidasConjugConfimed.map(async (medida) => {
          const medidaText = `${medida.largura} X ${medida.comprimento}`;
  
          // Preparando os dados para a criação da nova conjugação
          const data = {
            medida: medidaText,
            largura: medida.largura,
            comprimento: medida.comprimento,
            quantidade: medida.quantidade,
            rendimento: medida.quantasVezes || 0,
            quantidade_disponivel: medida.quantidade || 0,
            usado: medida.usado || false,
            chapaId: medida.chapa ? parseInt(medida.chapa, 10) : null,
            part_number: String(medida.partNumber), // Garante que part_number é uma string
            pedido_venda: medida.pedidoVenda || null, // Garante que pedido_venda é tratado corretamente
          };
  
          // Criando uma nova conjugação no banco de dados usando Prisma
          const novaConjugacao = await prisma.conjugacoes.create({ data });
  
          // Atualiza a chapa associada para marcar como conjugado: false
          if (medida.chapa) {
            await prisma.chapas.update({
              where: { id_chapa: parseInt(medida.chapa, 10) },
              data: { conjugado: false },
            });
          }
  
          return novaConjugacao;
        })
      );
  
      console.log("Medidas conjugadas adicionadas:", resultados);
      return resultados;
    } catch (error) {
      console.error("Erro ao adicionar medidas conjugadas:", error);
      throw error;
    }
  }
  
  
  
  
}

export default ComprasController;
