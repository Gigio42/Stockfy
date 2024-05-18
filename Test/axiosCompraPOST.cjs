const axios = require('axios');
const faker = require('faker');

const pedidos = 30;

async function postData() {
  const data = {
    info_prod_comprados: Array.from({ length: pedidos }, (_, index) => {
      let fornecedor = faker.random.arrayElement(['IRANI', 'PENHA', 'FERNANDEZ']);
      let qualidade;

      if (fornecedor === 'FERNANDEZ') {
        qualidade = faker.random.arrayElement(['KMK', 'FK2']);
      } else if (fornecedor === 'IRANI') {
        qualidade = 'SLL40';
      } else if (fornecedor === 'PENHA') {
        qualidade = 'BRJJ11'; 
      }

      return {
        fornecedor: fornecedor,
        // id_compra: id_compra,
        id_compra: 28543,
        numero_cliente: faker.datatype.number(),
        data_compra: faker.date.past().toISOString().split('T')[0],
        data_prevista: faker.date.future().toISOString().split('T')[0],
        quantidade_comprada: faker.datatype.number({ min: 1, max: 12 }) * 500,
        valor_unitario: faker.commerce.price(),
        valor_total: faker.commerce.price(),
        qualidade: qualidade,
        medida: `${faker.datatype.number({ min: 1, max: 6 }) * 500}x${faker.datatype.number({ min: 1, max: 6 }) * 500}`,
        onda: faker.random.arrayElement(['B', 'C', 'BC', 'BB', 'E']),
        vincos: faker.datatype.number({ min: 1, max: 100 }) <= 75 ? 'Não' : 'Sim',
        coluna: faker.random.arrayElement([12, 28]),
        gramatura: faker.datatype.number({ min: 100, max: 500 }),
        peso_total: faker.datatype.number({ min: 1000, max: 5000 }),
        status: "COMPRADO"
      };
    })
  };

  try {
    const response = await axios.post('http://localhost:5500/compras', data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

postData();