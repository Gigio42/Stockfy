const userName = "Fulano";
const name = "riscador";

document.getElementById('user-name').textContent = userName;
document.getElementById('machine-name').textContent = name;

async function fetchData(name) {
  try {
    const response = await axios.get(`http://localhost:3000/producao/maquina/${name}/itens/chapas`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function createCard(item) {
  const card = document.createElement("div");
  card.className = "col-12 mb-4";

  const cardContainer = document.createElement("div");
  cardContainer.className = "card h-100";

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";

  const partNumberDiv = document.createElement("div");
  partNumberDiv.className = "part-number";
  partNumberDiv.textContent = item.Item.part_number;

  const orderPrazoDiv = document.createElement("div");
  const orderSpan = document.createElement("span");
  orderSpan.textContent = `Ordem: ${item.ordem}`;
  const prazoSpan = document.createElement("span");
  prazoSpan.textContent = `Prazo: ${item.prazo}`;
  orderPrazoDiv.appendChild(orderSpan);
  orderPrazoDiv.appendChild(document.createTextNode(" | "));
  orderPrazoDiv.appendChild(prazoSpan);

  cardHeader.appendChild(partNumberDiv);
  cardHeader.appendChild(orderPrazoDiv);

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const chapasList = createChapasList(item.Item.chapas);
  cardBody.appendChild(chapasList);

  cardContainer.appendChild(cardHeader);
  cardContainer.appendChild(cardBody);

  card.appendChild(cardContainer);

  const submitButton = document.createElement("button");
  submitButton.className = "btn-submit mt-2 align-right";
  submitButton.textContent = "Enviar";
  submitButton.disabled = true;
  submitButton.addEventListener("click", () => alert(`Item ${item.Item.part_number} enviado`));

  cardBody.appendChild(submitButton);
  updateSubmitButtonState(card, submitButton);

  return card;
}

function createChapasList(chapas) {
  const chapasContainer = document.createElement("div");
  chapasContainer.className = "chapas-container";

  chapas.forEach((chapa) => {
    const chapaCard = document.createElement("div");
    chapaCard.className = "card bg-dark text-white mb-2 chapa-card";
    chapaCard.style.borderRadius = "10px";

    const chapaCardBody = document.createElement("div");
    chapaCardBody.className = "card-body d-flex justify-content-between align-items-center";

    const chapaDetailsDiv = document.createElement("div");
    const qualidadeDiv = document.createElement("div");
    qualidadeDiv.textContent = `Qualidade: ${chapa.chapa.qualidade}`;
    const medidaDiv = document.createElement("div");
    medidaDiv.textContent = `Medida: ${chapa.chapa.medida}`;
    const larguraComprimentoDiv = document.createElement("div");
    larguraComprimentoDiv.textContent = `Largura x Comprimento: ${chapa.chapa.largura}x${chapa.chapa.comprimento}`;
    chapaDetailsDiv.appendChild(qualidadeDiv);
    chapaDetailsDiv.appendChild(medidaDiv);
    chapaDetailsDiv.appendChild(larguraComprimentoDiv);

    const customCheckboxDiv = document.createElement("div");
    customCheckboxDiv.className = "custom-checkbox";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `chapaCheck${chapa.chapa.id}`;
    checkbox.setAttribute("aria-label", `Select ${chapa.chapa.name}`);

    const checkmarkSpan = document.createElement("span");
    checkmarkSpan.className = "checkmark";

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.setAttribute("for", `chapaCheck${chapa.chapa.id}`);
    label.textContent = chapa.chapa.name;

    customCheckboxDiv.appendChild(checkbox);
    customCheckboxDiv.appendChild(checkmarkSpan);
    customCheckboxDiv.appendChild(label);

    chapaCardBody.appendChild(chapaDetailsDiv);
    chapaCardBody.appendChild(customCheckboxDiv);

    chapaCard.appendChild(chapaCardBody);
    chapasContainer.appendChild(chapaCard);
  });

  return chapasContainer;
}

function updateSubmitButtonState(card, submitButton) {
  const checkboxes = card.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
      submitButton.disabled = !allChecked;
      submitButton.classList.toggle("enabled", allChecked);
    });
  });
}

async function render() {
  const data = await fetchData(name);
  if (data && data.items) {
    const itemsList = document.getElementById("itemsList");
    data.items.forEach((item) => itemsList.appendChild(createCard(item)));
  }
}

render();