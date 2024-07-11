import { updateCardboardRepresentation } from "./cardboard.js";
import { addStagedCard } from "./staged-cards.js";

// Função para criar a lista de chapas
export function criarListaDeChapas(chapas) {
  const chapasInstoqueDiv = document.getElementById("chapasinstoque");
  if (!chapasInstoqueDiv) {
    console.error("Elemento 'chapasinstoque' não encontrado.");
    return;
  }

  // Limpar o conteúdo atual da div
  chapasInstoqueDiv.innerHTML = "";

  // Iterar sobre as propriedades do objeto recebido e criar elementos para exibição
  Object.values(chapas).forEach((chapa) => {
    // Criar um elemento para exibir as informações desejadas (medida, quantidade_comprada, qualidade, fornecedor)
    const chapaElement = document.createElement("div");
    chapaElement.classList.add("chapa-item"); // Adicione uma classe se desejar estilizar via CSS

    // Criar elementos individuais para cada campo e adicioná-los ao chapaElement
    const medidaElement = document.createElement("div");
    medidaElement.textContent = `${chapa.medida}`;
    medidaElement.className = "celulaLinha";

    const quantidadeElement = document.createElement("div");
    quantidadeElement.textContent = `${chapa.quantidade_comprada}`;
    quantidadeElement.className = "celulaLinha";

    const qualidadeElement = document.createElement("div");
    qualidadeElement.textContent = `${chapa.qualidade}`;
    qualidadeElement.className = "celulaLinha";

    const fornecedorElement = document.createElement("div");
    fornecedorElement.textContent = `${chapa.fornecedor}`;
    fornecedorElement.className = "celulaLinha";

    // Adicionar os elementos individuais ao chapaElement
    chapaElement.appendChild(medidaElement);
    chapaElement.appendChild(quantidadeElement);
    chapaElement.appendChild(qualidadeElement);
    chapaElement.appendChild(fornecedorElement);

    // Adicionar evento de clique para selecionar a chapa
    chapaElement.addEventListener("click", () =>
      marcarComoSelecionada(chapa, chapaElement, chapasInstoqueDiv)
    );

    // Adicionar o chapaElement à div principal
    chapasInstoqueDiv.appendChild(chapaElement);
  });

  console.log("Chapas em estoque exibidas com sucesso.");

  // Adicionar evento de clique para mostrar todas as chapas novamente
  const imgHeaderContainer = document.querySelector('.imgheaderctainer');
  if (imgHeaderContainer) {
    imgHeaderContainer.addEventListener("click", () => mostrarTodasAsChapas(chapasInstoqueDiv));
  } else {
    console.error("Elemento '.imgheaderctainer' não encontrado.");
  }
}


// Variável para armazenar as medidas da última chapa selecionada
let selectedCardboard = {
    id_chapa: null,
    largura: null,
    comprimento: null
  };
  
export function marcarComoSelecionada(chapa, chapaElement, chapasInstoqueDiv) {
    // Limpa os valores antigos de selectedCardboard
    selectedCardboard = {
      id_chapa: null,
      largura: null,
      comprimento: null
    };
  
    // Remove a classe 'selected' de todas as chapas e esconde as não selecionadas
    const chapas = chapasInstoqueDiv.getElementsByClassName("chapa-item");
    for (let i = 0; i < chapas.length; i++) {
      chapas[i].classList.remove("selected");
      chapas[i].style.display = "none"; // Esconde todas as chapas
    }
  
    // Mostra apenas a chapa selecionada na div chapaselecionada
    const chapaSelecionadaDiv = document.querySelector(".chapaselecionada");
    chapaSelecionadaDiv.innerHTML = ''; // Limpa o conteúdo atual
    const chapaElementClone = chapaElement.cloneNode(true); // Clona o elemento da lista de chapas
    chapaElementClone.classList.add("selected"); // Adiciona a classe selected ao clone
    chapaElementClone.style.display = "flex"; // Garante que o clone seja mostrado
    chapaSelecionadaDiv.appendChild(chapaElementClone); // Adiciona o clone à div chapaselecionada
  
    // Adiciona display: none à classe header-chapas
    const headerChapas = document.querySelector(".header-chapas");
    if (headerChapas) {
      headerChapas.style.display = "none";
    }
  
    // Atualiza o conteúdo do <pre> com o JSON da chapa clicada
    const modalContent = document.getElementById("modal-content-conjugação");
    const preElement = modalContent.querySelector("pre");
    preElement.textContent = JSON.stringify(chapa, null, 2);
  
    // Atualiza a representação da chapa de papelão
    updateCardboardRepresentation(chapa);
  
    // Atualiza os detalhes da chapa selecionada
    selectedCardboard.id_chapa = chapa.id_chapa;
    selectedCardboard.largura = chapa.largura;
    selectedCardboard.comprimento = chapa.comprimento;
    console.log(`Medidas da chapa selecionada: largura ${selectedCardboard.largura}, comprimento ${selectedCardboard.comprimento}`);
  
    // Mostra o objeto selectedCardboard no console
    console.log("selectedCardboard:", selectedCardboard);
  
    // Remove o evento de clique anterior, se existir
    const addConjugStagedButton = document.getElementById("AddConjugStaged");
    addConjugStagedButton.removeEventListener("click", onClickAddStagedCard);
  
    // Adiciona o evento de clique para adicionar o card staged
    addConjugStagedButton.addEventListener("click", onClickAddStagedCard);
  }
  
// Função de callback para adicionar o card staged
function onClickAddStagedCard() {
    addStagedCard(selectedCardboard);
}
  
// Função para mostrar todas as chapas novamente e o header-chapas
function mostrarTodasAsChapas(chapasInstoqueDiv) {
    const chapas = chapasInstoqueDiv.getElementsByClassName("chapa-item");
    for (let i = 0; i < chapas.length; i++) {
      chapas[i].style.display = "flex"; // Mostra todas as chapas novamente
    }
  
    // Mostra o elemento header-chapas, se existir
    const headerChapas = document.querySelector(".header-chapas");
    if (headerChapas) {
      headerChapas.style.display = "flex";
    }
}
