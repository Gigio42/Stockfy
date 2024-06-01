const axios = require("axios");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Please enter the id_compra: ", (id_compra) => {
  testRecebimento(id_compra);
  rl.close();
});

async function testRecebimento(id_compra) {
  try {
    const response = await axios.get(`http://localhost:3000/recebimento/${id_compra}`);
    const chapas = response.data;

    const selectedChapas = chapas.slice(0, 3).map((chapa) => chapa.id_produto);

    for (let id_produto of selectedChapas) {
      const updateData = {
        id_chapa: id_produto,
        quantidade_recebida: 10,
        status: "RECEIVED",
      };

      await axios.put("http://localhost:3000/recebimento", updateData);
    }

    console.log("Update successful");
  } catch (error) {
    console.error(error);
  }
}
