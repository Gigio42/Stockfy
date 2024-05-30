import { updateItemStatus } from "../scripts/connections.js";

/* ============================== */
/* LISTA DE CARDS                 */
/* ============================== */
export function createCard(item) {
  const card = document.createElement("div");
  card.className = "col-12 mb-4";

  const cardContainer = document.createElement("div");
  cardContainer.className = "card h-100";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const headerDiv = document.createElement("div");
  headerDiv.style.display = "flex";
  headerDiv.style.justifyContent = "space-between";
  headerDiv.style.marginBottom = "20px";

  const partNumberDiv = document.createElement("div");
  partNumberDiv.className = "part-number";
  partNumberDiv.textContent = item.Item.part_number;
  headerDiv.appendChild(partNumberDiv);

  const keysDiv = document.createElement("div");
  keysDiv.className = "keys grid-container";
  keysDiv.style.gridTemplateColumns = "repeat(4, 1fr)";

  const keys = ["CHAPAS", "QUANT.", "CLIENTE", "MEDIDA"];
  keys.forEach((key) => {
    const keyDiv = document.createElement("div");
    keyDiv.textContent = key;
    keysDiv.appendChild(keyDiv);
  });

  headerDiv.appendChild(keysDiv);

  const orderPrazoDiv = document.createElement("div");
  orderPrazoDiv.className = "order-prazo";
  orderPrazoDiv.style.display = "flex";
  orderPrazoDiv.style.flexDirection = "column";

  const orderSpan = document.createElement("span");
  orderSpan.className = "ordem";
  orderSpan.textContent = `Processo: ${item.ordem}`;
  orderPrazoDiv.appendChild(orderSpan);

  const prazoSpan = document.createElement("span");
  prazoSpan.className = "prazo";
  prazoSpan.textContent = `Prazo: ${item.prazo}`;
  orderPrazoDiv.appendChild(prazoSpan);

  headerDiv.appendChild(orderPrazoDiv);

  cardBody.appendChild(headerDiv);

  const chapasList = createChapasList(item.Item.chapas);
  cardBody.appendChild(chapasList);

  const submitButton = document.createElement("button");
  submitButton.className = "btn-submit mt-2 align-right";
  submitButton.textContent = "Finalizar produção";
  submitButton.disabled = true;
  submitButton.addEventListener("click", async () => {
    const itemId = item.Item.id_item;
    const data = await updateItemStatus(itemId);
    alert(`Item ${item.Item.part_number}, id: ${item.Item.id_item} enviado`);
    console.log(data);
  });
  cardBody.appendChild(submitButton);

  updateSubmitButtonState(chapasList, submitButton);

  cardContainer.appendChild(cardBody);
  card.appendChild(cardContainer);

  return card;
}

function updateSubmitButtonState(chapasContainer, submitButton) {
  const checkboxes = chapasContainer.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const allChecked = Array.from(checkboxes).every((cb) => cb.checked);
      submitButton.disabled = !allChecked;
      submitButton.classList.toggle("enabled", allChecked);
    });
  });
}

/* ============================== */
/* LISTA DE CHAPAS                */
/* ============================== */

export function createChapasList(chapas) {
  const chapasContainer = document.createElement("div");
  chapasContainer.className = "chapas-container";

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
    chapaDetailsDiv.className = "chapa-details grid-container";
    chapaDetailsDiv.style.gridTemplateColumns = "repeat(4, 1fr)";

    const emptyDiv = document.createElement("div");
    chapaDetailsDiv.appendChild(emptyDiv);

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
    medidaCorteDiv.textContent = "300x500";
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
