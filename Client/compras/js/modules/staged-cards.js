import { addStateToHistory } from "./undoRedo.js";
import { medidasConjugConfimed } from "./form.js";

// Variável para gerar identificadores únicos incrementais
let cardIdCounter = 0;

// Função para adicionar o card staged com as medidas selecionadas
export function addStagedCard(selectedCardboard) {
  // Obtém largura, comprimento e id_chapa do JSON selecionado
  const { comprimento, largura, id_chapa } = selectedCardboard;

  // Verifica se largura e comprimento são números válidos
  if (isNaN(comprimento) || isNaN(largura)) {
    console.error("Largura ou comprimento inválidos:", selectedCardboard);
    return;
  }

  // Define o fator de escala (por exemplo, 0.2 para reduzir em 80%)
  const scale = 0.2;

  // Converte para pixels (assumindo 1 pixel = 1 mm)
  const larguraPx = largura * scale;
  const comprimentoPx = comprimento * scale;

  // Seleciona o contêiner onde os cards staged serão adicionados
  const stagedCardsContainer = document.getElementById("stagedCardsContainer");

  // Gera um identificador único
  const cardId = `stagedCard-${Date.now()}-${cardIdCounter++}`;

  // Cria um novo elemento <div> para representar o card staged
  const stagedCard = document.createElement("div");
  stagedCard.className = "staged-card";
  stagedCard.id = cardId;
  stagedCard.dataset.idChapa = id_chapa; // Adiciona o id_chapa como atributo data
  stagedCard.style.width = `${comprimentoPx}px`; // Define a largura do card
  stagedCard.style.height = `${larguraPx}px`; // Define a altura do card
  stagedCard.innerHTML = `
        <div class="cardboard-dimensions"></div>
    `;

  // Cria um contêiner para os botões
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  buttonContainer.dataset.cardId = cardId; // Associa o contêiner de botões ao card

  // Cria um botão de exclusão
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Excluir";
  deleteButton.addEventListener("click", () => {
    // Excluir o card, independentemente de estar confirmado ou não
    const cardToDelete = document.getElementById(cardId);
    if (cardToDelete) {
      cardToDelete.remove();
      buttonContainer.remove();
    }
  });

  // Cria um botão de confirmar
  const confirmButton = document.createElement("button");
  confirmButton.className = "confirm-button";
  confirmButton.textContent = "Confirmar";
  confirmButton.onclick = () => {
    // Marca apenas o card específico como confirmado
    const cardToConfirm = document.getElementById(cardId);
    if (cardToConfirm) {
      cardToConfirm.classList.add("confirmed"); // Adiciona uma classe para indicar confirmação
      // Chame esta função sempre que precisar atualizar a visualização das dimensões confirmadas
      updateConjugacoesStaged();
      console.log("Medidas Conjugadas Confirmadas:", medidasConjugConfimed); // Mostra o JSON exportado no console
    }
  };

  // Adiciona os botões ao contêiner de botões
  buttonContainer.appendChild(deleteButton);
  buttonContainer.appendChild(confirmButton);

  // Cria um novo contêiner para envolver o card staged e os botões
  const cardContainer = document.createElement("div");
  cardContainer.className = "card-container";
  cardContainer.appendChild(stagedCard);
  cardContainer.appendChild(buttonContainer);

  // Adiciona o contêiner ao contêiner principal
  stagedCardsContainer.appendChild(cardContainer);

  // Log de confirmação após adicionar o card ao DOM
  console.log(`Card staged adicionado ao contêiner para largura: ${largura} e comprimento: ${comprimento}, com ID: ${cardId}`);
  console.log(`ID da Chapa: ${id_chapa}`); // Mostra o id_chapa no console
}

function updateConjugacoesStaged() {
  const conjugacoesStaged = document.getElementById("conjugacoesstaged");

  // Limpa o conteúdo atual para evitar duplicatas
  conjugacoesStaged.innerHTML = "";

  // Usa um Set para armazenar combinações únicas de id_chapa, largura e comprimento
  const uniqueDimensions = new Set();

  // Itera sobre o array de medidas confirmadas
  medidasConjugConfimed.forEach(({ id_chapa, largura, comprimento }) => {
    const dimensionKey = `${id_chapa}-${largura}x${comprimento}`;

    // Apenas adiciona ao DOM se a combinação ainda não estiver no Set
    if (!uniqueDimensions.has(dimensionKey)) {
      uniqueDimensions.add(dimensionKey);

      // Cria um novo elemento para exibir as dimensões
      const dimensionElement = document.createElement("div");
      dimensionElement.className = "cardMedidaConjug";
      dimensionElement.textContent = `${largura} x ${comprimento}`;

      // Adiciona o novo elemento ao container
      conjugacoesStaged.appendChild(dimensionElement);
    }
  });
}