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
    return;
  }

  const scale = 0.2;
  const larguraPx = largura * scale;
  const comprimentoPx = comprimento * scale;

  const unconfirmedStagedCards = document.querySelectorAll(
    ".staged-card:not(.confirmed)"
  );

  unconfirmedStagedCards.forEach((stagedCardContainer) => {
    const stagedCardId = stagedCardContainer.id;
    const id_chapa = stagedCardContainer.dataset.idChapa;

    for (let i = 0; i < quantasVezes; i++) {
      const cardinconjugId = `cardinConjug-${Date.now()}-${cardIdCounter++}`;

      const stagedCard = document.createElement("div");
      stagedCard.className = "cardinconjug";
      stagedCard.id = cardinconjugId;
      stagedCard.style.width = `${comprimentoPx}px`;
      stagedCard.style.height = `${larguraPx}px`;

      const removeButton = document.createElement("button");
      removeButton.className = "remove-card-btn";
      removeButton.textContent = "x";
      removeButton.addEventListener("click", () => {
        stagedCard.remove();
        medidasConjugConfimed = medidasConjugConfimed.filter(
          (medida) => medida.partNumber !== cardinconjugId
        );
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
      }
    }
  });

  processarMedidasConjug(medidasConjugConfimed);
  addStateToHistory();
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
