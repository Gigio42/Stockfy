import { addStateToHistory } from "./undoRedo.js";

let cardIdCounter = 0;
export let medidasConjugConfimed = [];

export function handleAddMeasureBtnClick() {
  const largura = parseInt(document.getElementById("largura").value);
  const comprimento = parseInt(document.getElementById("comprimento").value);
  const quantasVezes = parseInt(document.getElementById("quantasvezes").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const partNumber = document.getElementById("partNumber").value;
  const pedidoVenda = parseInt(document.getElementById("pedidoVenda").value);

  if (
    isNaN(largura) ||
    isNaN(comprimento) ||
    isNaN(quantasVezes) ||
    isNaN(quantidade) ||
    isNaN(pedidoVenda)
  ) {
    Swal.fire({
      title: 'Erro',
      text: 'Todos os campos são obrigatórios.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    console.log("Erro: Todos os campos são obrigatórios.");
    return;
  }

  const scale = 0.2;
  const larguraPx = largura * scale;
  const comprimentoPx = comprimento * scale;

  console.log("Dimensões em pixels: largura =", larguraPx, "comprimento =", comprimentoPx);

  const unconfirmedStagedCards = document.querySelectorAll(
    ".staged-card:not(.confirmed)"
  );

  unconfirmedStagedCards.forEach((stagedCardContainer) => {
    const stagedCardId = stagedCardContainer.id;
    const id_chapa = stagedCardContainer.dataset.idChapa;

    console.log("Processando card:", stagedCardId, "com chapa:", id_chapa);

    for (let i = 0; i < quantasVezes; i++) {
      const cardinconjugId = `cardinConjug-${Date.now()}-${cardIdCounter++}`;
      console.log("Criando card:", cardinconjugId);

      const stagedCard = document.createElement("div");
      stagedCard.className = "cardinconjug";
      stagedCard.id = cardinconjugId;
      stagedCard.style.width = `${comprimentoPx}px`;
      stagedCard.style.height = `${larguraPx}px`;

      const removeButton = document.createElement("button");
      removeButton.className = "remove-card-btn";
      removeButton.textContent = "x";
      removeButton.addEventListener("click", () => {
        // Remove o card da interface
        stagedCard.remove();
        console.log("Card removido:", cardinconjugId);

        // Remove os dados do card específico do array medidasConjugConfimed
        medidasConjugConfimed = medidasConjugConfimed.filter(
          (medida) =>
            !(medida.chapa === id_chapa &&
              medida.largura === largura &&
              medida.comprimento === comprimento &&
              medida.quantidade === quantidade &&
              medida.quantasVezes === quantasVezes &&
              medida.partNumber === partNumber.toString())
        );

        console.log("Dados após remoção:", medidasConjugConfimed);

        // Atualiza o estado e processa medidas conjugadas
        addStateToHistory();
      });

      stagedCard.innerHTML = `
        <div class="cardboard-dimensions">
          ${largura} X ${comprimento}
        </div>
      `;

      stagedCard.appendChild(removeButton);
      stagedCardContainer.appendChild(stagedCard);

      const medidaConjug = {
        chapa: id_chapa,
        largura: largura,
        comprimento: comprimento,
        quantidade: quantidade,
        quantasVezes: quantasVezes,
        partNumber: partNumber.toString(),
        pedidoVenda: pedidoVenda,
      };

      console.log("Dados do formulário:", medidaConjug);

      const medidaExiste = medidasConjugConfimed.some(
        (medida) =>
          medida.chapa === id_chapa &&
          medida.largura === largura &&
          medida.comprimento === comprimento &&
          medida.quantidade === quantidade &&
          medida.quantasVezes === quantasVezes &&
          medida.partNumber === partNumber.toString()
      );

      if (!medidaExiste) {
        medidasConjugConfimed.push(medidaConjug);
        console.log("Medida adicionada ao array:", medidaConjug);
      } else {
        console.log("Medida já existente:", medidaConjug);
      }
    }
  });

  processarMedidasConjug(medidasConjugConfimed);
  console.log("Medidas conjugadas processadas:", medidasConjugConfimed);

  addStateToHistory();
  console.log("Estado atualizado.");
}

function processarMedidasConjug(medidasConjug) {
  console.log("Medidas conjugadas confirmadas:", medidasConjug);
}

// Verificação no botão "Enviar"
document.getElementById("adicionarMedidaBtn").addEventListener("click", function () {
  const largura = document.getElementById("largura").value;
  const comprimento = document.getElementById("comprimento").value;
  const quantasVezes = document.getElementById("quantasvezes").value;
  const quantidade = document.getElementById("quantidade").value;
  const partNumber = document.getElementById("partNumber").value;
  const pedidoVenda = document.getElementById("pedidoVenda").value;

  if (
    !largura ||
    !comprimento ||
    !quantasVezes ||
    !quantidade ||
    !partNumber ||
    !pedidoVenda
  ) {
    Swal.fire({
      title: 'Erro',
      text: 'Todos os campos são obrigatórios.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  // Continuar com o envio dos dados
});
