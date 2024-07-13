import BASE_URL from "../utils/config.js";

// Função para formatar a data no formato "dd/mm/aaaa"
function formatarDataParaEnvio(data) {
  const date = new Date(data);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Os meses começam do zero
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Variável global para armazenar o ID do cartão sendo editado
let cardIDBeingEdited = null;
let cardCounter = 0; // Contador para gerar IDs únicos para os cartões

// Variável global para armazenar todos os dados dos cartões
let allCardData = [];

// Função para alternar a exibição dos detalhes do cartão
window.toggleCardDetails = function (cardId) {
  const cardDetails = document.querySelector(`#card-${cardId} .card-details`);
  if (cardDetails) {
    if (cardDetails.style.display === "none" || cardDetails.style.display === "") {
      cardDetails.style.display = "flex";
    } else {
      cardDetails.style.display = "none";
    }
  } else {
    console.error(`Detalhes do cartão com ID ${cardId} não encontrados.`);
  }
};

// Função para abrir o modal
function abrirModal() {
  const modal = document.getElementById("mModal");
  if (modal) {
    modal.style.display = "block";
  } else {
    console.error("Modal não encontrado.");
  }
}
abrirModal();

document.getElementById("addPlateButton").addEventListener("click", function () {
  const form = document.getElementById("purchaseForm");

  // Capturando os valores do formulário
  const data = {
    numero_cliente: parseInt(form.customerNumber.value) || 0,
    quantidade_comprada: parseInt(form.quantity.value) || 0,
    unidade: "CH",
    qualidade: form.quality.value,
    onda: form.wave.value,
    gramatura: parseFloat(form.weight.value) || 0,
    peso_total: parseFloat(form.totalWeight.value) || 0,
    valor_unitario: form.unitPrice.value,
    valor_total: form.totalPrice.value,
    largura: parseInt(form.width.value) || 0,
    comprimento: parseInt(form.length.value) || 0,
    vincos: form.creases.value,
    status: "COMPRADO",
    comprador: form.buyer.value,
    data_compra: formatarDataParaEnvio(form.purchaseDate.value), // Formatando a data de compra
    fornecedor: form.supplier.value,
    id_compra: parseInt(form.purchaseID.value) || 0,
    data_prevista: document.getElementById("expectedDateManual").value,
  };

  // Verifique se todos os campos obrigatórios estão preenchidos corretamente
  if (
    !data.numero_cliente ||
    !data.quantidade_comprada ||
    !data.qualidade ||
    !data.largura ||
    !data.comprimento ||
    !data.vincos ||
    !data.comprador ||
    !data.data_compra ||
    !data.fornecedor
  ) {
    console.error("Todos os campos obrigatórios devem ser preenchidos.");
    return;
  }

  // Exibe os dados capturados no console para debug
  console.log("Dados capturados do formulário:", data);

  // Adiciona os dados ao array global
  allCardData.push(data);

  // Exibe o JSON atualizado no console
  console.log("JSON atualizado:", JSON.stringify({ info_prod_comprados: allCardData }, null, 2));

  // Exibe o JSON no elemento pre
  document.getElementById("jsonContent").textContent = JSON.stringify(
    { info_prod_comprados: allCardData },
    null,
    2
  );

  // Adiciona um novo cartão no cardsContainer
  const cardContainer = document.getElementById("cardsContainer");
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.cardId = cardCounter++; // Adiciona um ID único ao cartão
  card.innerHTML = `
    <div id="card-${card.dataset.cardId}" class="card">
      <div class="card-body">
        <p class="card-title">${data.numero_cliente}</p>
        <p class="card-text">${data.largura}</p>
        <p class="card-text">${data.comprimento}</p>
        <p class="card-text">${data.qualidade}</p>
        <p class="card-text">${data.quantidade_comprada}</p>
        <p class="card-text">${data.vincos}</p>
        <p class="toggle-button">
          <img src="media/seta-para-a-direita.png" class="toggle-arrow icon" onclick="toggleCardDetails(${card.dataset.cardId})" />
          <a href="#"><img src="media/icons8-editar-64.png" class="expand-icon icon" onclick="editCard(event)" /></a>
          <a href="#"><img src="media/icons8-delete-48.png" class="expand-icon icon" onclick="deleteCard(event)" /></a>
        </p>
      </div>
      <div class="card-details" style="display: none;">
        <p class="card-text">${data.onda}</p>
        <p class="card-text">${data.gramatura}</p>
        <p class="card-text">${data.peso_total}</p>
        <p class="card-text">${data.valor_unitario}</p>
        <p class="card-text">${data.valor_total}</p>
        <p class="card-text">${data.status}</p>
        <p class="card-text">${data.comprador}</p>
        <p class="card-text">${data.data_compra}</p>
        <p class="card-text">${data.fornecedor}</p>
        <p class="card-text">${data.id_compra}</p>
        <p class="card-text">${data.data_prevista}</p>
      </div>
    </div>
  `;
  cardContainer.appendChild(card);
});

// Função para enviar os cartões criados para o backend
export async function enviarCartoesCriados() {
  try {
    // Capturando a data prevista
    const expectedDateInput = document.getElementById("expectedDateManual");
    const expectedDate = formatarDataParaEnvio(expectedDateInput.value);
    
    // Atualizando a data prevista nos cartões
    allCardData = allCardData.map(card => ({ ...card, data_prevista: expectedDate }));
    
    console.log("Enviando cartões criados para o backend...");
    const response = await axios.post(`${BASE_URL}/compras/compras/cartoes`, { info_prod_comprados: allCardData }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Cartões criados enviados com sucesso:", response.data);
    // Aqui você pode realizar qualquer ação adicional após o envio bem-sucedido
  } catch (error) {
    console.error("Erro ao enviar cartões criados:", error);
    // Trate os erros conforme necessário
  }
}

// Adiciona um event listener ao botão "sendbutton"
document.getElementById("sendbutton").addEventListener("click", async function () {
  await enviarCartoesCriados();
});