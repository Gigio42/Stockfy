import BASE_URL from "../utils/config.js";

// Variável global para armazenar o ID do cartão sendo editado
let cardIDBeingEdited = null;
let cardCounter = 0; // Contador para gerar IDs únicos para os cartões

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
    data_compra: form.purchaseDate.value,
    fornecedor: form.supplier.value,
    id_compra: parseInt(form.purchaseID.value) || 0,
    data_prevista: document.getElementById("expectedDateManual").value,
  };

  // Adiciona os dados ao JSON
  const jsonData = {
    info_prod_comprados: [data],
  };

  // Exibe o JSON no elemento pre
  document.getElementById("jsonContent").textContent = JSON.stringify(jsonData, null, 2);

  // Adiciona um novo cartão no cardsContainer
  const cardContainer = document.getElementById("cardsContainer");
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.cardId = cardCounter++; // Adiciona um ID único ao cartão
  card.innerHTML = `
    <div class="card-body">
      <p class="card-title">Cliente: ${data.numero_cliente}</p>
      <p class="card-text">Largura: ${data.largura}</p>
      <p class="card-text">Comprimento: ${data.comprimento}</p>
      <p class="card-text">Qualidade: ${data.qualidade}</p>
      <p class="card-text">Quantidade Comprada: ${data.quantidade_comprada}</p>
      <p class="card-text">Vincos: ${data.vincos}</p>
     <p class="toggle-button" onclick="toggleDetails(this)">
    <img src="media/seta-para-a-direita.png" class="toggle-arrow icon" />
    <a href="#"><img src="media/icons8-editar-64.png" class="expand-icon icon" onclick="editCard(event)" /></a>
    <a href="#"><img src="media/icons8-apagar-para-sempre-96.png" class="expand-icon icon" onclick="deleteCard(event)" /></a>
</p>

      <div class="card-details" style="display: none;">
        <p class="card-text">Onda: ${data.onda}</p>
        <p class="card-text">Gramatura: ${data.gramatura}</p>
        <p class="card-text">Peso Total: ${data.peso_total}</p>
        <p class="card-text">Valor Unitário: ${data.valor_unitario}</p>
        <p class="card-text">Valor Total: ${data.valor_total}</p>
        <p class="card-text">Status: ${data.status}</p>
        <p class="card-text">Comprador: ${data.comprador}</p>
        <p class="card-text">Data Compra: ${data.data_compra}</p>
        <p class="card-text">Fornecedor: ${data.fornecedor}</p>
        <p class="card-text">ID Compra: ${data.id_compra}</p>
        <p class="card-text">Data Prevista: ${data.data_prevista}</p>
      </div>
    </div>
  `;
  cardContainer.appendChild(card);

  console.log("JSON criado ao adicionar um novo card:", jsonData);
});

// Função para obter o conteúdo de texto de um elemento com um seletor específico
function getTextContent(selector, context) {
  const element = context.querySelector(selector);
  return element ? element.textContent.trim().split(": ")[1] : "";
}

// Função para formatar a data no formato dd/mm/aaaa
function formatarDataParaEnvio(dateString) {
  const [ano, mes, dia] = dateString.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Evento de clique para enviar os dados do formulário manualmente
document.getElementById("sendbutton").addEventListener("click", function () {
  console.log("Botão clicado!");
  sendJSONDataToBackend();

});

// Função para enviar os dados JSON ao backend
function sendJSONDataToBackend() {
  let jsonData = {
    info_prod_comprados: [],
  };

  const cards = document.querySelectorAll(".card");

  if (cards.length === 0) {
    console.error("Nenhum card encontrado para enviar.");
    return;
  }

  cards.forEach((card) => {
    let data = {
      numero_cliente: parseInt(getTextContent(".card-title", card)) || 0,
      quantidade_comprada: parseInt(getTextContent(".card-text:nth-of-type(5)", card)) || 0,
      unidade: "CH",
      qualidade: getTextContent(".card-text:nth-of-type(4)", card),
      onda: getTextContent(".card-details .card-text:nth-of-type(1)", card),
      gramatura: parseFloat(getTextContent(".card-details .card-text:nth-of-type(2)", card)) || 0,
      peso_total: parseFloat(getTextContent(".card-details .card-text:nth-of-type(3)", card)) || 0,
      valor_unitario: getTextContent(".card-details .card-text:nth-of-type(4)", card) || "",
      valor_total: getTextContent(".card-details .card-text:nth-of-type(5)", card) || "",
      largura: parseInt(getTextContent(".card-text:nth-of-type(2)", card)) || 0,
      comprimento: parseInt(getTextContent(".card-text:nth-of-type(3)", card)) || 0,
      vincos: getTextContent(".card-text:nth-of-type(6)", card) || "",
      status: "COMPRADO",
      comprador: getTextContent(".card-details .card-text:nth-of-type(7)", card) || "",
      data_compra: formatarDataParaEnvio(getTextContent(".card-details .card-text:nth-of-type(8)", card)) || "",
      fornecedor: getTextContent(".card-details .card-text:nth-of-type(9)", card) || "",
      id_compra: parseInt(getTextContent(".card-details .card-text:nth-of-type(10)", card)) || 0,
      data_prevista: formatarDataParaEnvio(document.getElementById("expectedDateManual").value),
    };

    // Remova campos inválidos ou não definidos
    for (let key in data) {
      if (data[key] === null || data[key] === undefined || data[key] === "") {
        delete data[key];
      }
    }

    jsonData.info_prod_comprados.push(data);
  });

  sendData(jsonData);
}

// Função para enviar dados usando Axios
function sendData(jsonData) {
  const url = `${BASE_URL}/compras`;

  axios
    .post(url, jsonData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(() => {
      console.log("Dados enviados com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao enviar dados para o servidor. Por favor, tente novamente mais tarde.");
    });
}

