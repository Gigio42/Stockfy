import BASE_URL from "../../utils/config.js";
import { clearTable } from "./manipularTabela.js";
import { criarTable } from "./manipularTabela.js";
import { verifyIdChapa, rowDataObj } from "./utils.js";

export function fetchChapas(xPed) {
  clearTable();
  axios
    .get(`${BASE_URL}/recebimento/${xPed}`)
    .then((response) => {
      const data = response.data;
      if (data && data.length > 0) {
        document.getElementById("drop-zone").style.display = "none";
        document.getElementById("tables").style.display = "block";
        data.forEach((chapa) => {
          const tableb = document.getElementById("bancoDados");
          chapa.valor_unitario = chapa.valor_unitario.replace(",", ".");
          chapa.valor_total = chapa.valor_total.replace(".", "").replace(",", ".");
          chapa.quantidade_recebida = chapa.quantidade_comprada;
          criarTable(tableb, chapa);
        });
      }
    })
    .catch((error) => {
      alert(`chapa ${xPed} não encontrada`);
      console.error("Erro ao buscar dados: ", error);
    });
}

export async function sendDataToServer(row) {
  try {
    var data = [rowDataObj(row)]; // Enviar como array de objetos
    console.log("Data to send:", data); // Verifique o dado que está sendo enviado
    const response = await axios.put(`${BASE_URL}/recebimento`, data);
    alert("Dados atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar dados: ", error);
    alert("Erro ao atualizar os dados: " + error.message);
  }
}

export async function sendAllDataToServer() {
  const tableBody = document.getElementById("tableBody2");
  const rows = Array.from(tableBody.getElementsByTagName("tr"));
  const allData = rows
    .filter((row) => verifyIdChapa(row)) // Verifica se as 7 primeiras colunas não são vazias e se as 3 primeiras colunas não são vazias
    .map((row) => rowDataObj(row));

  try {
    console.log("Data to send:", allData); // Verifique o dado que está sendo enviado
    const response = await axios.put(`${BASE_URL}/recebimento`, allData);
    alert("dados atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao enviar os dados: ", error);
    alert("Erro ao atualizar os dados: " + error.message);
  }
}
