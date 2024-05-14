const axios = require('axios');
const faker = require('faker');

async function postData() {
  const data = {
    info_prod_recebidos: Array.from({ length: 1}, () => ({
      id_compra: "1790/1",
      data_recebimento: faker.date.past().toISOString().split('T')[0],
      /* quantidade_recebida: faker.datatype.number({ min: 1000, max: 9000 }), */
      quantidade_recebida: 600,
      status: "Recebido"
    }))
  };

  try {
    const response = await axios.put('http://localhost:5500/recebimento', data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

postData();