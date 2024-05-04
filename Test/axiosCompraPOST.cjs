const axios = require('axios');
const faker = require('faker');

const id_compra = faker.datatype.number();

const pedidos = 1;

async function postData() {
  const data = {
    info_prod_comprados: Array.from({ length: pedidos }, (_, index) => ({
      fornecedor: faker.company.companyName(),
      /* id_compra: `${id_compra}/${index + 1}`, */
      id_compra: "1790",
      cliente_numero: faker.datatype.number(),
      data_compra: faker.date.past().toISOString().split('T')[0],
      data_prevista: faker.date.future().toISOString().split('T')[0],
      quantidade_comprada: faker.datatype.number({ min: 1000, max: 9000 }),
      valorUnitario: faker.commerce.price(),
      valor_total: faker.commerce.price(),
      qualidade: faker.commerce.productMaterial(),
      medida: `${faker.datatype.number({ min: 600, max: 1200 })}x${faker.datatype.number({ min: 800, max: 2000 })}`,
      onda: faker.random.arrayElement(['B', 'C', 'BC', 'BB', 'E']),
      vincos: faker.datatype.boolean() ? 'Sim' : 'Não',
      coluna: faker.random.arrayElement([12, 28]),
      gramatura: faker.datatype.number({ min: 100, max: 500 }),
      peso_total: faker.datatype.number({ min: 1000, max: 5000 }),
      status: "Comprado"
    }))
  };

  try {
    const response = await axios.post('http://localhost:5500/compras', data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

postData();