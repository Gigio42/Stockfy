import BASE_URL from "../utils/config.js";
import { jsonData } from "./js/modules/extractToJson.js";
import {updateCardboardRepresentation} from './js/modules/cardboard.js'

export function sendJSONDataToBackend() {
  let url = `${BASE_URL}/compras`;

  var jsonDataToSend = JSON.parse(JSON.stringify(jsonData), function (key, value) {
    if (typeof value === "string" && !isNaN(value) && value !== "") {
      var intValue = parseInt(value.replace(/\./g, ""), 10);
      return intValue;
    }
    return value;
  });

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

async function listarChapasEmEstoque() {
  try {
    console.log('Iniciando requisição para listar chapas em estoque...');
    const response = await axios.get(`${BASE_URL}/compras/chapas/estoque`);
    console.log('Resposta recebida:', response);

    // Limpar o conteúdo atual da div
    const chapasInstoqueDiv = document.getElementById('chapasinstoque');
    chapasInstoqueDiv.innerHTML = '';

    // Iterar sobre os dados recebidos e criar elementos para exibição
    response.data.forEach(chapa => {
      // Criar um elemento para exibir as informações desejadas (medida, quantidade_comprada, qualidade, fornecedor)
      const chapaElement = document.createElement('div');
      chapaElement.classList.add('chapa-item'); // Adicione uma classe se desejar estilizar via CSS

      // Criar elementos individuais para cada campo e adicioná-los ao chapaElement
      const medidaElement = document.createElement('div');
      medidaElement.textContent = `${chapa.medida}`;
      medidaElement.className = "celulaLinha";

      const quantidadeElement = document.createElement('div');
      quantidadeElement.textContent = `${chapa.quantidade_comprada}`;
      quantidadeElement.className = "celulaLinha";

      const qualidadeElement = document.createElement('div');
      qualidadeElement.textContent = `${chapa.qualidade}`;
      qualidadeElement.className = "celulaLinha";

      const fornecedorElement = document.createElement('div');
      fornecedorElement.textContent = `${chapa.fornecedor}`;
      fornecedorElement.className = "celulaLinha";

      // Adicionar os elementos individuais ao chapaElement
      chapaElement.appendChild(medidaElement);
      chapaElement.appendChild(quantidadeElement);
      chapaElement.appendChild(qualidadeElement);
      chapaElement.appendChild(fornecedorElement);

      // Adicionar evento de clique para selecionar a chapa
      chapaElement.addEventListener("click", () => {
        // Remove a classe 'selected' de todas as chapas
        const chapas = chapasInstoqueDiv.getElementsByClassName("chapa-item");
        for (let i = 0; i < chapas.length; i++) {
          chapas[i].classList.remove("selected");
        }
        // Adiciona a classe 'selected' à chapa clicada
        chapaElement.classList.add("selected");

        // Atualiza o conteúdo do <pre> com o JSON da chapa clicada
        const modalContent = document.getElementById("modal-content-conjugação");
        const preElement = modalContent.querySelector("pre");
        preElement.textContent = JSON.stringify(chapa, null, 2);

        // Atualiza a representação da chapa de papelão
        updateCardboardRepresentation(chapa);

        // Guarda as medidas da chapa selecionada
        const selectedCardboard = {
          largura: chapa.largura,
          comprimento: chapa.comprimento,
        };
        console.log(`Medidas da chapa selecionada: largura ${selectedCardboard.largura}, comprimento ${selectedCardboard.comprimento}`);

        document.getElementById("AddConjugStaged").addEventListener("click", () => {
          addStagedCard(selectedCardboard);
        });
      });

      // Adicionar o chapaElement à div principal
      chapasInstoqueDiv.appendChild(chapaElement);
    });

    console.log('Chapas em estoque exibidas com sucesso.');
  } catch (error) {
    console.error('Erro ao obter chapas em estoque:', error);
    // Tratar erros ou exibir mensagem adequada ao usuário
  }
}

// Chamar a função para listar as chapas em estoque ao carregar a página, por exemplo
document.addEventListener('DOMContentLoaded', listarChapasEmEstoque);