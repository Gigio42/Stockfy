import { updateItemStatus } from "../scripts/connections.js";

/* ============================== */
/* LISTA DE CARDS                 */
/* ============================== */
export function createCard(item, maquinaName, estado, executor) {
  const card = document.createElement("div");
  card.className = "col-12 mb-4";

  if (estado === "FEITO") {
    card.classList.add("finalizado");
    card.style.order = 3;
  } else if (estado === "PROXIMAS") {
    card.classList.add("proxima");
    card.style.order = 2;
  } else {
    card.style.order = 1;
  }

  const cardContainer = document.createElement("div");
  cardContainer.className = "card h-100";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const headerDiv = document.createElement("div");
  headerDiv.style.display = "flex";
  headerDiv.style.justifyContent = "space-between";
  headerDiv.style.marginBottom = "1px";
  headerDiv.style.alignItems = "flex-start";

  const partNumberDiv = document.createElement("div");
  partNumberDiv.className = "part-number";
  partNumberDiv.textContent = item.Item.part_number;
  headerDiv.appendChild(partNumberDiv);

  const orderDiv = document.createElement("div");
  orderDiv.className = "ordem ordem-div";
  orderDiv.textContent = item.ordem;
  headerDiv.appendChild(orderDiv);

  cardBody.appendChild(headerDiv);

  const chapasList = createChapasList(item.Item.chapas, item);
  cardBody.appendChild(chapasList);

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "flex";
  buttonContainer.style.justifyContent = "space-between";

  const prazoDiv = document.createElement("div");
  prazoDiv.className = "prazo prazo-div";
  prazoDiv.textContent = `Prazo: ${item.prazo}`;
  buttonContainer.appendChild(prazoDiv);

  const submitButton = document.createElement("button");
  submitButton.className = "btn-submit mt-2 align-right";
  submitButton.textContent = "Finalizar produção";
  submitButton.disabled = estado !== "ATUAL";
  submitButton.addEventListener("click", async () => {
    const itemId = item.Item.id_item;
    const data = await updateItemStatus(itemId, maquinaName, executor);
    alert(`Item ${item.Item.part_number}, id: ${item.Item.id_item} enviado`);
    console.log(data);
    window.location.reload();
  });
  buttonContainer.appendChild(submitButton);

  cardBody.appendChild(buttonContainer);

  updateSubmitButtonState(chapasList, submitButton);

  const checkboxes = chapasList.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.disabled = estado !== "ATUAL";
    if (estado === "FEITO") {
      checkbox.checked = true;
    }
  });

  cardContainer.appendChild(cardBody);
  card.appendChild(cardContainer);

  return card;
}

function updateSubmitButtonState(chapasContainer, submitButton) {
  const checkboxes = chapasContainer.querySelectorAll('input[type="checkbox"]');

  function updateButtonState() {
    const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
    submitButton.disabled = !allChecked;
    submitButton.classList.toggle("enabled", allChecked);
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateButtonState);
  });

  updateButtonState();
}

export function createChapasHeader(keys) {
  const chapaCard = document.createElement("div");
  chapaCard.className = "card text-white mb-2 chapa-card";
  chapaCard.style.borderRadius = "10px";
  chapaCard.style.backgroundColor = "#2a2a2a";

  const chapaCardBody = document.createElement("div");
  chapaCardBody.className = "card-body d-flex justify-content-between align-items-center";

  const chapaContentDiv = document.createElement("div");
  chapaContentDiv.className = "chapa-content flex-container";
  chapaContentDiv.style.width = "100%";
  chapaContentDiv.style.justifyContent = "space-between";

  const chapaDetailsDiv = document.createElement("div");
  chapaDetailsDiv.className = "chapa-details flex-container";
  chapaDetailsDiv.style.justifyContent = "space-between";
  chapaDetailsDiv.style.flexWrap = "wrap";
  chapaDetailsDiv.style.alignItems = "center";

  keys.forEach((key) => {
    const keyDiv = document.createElement("div");
    keyDiv.textContent = key;
    chapaDetailsDiv.appendChild(keyDiv);
  });

  chapaContentDiv.appendChild(chapaDetailsDiv);
  chapaCardBody.appendChild(chapaContentDiv);
  chapaCard.appendChild(chapaCardBody);

  return chapaCard;
}

/* ============================== */
/* LISTA DE CHAPAS                */
/* ============================== */

export function createChapasList(chapas, item) {
  const chapasContainer = document.createElement("div");
  chapasContainer.className = "chapas-container";

  // Create header
  const header = createChapasHeader(["CHAPAS", "QUANT.", "CLIENTE", "MEDIDA"]);
  chapasContainer.appendChild(header);

  chapas.forEach((chapa) => {
    const chapaCard = document.createElement("div");
    chapaCard.className = "card bg-dark text-white mb-2 chapa-card";
    chapaCard.style.borderRadius = "10px";

    const chapaCardBody = document.createElement("div");
    chapaCardBody.className = "card-body d-flex justify-content-between align-items-center";

    const chapaContentDiv = document.createElement("div");
    chapaContentDiv.className = "chapa-content flex-container";
    chapaContentDiv.style.width = "100%";
    chapaContentDiv.style.justifyContent = "space-between";

    const chapaDetailsDiv = document.createElement("div");
    chapaDetailsDiv.className = "chapa-details flex-container";
    chapaDetailsDiv.style.justifyContent = "space-between";
    chapaDetailsDiv.style.flexWrap = "wrap";
    chapaDetailsDiv.style.alignItems = "center";

    const larguraComprimentoDiv = document.createElement("div");
    larguraComprimentoDiv.textContent = `${chapa.chapa.largura}x${chapa.chapa.comprimento}`;
    chapaDetailsDiv.appendChild(larguraComprimentoDiv);

    const quantidadeDiv = document.createElement("div");
    quantidadeDiv.textContent = `${chapa.quantidade}`;
    chapaDetailsDiv.appendChild(quantidadeDiv);

    const numeroClienteDiv = document.createElement("div");
    numeroClienteDiv.textContent = `${chapa.chapa.numero_cliente}`;
    chapaDetailsDiv.appendChild(numeroClienteDiv);

    const medidaCorteDiv = document.createElement("div");
    medidaCorteDiv.textContent = `${item.corte}`;
    chapaDetailsDiv.appendChild(medidaCorteDiv);

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

    chapaContentDiv.appendChild(chapaDetailsDiv);
    chapaContentDiv.appendChild(customCheckboxDiv);

    chapaCardBody.appendChild(chapaContentDiv);

    chapaCard.appendChild(chapaCardBody);
    chapasContainer.appendChild(chapaCard);
  });

  return chapasContainer;
}
