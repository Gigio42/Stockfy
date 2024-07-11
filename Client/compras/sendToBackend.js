import BASE_URL from "../utils/config.js";
import { jsonData } from "./js/modules/extractToJson.js";
import { criarListaDeChapas } from "./js/modules/createListofchapas.js";

export function sendJSONDataToBackend() {
  let url = `${BASE_URL}/compras`;

  var jsonDataToSend = JSON.parse(
    JSON.stringify(jsonData),
    function (key, value) {
      if (typeof value === "string" && !isNaN(value) && value !== "") {
        var intValue = parseInt(value.replace(/\./g, ""), 10);
        return intValue;
      }
      return value;
    }
  );

  axios
    .post(url, jsonDataToSend, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(() => {
      console.log("Dados enviados com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro ao enviar dados:", error);
    });
}

export async function getChapasEmEstoque() {
  try {
    console.log("Iniciando requisição para listar chapas em estoque...");
    const response = await axios.get(`${BASE_URL}/compras/chapas/estoque`);
    console.log("Resposta recebida:", response);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter chapas em estoque:", error);
    throw error;
  }
}

// Função principal para listar as chapas em estoque
export async function listarChapasEmEstoque() {
  try {
    const chapas = await getChapasEmEstoque();
    criarListaDeChapas(chapas);
  } catch (error) {
    console.error('Erro ao listar chapas em estoque:', error);
  }
}

// Chamada para listar as chapas em estoque quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", async () => {
  await listarChapasEmEstoque();
});
