import { reserveChapas } from "../utils/connection.js";

export function handleShowSelectedButtonClick(getSelectedSubcards) {
  const showSelectedButton = document.getElementById("showSelectedButton");
  const modalContent = document.getElementById("modalContent");
  const closeModal = document.getElementById("closeModal");
  const popupContainer = document.getElementById("popupContainer");

  removeExistingListener(showSelectedButton);
  showSelectedButton.onclick = createModalHandler(modalContent, closeModal, getSelectedSubcards, popupContainer);
  closeModal.onclick = () => {
    popupContainer.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target == popupContainer) {
      popupContainer.style.display = "none";
    }
  };
}

function removeExistingListener(element) {
  if (element.onclick) {
    element.removeEventListener("click", element.onclick);
  }
}

function createModalHandler(modalContent, closeModal, getSelectedSubcards, popupContainer) {
  return () => {
    modalContent.innerHTML = "";
    modalContent.appendChild(closeModal);

    const contentWrapper = document.createElement("div");
    contentWrapper.style.maxHeight = "50vh";
    contentWrapper.style.overflowY = "auto";

    const keys = ["id_chapa", "largura", "fornecedor", "qualidade", "quantidade_disponivel"];

    const selectedSubcards = getSelectedSubcards();
    selectedSubcards.forEach((chapa) => {
      contentWrapper.appendChild(createCard(chapa, keys));
    });

    contentWrapper.appendChild(createButtonFormContainer(selectedSubcards));

    modalContent.appendChild(contentWrapper);
    popupContainer.style.display = "block";
  };
}

function createCard(chapa, keys) {
  const card = document.createElement("div");
  card.className = "card mb-3 shadow-sm";
  const cardBody = document.createElement("div");
  cardBody.className = "body-div card-body rounded d-flex align-items-center";

  const valueRow = document.createElement("div");
  valueRow.className = "value-row row flex-nowrap overflow-auto w-100 align-items-stretch";
  keys.forEach((key) => {
    const valueDiv = document.createElement("div");
    valueDiv.className = "card-value-div col text-center value align-items-center justify-content-center rounded";
    if (key === "largura") {
      let largura = chapa.largura;
      let comprimento = chapa.comprimento;
      valueDiv.textContent = `${largura} x ${comprimento}`;
    } else {
      valueDiv.textContent = chapa[key];
    }
    valueRow.appendChild(valueDiv);
  });
  cardBody.appendChild(valueRow);
  cardBody.appendChild(createFormRow(chapa));

  card.appendChild(cardBody);
  return card;
}

function createFormRow(chapa) {
  const formRow = document.createElement("div");
  formRow.className = "form-row row flex-nowrap overflow-auto w-100 align-items-stretch";

  const quantityInput = createInputCell("number", "Quantidade", `quantityInput-${chapa.id_chapa}`);

  const medidaInput = createInputCell("text", "medida", `medidaInput-${chapa.id_chapa}`);
  medidaInput.style.display = "none";

  const recycleTd = document.createElement("div");
  recycleTd.className = "form-cell col-1 text-center value align-items-center justify-content-center rounded";
  recycleTd.style.display = "flex";
  recycleTd.style.justifyContent = "center";
  recycleTd.style.alignItems = "center";

  const recycleCheckbox = document.createElement("input");
  recycleCheckbox.type = "checkbox";
  recycleCheckbox.id = `recycleCheckbox-${chapa.id_chapa}`;
  recycleCheckbox.style.width = "25px";
  recycleCheckbox.style.height = "25px";
  recycleCheckbox.onchange = () => {
    medidaInput.style.display = recycleCheckbox.checked ? "" : "none";
  };
  recycleTd.appendChild(recycleCheckbox);

  formRow.appendChild(quantityInput);
  formRow.appendChild(medidaInput);
  formRow.appendChild(recycleTd);

  return formRow;
}

function createInputCell(type, placeholder, id) {
  const cell = document.createElement("div");
  cell.className = "form-cell col text-center value align-items-center justify-content-center rounded";
  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  input.id = id;
  input.min = 0;
  input.oninput = function () {
    if (this.value < 0) {
      this.value = 0;
    }
  };
  cell.appendChild(input);
  return cell;
}

function createButtonFormContainer(selectedSubcards) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "space-between";

  container.appendChild(createPartNumberForm());
  container.appendChild(createReserveButton(selectedSubcards));

  return container;
}

function createPartNumberForm() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.type = "text";
  input.id = "partNumberInput";
  input.placeholder = "PART NUMBER";
  form.appendChild(input);

  $(input).mask("9999.9999");

  return form;
}

function createReserveButton(selectedSubcards) {
  const reserveButton = document.createElement("button");
  reserveButton.textContent = "RESERVAR";
  reserveButton.classList.add("agrupar-button");
  reserveButton.onclick = async () => {
    const partNumber = document.getElementById("partNumberInput").value;

    const chapas = selectedSubcards.map((subcard) => ({
      chapaID: subcard.id_chapa,
      quantity: document.getElementById(`quantityInput-${subcard.id_chapa}`).value,
      medida: document.getElementById(`medidaInput-${subcard.id_chapa}`).value,
      keepRemaining: document.getElementById(`recycleCheckbox-${subcard.id_chapa}`).checked,
    }));

    try {
      const response = await reserveChapas({ partNumber, chapas });
      console.log(response);
    } catch (error) {
      alert(error.message);
    }
  };
  return reserveButton;
}
