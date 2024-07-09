// cardboard.js - Funções relacionadas à representação do papelão

export function updateCardboardRepresentation(prod) {
  const cardboardDiv = document.getElementById("cardboardRepresentation");

  // Verifica se há medidas selecionadas
  if (!prod || !prod.comprimento || !prod.largura) {
    cardboardDiv.textContent = "Selecione uma chapa primeiro";
    cardboardDiv.classList.add("empty-state"); // Opcional: adicionar uma classe para estilização
    return;
  }

  // Obtém largura e comprimento do JSON
  const comprimento = parseInt(prod.comprimento);
  const largura = parseInt(prod.largura);

  // Define o fator de escala (por exemplo, 0.3 para reduzir em 70%)
  const scale = 0.2;

  // Converte para pixels (assumindo 1 pixel = 1 mm)
  const larguraPx = largura * scale;
  const comprimentoPx = comprimento * scale;

  // Cria a representação da chapa de papelão em pixels
  cardboardDiv.innerHTML = `
    <div class="cardboard-sheet" style="width: ${comprimentoPx}px; height: ${larguraPx}px;">
      <div class="cardboard-dimensions">
        ${largura} X ${comprimento}
      </div>
    </div>
  `;
}
