const axios = require('axios');
const faker = require('faker');

async function postData() {
  const data = Array.from({ length: 10 }, () => [
    faker.company.companyName(), // fornecedor
    faker.date.past().toISOString().split('T')[0], // data_compra
    faker.random.alphaNumeric(6), // codigoDoProduto
    faker.datatype.number({ min: 1000, max: 9000 }), // quantidade_comprada
    faker.commerce.price(), // valorUnitario
    faker.commerce.price(), // valor_total
    faker.commerce.productMaterial(), // qualidade
    `${faker.datatype.number({ min: 600, max: 1200 })}x${faker.datatype.number({ min: 800, max: 2000 })}`, // medida
    faker.random.arrayElement([12, 28]), // onda
    faker.datatype.boolean() ? 'Sim' : 'Não' // vincos
  ]);

  try {
    const response = await axios.post('http://localhost:5500/compras', data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

postData();