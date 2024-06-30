import Chapas from "../Models/chapasModel.js";

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

      return Chapas.create({ data: chapa });
    });

    return await Promise.all(promises);
  }
}

export default ComprasController;
