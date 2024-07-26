import { addStateToHistory } from "./undoRedo.js";

// Variável para gerar identificadores únicos incrementais
let cardIdCounter = 0;
export let medidasConjugConfimed = [];

export function handleAddMeasureBtnClick() {
  // Captura os valores dos inputs e converte para inteiro
  const largura = parseInt(document.getElementById("largura").value);
  const comprimento = parseInt(document.getElementById("comprimento").value);
  const quantasVezes = parseInt(document.getElementById("quantasvezes").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const partNumber = document.getElementById("partNumber").value; // Mantém como string
  const pedidoVenda = parseInt(document.getElementById("pedidoVenda").value);

  // Verifique se os valores convertidos são válidos (não são NaN), exceto partNumber que pode ser texto
  if (
    isNaN(largura) ||
    isNaN(comprimento) ||
    isNaN(quantasVezes) ||
    isNaN(quantidade) ||
    isNaN(pedidoVenda)
  ) {
    console.error(
      "Um ou mais valores dos inputs são inválidos. Certifique-se de que todos os campos numéricos sejam preenchidos corretamente e que o partNumber esteja presente."
    );
    return;
  }

  // Define o fator de escala (por exemplo, 0.3 para reduzir em 70%)
  const scale = 0.2;

  // Converte para pixels (assumindo 1 pixel = 1 mm)
  const larguraPx = largura * scale;
  const comprimentoPx = comprimento * scale;

  // Seleciona todos os staged cards que não têm a classe confirmed
  const unconfirmedStagedCards = document.querySelectorAll(
    ".staged-card:not(.confirmed)"
  );
  // Cria os novos cards apenas nos staged cards não confirmados
  unconfirmedStagedCards.forEach((stagedCardContainer) => {
    // Obtém o ID do stagedCard pai
    const stagedCardId = stagedCardContainer.id;

    // Obtém o id_chapa do atributo data do stagedCardContainer
    const id_chapa = stagedCardContainer.dataset.idChapa;

    for (let i = 0; i < quantasVezes; i++) {
      // Gera um identificador único para o cardinconjug
      const cardinconjugId = `cardinConjug-${Date.now()}-${cardIdCounter++}`;

      const stagedCard = document.createElement("div");
      stagedCard.className = "cardinconjug";
      stagedCard.id = cardinconjugId; // Define o id único
      stagedCard.style.width = `${comprimentoPx}px`;
      stagedCard.style.height = `${larguraPx}px`;

      // Botão para remover o cardinconjug
      const removeButton = document.createElement("button");
      removeButton.className = "remove-card-btn";
      removeButton.textContent = "x";
      removeButton.addEventListener("click", () => {
        // Remove o cardinconjug ao clicar no botão
        stagedCard.remove();

        // Remove a entrada correspondente de medidasConjugConfimed
        medidasConjugConfimed = medidasConjugConfimed.filter(
          (medida) => medida.partNumber !== cardinconjugId
        );

        addStateToHistory(); // Captura o estado após remover o card
      });

      // Conteúdo do cardinconjug
      stagedCard.innerHTML = `
        <div class="cardboard-dimensions">
          ${largura} X ${comprimento}
        </div>
      `;

      // Adiciona o botão de remoção e o cardinconjug dentro do stagedCardContainer
      stagedCard.appendChild(removeButton);
      stagedCardContainer.appendChild(stagedCard);

      // Cria o JSON com id_chapa, largura, comprimento, quantidade, quantas vezes
      const medidaConjug = {
        chapa: id_chapa,
        largura: largura,
        comprimento: comprimento,
        quantidade: quantidade,
        quantasVezes: quantasVezes,
        partNumber: partNumber.toString(), // Converte para string
        pedidoVenda: pedidoVenda,
      };

      // Mostra todos os dados no console
      console.log("Dados do formulário:", medidaConjug);

      // Verifica se a medida já existe no array medidasConjugConfimed
      const medidaExiste = medidasConjugConfimed.some(
        (medida) =>
          medida.chapa === id_chapa &&
          medida.largura === largura &&
          medida.comprimento === comprimento &&
          medida.quantidade === quantidade &&
          medida.quantasVezes === quantasVezes &&
          medida.partNumber === partNumber.toString()
      );

      // Se a medida não existir, adiciona ao array
      if (!medidaExiste) {
        medidasConjugConfimed.push(medidaConjug);
      }
    }
  });

  // Chamada de função ou armazenamento do array de JSONs conforme necessário
  processarMedidasConjug(medidasConjugConfimed);

  addStateToHistory(); // Captura o estado após adicionar novos cards
}

// Função para processar as medidas conjugadas
function processarMedidasConjug(medidasConjug) {
  console.log("Medidas conjugadas confirmadas:", medidasConjug);
}
