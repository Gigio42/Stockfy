import { updateItemStatus } from "../scripts/connections.js";

/* ============================== */
/* LISTA DE CARDS                 */
/* ============================== */
export function createCard(item, maquinaName, estado, executor) {
  const card = document.createElement("div");
  card.className = "kanban-item";
  card.id = `item-${item.Item.id_item}`;
  card.dataset.itemId = item.Item.id_item;

  const cardContainer = document.createElement("div");
  cardContainer.className = "card h-100";

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  const contentDiv = document.createElement("div");
  contentDiv.style.display = "flex";
  contentDiv.style.justifyContent = "space-between";

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
    if (checkbox.nextSibling && checkbox.nextSibling.classList.contains("checkmark")) {
      checkbox.parentNode.removeChild(checkbox.nextSibling);
    }

    checkbox.parentNode.classList.add("custom-checkbox");

    if (estado === "PROXIMAS") {
      const lockIcon = document.createElement("span");
      lockIcon.classList.add("checkmark");
      checkbox.parentNode.insertBefore(lockIcon, checkbox.nextSibling);
      checkbox.disabled = true;
    } else {
      const checkmark = document.createElement("span");
      checkmark.classList.add("checkmark");
      checkbox.parentNode.insertBefore(checkmark, checkbox.nextSibling);

      if (estado === "FEITO") {
        checkbox.checked = true;
        checkbox.disabled = true;
      } else {
        checkbox.disabled = false;
      }
    }
  });

  cardContainer.appendChild(cardBody);
  card.appendChild(cardContainer);

  return card;
}

function updateSubmitButtonState(chapasContainer, submitButton) {
  //ignorar func do checkbox do header
  const checkboxes = Array.from(chapasContainer.querySelectorAll('input[type="checkbox"]')).filter(cb => cb.id !== 'headerCheck');

  function updateButtonState() {
    const allChecked = checkboxes.every((cb) => cb.checked);
    submitButton.disabled = !allChecked;
    submitButton.classList.toggle("enabled", allChecked);
  }

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", updateButtonState);
  });

  updateButtonState();
}

function createChapasHeader(keys) {
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
  chapaDetailsDiv.style.display = "flex"; 
  chapaDetailsDiv.style.justifyContent = "space-between"; 
  chapaDetailsDiv.style.flexWrap = "nowrap"; 

  keys.forEach((key) => {
    const keyDiv = document.createElement("div");
    keyDiv.textContent = key;
    keyDiv.style.minWidth = "100px";
    chapaDetailsDiv.appendChild(keyDiv);
  });

  // checkbox oculto p/ dar espaçamento igual
  const customCheckboxDiv = document.createElement("div");
  customCheckboxDiv.className = "custom-checkbox hidden-checkbox";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `headerCheck`;

  const checkmarkSpan = document.createElement("span");
  checkmarkSpan.className = "checkmark";

  customCheckboxDiv.appendChild(checkbox);
  customCheckboxDiv.appendChild(checkmarkSpan);

  chapaContentDiv.appendChild(chapaDetailsDiv);
  chapaContentDiv.appendChild(customCheckboxDiv);
  chapaCardBody.appendChild(chapaContentDiv);
  chapaCard.appendChild(chapaCardBody);

  return chapaCard;
}


export function createChapasList(chapas, item) {
  const chapasContainer = document.createElement("div");
  chapasContainer.className = "chapas-container";

  const header = createChapasHeader(["PART NUMBER", "CHAPA", "MEDIDA", "OP", "SISTEMA", " CLIENTE", "QUANT.", "COLABORADOR"]);
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

    const partNumberDiv = document.createElement("div");
    partNumberDiv.textContent = item.Item.part_number;
    chapaDetailsDiv.appendChild(partNumberDiv);

    const chapaDiv = document.createElement("div");
    chapaDiv.textContent = `${chapa.chapa.largura}x${chapa.chapa.comprimento}`;
    chapaDetailsDiv.appendChild(chapaDiv);

    const medidaDiv = document.createElement("div");
    medidaDiv.textContent = item.medida;
    chapaDetailsDiv.appendChild(medidaDiv);

    const opDiv = document.createElement("div");
    opDiv.textContent = item.op;
    chapaDetailsDiv.appendChild(opDiv);

    const sistemaDiv = document.createElement("div");
    sistemaDiv.textContent = item.sistema;
    chapaDetailsDiv.appendChild(sistemaDiv);

    const clienteDiv = document.createElement("div");
    clienteDiv.textContent = item.cliente;
    chapaDetailsDiv.appendChild(clienteDiv);

    const quantidadeDiv = document.createElement("div");
    quantidadeDiv.textContent = chapa.quantidade;
    chapaDetailsDiv.appendChild(quantidadeDiv);

    const colaboradorDiv = document.createElement("div");
    colaboradorDiv.textContent = item.colaborador;
    chapaDetailsDiv.appendChild(colaboradorDiv);

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


