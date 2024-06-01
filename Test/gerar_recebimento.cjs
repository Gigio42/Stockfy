const axios = require("axios");
const faker = require("faker");

async function postData() {
  const data = Array.from({ length: 1 }, () => ({
    id_chapa: 4,
    data_recebimento: faker.date.past().toISOString().split("T")[0],
    quantidade_recebida: 200,
    status: "RECEBIDO",
  }));

  try {
    const response = await axios.put("http://localhost:3000/recebimento", data);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}

postData();
