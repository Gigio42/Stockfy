document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("click", function (event) {
    if (event.target.classList.contains("update-button")) {
      sendDataToServer();
    }
  });
});

var urlr = window.url;


async function sendDataToServer() {
  try {
    var data = tableObj();
    console.log(data); // Log para depuração
    const response = await axios.put(`${urlr}/recebimento`, data);
    alert("Dados atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar dados: ", error);
    alert("Erro ao atualizar os dados: " + error.message);
  }
}

function tableObj() {
  var table = document.getElementById("recebimento").getElementsByTagName("tbody")[0];
  var rows = table.rows;
  var data = [];

  for (let i = 0; i < rows.length; i++) {
    var row = rows[i];
    // Obtem o valor do input na primeira coluna
    var idChapaValue = row.cells[0].querySelector("input").value;

    // Verifica se a primeira coluna está vazia, se estiver, pula para a próxima iteração do loop
    if (idChapaValue.trim() === "") {
      continue;
    }

    var rowData = {
      id_chapa: idChapaValue,
      fornecedor: row.cells[1].querySelector("input").value,
      id_compra: row.cells[2].querySelector("input").value,
      quantidade_recebida: parseFloat(row.cells[3].querySelector("input").value) || 0,
      qualidade: row.cells[4].querySelector("input").value,
      largura: row.cells[5].querySelector("input").value,
      comprimento: row.cells[6].querySelector("input").value,
      onda: row.cells[7].querySelector("select").value,
      vincos: row.cells[8].querySelector("select").value,
      status: row.cells[9].querySelector("select").value,
      data_recebimento: row.cells[10].querySelector("input").value,
    };
    data.push(rowData);
  }
  return data;
}
