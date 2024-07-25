import BASE_URL from "../utils/config.js";
import { jsonData } from "./js/modules/extractToJson.js";
import { criarListaDeChapas } from "./js/modules/createListofchapas.js";
import { medidasConjugConfimed } from "./js/modules/form.js";

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



// Função para formatar a data no formato dd/mm/aaaa
function formatarData(data) {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

// Função para enviar as medidas confirmadas para o backend
export async function enviarMedidasConjugadas() {
  try {
    console.log("Enviando medidas conjugadas para o backend...");

    // Adicionando a data de confirmação
    const medidasComData = medidasConjugConfimed.map(medida => ({
      ...medida,
      dataConfirmacao: formatarData(new Date()) // Adiciona a data formatada
    }));

    const response = await axios.post(`${BASE_URL}/compras/conjugacoes/confirmed`, medidasComData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Medidas conjugadas enviadas com sucesso:", response.data);
    // Aqui você pode realizar qualquer ação adicional após o envio bem-sucedido
  } catch (error) {
    console.error("Erro ao enviar medidas conjugadas:", error);
    // Trate os erros conforme necessário
  }
}



// Associar a função ao botão de confirmação
document.addEventListener("DOMContentLoaded", () => {
  const confirmarConjugBtn = document.getElementById('confirmarConjugBtn');
  if (confirmarConjugBtn) {
      confirmarConjugBtn.addEventListener('click', enviarMedidasConjugadas);
  }
});