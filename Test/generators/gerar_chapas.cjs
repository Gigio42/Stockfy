const axios = require("axios");
const faker = require("faker");

// Gerador de dados para encher a tabela de chapas para testes, escolha
// a quantidade de chapas que vc quiser em 'pedidos' e go crazy

const runRecebimento = true;
const pedidos = Math.floor(Math.random() * 4) + 3;
const id_compra = Math.floor(100000 + Math.random() * 900000);

async function postData() {
  const data = {
    info_prod_comprados: Array.from({ length: pedidos }, (_, index) => {
      let fornecedor = faker.random.arrayElement(["IRANI", "PENHA", "FERNANDEZ"]);

      let qualidade;
      let coluna;

      if (fornecedor === "FERNANDEZ") {
        qualidade = faker.random.arrayElement(["KMK", "FK2"]);
      } else if (fornecedor === "IRANI") {
        qualidade = faker.random.arrayElement(["SLL40", "DKL80"]);
        if (qualidade === "SLL40") {
          coluna = 40;
        } else {
          coluna = 80;
        }
      } else if (fornecedor === "PENHA") {
        qualidade = faker.random.arrayElement(["BR11JJ", "BR11S"]);
      }

      return {
        fornecedor: fornecedor,
        comprador: faker.name.findName(),
        unidade: faker.random.arrayElement(["CH", "AA"]),
        id_compra: id_compra,
        numero_cliente: faker.datatype.number(),
        data_compra: faker.date.past().toLocaleDateString("pt-BR"),
        data_prevista: faker.date.future().toLocaleDateString("pt-BR"),
        quantidade_comprada: faker.datatype.number({ min: 1, max: 4 }) * 500,
        valor_unitario: faker.commerce.price(),
        valor_total: faker.commerce.price(),
        qualidade: qualidade,
        medida: `${faker.datatype.number({ min: 1, max: 6 }) * 500}x${faker.datatype.number({ min: 1, max: 6 }) * 500}`,
        onda: faker.random.arrayElement(["B", "C", "BC", "BB", "E"]),
        vincos: faker.datatype.number({ min: 1, max: 100 }) <= 75 ? "Não" : Math.floor(100 + Math.random() * 900),
        coluna: coluna || faker.random.arrayElement([3, 12]),
        gramatura: faker.datatype.number({ min: 100, max: 500 }),
        peso_total: faker.datatype.number({ min: 1000, max: 5000 }),
        status: "COMPRADO",
      };
    }),
  };

  try {
    const response = await axios.post("http://localhost:3000/compras", data);
    console.log("Chapas inseridas com sucesso");
  } catch (error) {
    console.error(error);
  }
}

async function testRecebimento() {
  try {
    const response = await axios.get(`http://localhost:3000/recebimento/${id_compra}`);
    const chapas = response.data;

    const selectedChapas = chapas.slice(0, 3).map((chapa) => chapa.id_chapa);
    console.log("Chapas selecionadas para recebimento:", selectedChapas);

    const porcentagens = [0.5, 1, 1.1]; // 50%, 100%, 110%

    for (let i = 0; i < selectedChapas.length; i++) {
      const id_chapa = selectedChapas[i];
      const chapa = chapas.find((chapa) => chapa.id_chapa === id_chapa);

      const data_recebimento = faker.date.future().toLocaleDateString("pt-BR");

      const updateData = [
        {
          id_chapa: id_chapa,
          quantidade_recebida: chapa.quantidade_comprada * porcentagens[i],
          status: "RECEBIDO",
          data_recebimento: data_recebimento,
        },
      ];

      await axios.put("http://localhost:3000/recebimento", updateData);
    }

    console.log("Chapas recebidas com sucesso");
  } catch (error) {
    console.error(error);
  }
}

postData().then(() => {
  if (runRecebimento) {
    testRecebimento();
  }
});
