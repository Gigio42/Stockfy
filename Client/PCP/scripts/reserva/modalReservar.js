import { reserveChapas } from "../utils/connection.js";

export function modalReservar(getSelectedChapasAndConjugacoes) {
  const showSelectedButton = document.getElementById("showSelectedButton");
  const closeModal = document.getElementById("closeModal");
  const popupContainer = document.getElementById("popupContainer");

  setupShowSelectedButton(showSelectedButton, getSelectedChapasAndConjugacoes);
  setupCloseModalButton(closeModal, popupContainer);
  setupEventListeners(popupContainer);
}

function setupShowSelectedButton(button, getSelectedChapasAndConjugacoes) {
  removeExistingListener(button);
  button.onclick = () => {
    const [selectedChapas, selectedSubcards] = getSelectedChapasAndConjugacoes();
    if (selectedChapas.length > 0 || selectedSubcards.length > 0) {
      showModal(selectedChapas, selectedSubcards);
    } else {
      showNoSelectionAlert();
    }
  };
}

function setupCloseModalButton(button, popupContainer) {
  button.onclick = () => {
    popupContainer.style.display = "none";
  };
}

function showModal(selectedChapas, selectedSubcards) {
  const modalContent = document.getElementById("modalContent");
  const popupContainer = document.getElementById("popupContainer");
  const closeModal = document.getElementById("closeModal");

  const modalHandler = createModalHandler(modalContent, closeModal, () => [selectedChapas, selectedSubcards], popupContainer);
  modalHandler();
}

function removeExistingListener(element) {
  if (element.onclick) {
    element.removeEventListener("click", element.onclick);
  }
}

function createModalHandler(modalContent, closeModal, getSelectedChapasAndConjugacoes, popupContainer) {
  return () => {
    const [selectedChapas, selectedSubcards] = getSelectedChapasAndConjugacoes();
    const newContent = buildModalContent(selectedChapas, selectedSubcards);

    clearModalContent(modalContent, closeModal);
    modalContent.appendChild(newContent);
    popupContainer.style.display = "block";
  };
}

function clearModalContent(modalContent, closeModal) {
  Array.from(modalContent.childNodes).forEach((child) => {
    if (child !== closeModal) {
      modalContent.removeChild(child);
    }
  });
}

function buildModalContent(selectedChapas, selectedSubcards) {
  const contentWrapper = document.createElement("div");
  contentWrapper.style.maxHeight = "70vh";
  contentWrapper.style.overflowY = "auto";

  const keysChapas = ["id_chapa", "largura", "fornecedor", "qualidade", "quantidade_disponivel"];
  const keysConjugacoes = ["id_conjugacoes", "medida", "rendimento", "quantidade"];

  selectedChapas.forEach((chapa) => contentWrapper.appendChild(createCard(chapa, keysChapas)));
  selectedSubcards.forEach((conjugacao) => contentWrapper.appendChild(createSubcard(conjugacao, keysConjugacoes)));

  contentWrapper.appendChild(createButtonFormContainer(selectedChapas, selectedSubcards));
  return contentWrapper;
}

function createCard(item, keys) {
  return createItemCard(item, keys, "card");
}

function createSubcard(item, keys) {
  return createItemCard(item, keys, "subcard");
}

function createItemCard(item, keys, type) {
  const card = document.createElement("div");
  card.className = `${type} mb-3 shadow-sm`;

  const cardBody = document.createElement("div");
  cardBody.className = `body-div ${type}-body rounded d-flex align-items-center`;

  const valueRow = createValueRow(item, keys);
  const formRow = createFormRow(item);

  cardBody.appendChild(valueRow);
  cardBody.appendChild(formRow);
  card.appendChild(cardBody);

  return card;
}

function createValueRow(item, keys) {
  const valueRow = document.createElement("div");
  valueRow.className = "value-row row overflow-auto w-100 align-items-stretch";

  keys.forEach((key) => {
    const valueDiv = document.createElement("div");
    valueDiv.className = "card-value-div col text-center value align-items-center justify-content-center rounded";
    valueDiv.style.display = "flex";
    valueDiv.style.whiteSpace = "nowrap";
    valueDiv.textContent = key === "largura" ? `${item.largura} x ${item.comprimento}` : key === "rendimento" ? `${item[key]} x` : item[key];
    valueRow.appendChild(valueDiv);
  });
  return valueRow;
}

function createFormRow(item) {
  const formRow = document.createElement("div");
  formRow.className = "form-row row flex-nowrap overflow-auto w-100 align-items-stretch";

  const quantityInput = createInputCell("number", "Quantidade", `quantityInput-${item.id_chapa || item.id_conjugacoes}`, "formQuantidade");
  formRow.appendChild(quantityInput);

  return formRow;
}

function createInputCell(type, placeholder, id, additionalClass = "", styles = {}) {
  const cell = document.createElement("div");
  cell.className = "form-cell col text-center value align-items-center justify-content-center rounded";

  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  input.id = id;
  input.min = 0;
  input.style.width = "100%";
  Object.assign(input.style, styles);

  input.oninput = function () {
    if (this.value < 0) {
      this.value = 0;
    }
  };

  if (additionalClass) {
    input.classList.add(additionalClass);
  }

  cell.appendChild(input);
  return cell;
}

function createButtonFormContainer(selectedChapas, selectedSubcards) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.justifyContent = "space-between";

  const formContainer = document.createElement("div");
  formContainer.style.display = "flex";
  formContainer.style.flexGrow = "1";

  formContainer.appendChild(createPartNumberForm());
  formContainer.appendChild(createPedidoVendaForm());

  container.appendChild(formContainer);
  container.appendChild(createReserveButton(selectedChapas, selectedSubcards));

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

function createPedidoVendaForm() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.type = "text";
  input.id = "pedidoVendaInput";
  input.placeholder = "PEDIDO DE VENDA";

  input.addEventListener("input", function () {
    this.value = this.value.replace(/[^0-9]/g, "");
  });

  form.appendChild(input);

  return form;
}

function createReserveButton(selectedChapas, selectedSubcards) {
  const reserveButton = document.createElement("button");
  reserveButton.textContent = "RESERVAR";
  reserveButton.classList.add("agrupar-button");
  reserveButton.onclick = () => handleReserveButtonClick(selectedChapas, selectedSubcards);
  return reserveButton;
}

async function handleReserveButtonClick(selectedChapas, selectedSubcards) {
  const partNumber = document.getElementById("partNumberInput").value;
  const pedidoVenda = document.getElementById("pedidoVendaInput").value;
  const chapas = mapSelectedItems(selectedChapas, "chapa");
  const conjugacoes = mapSelectedItems(selectedSubcards, "conjugacoes");

  await reserveChapasAndShowFeedback(partNumber, pedidoVenda, chapas, conjugacoes);
}

function mapSelectedItems(items, type) {
  return items.map((item) => ({
    [`${type}ID`]: item[`id_${type}`],
    quantity: document.getElementById(`quantityInput-${item[`id_${type}`]}`).value,
    keepRemaining: false,
  }));
}

async function reserveChapasAndShowFeedback(partNumber, pedidoVenda, chapas, conjugacoes) {
  const loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.style.display = "block";

  try {
    const reservedBy = localStorage.getItem("nome");
    await reserveChapas({ partNumber, pedidoVenda, chapas, conjugacoes, reservedBy });
    showSuccessToast(partNumber);
    location.reload();
  } catch (error) {
    showErrorAlert(error.message);
  } finally {
    loadingSpinner.style.display = "none";
  }
}

function showSuccessToast(partNumber) {
  localStorage.setItem("showSwal", "true");
  localStorage.setItem("partNumber", partNumber);
}

function showErrorAlert(message) {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: message,
  });
}

function showNoSelectionAlert() {
  Swal.fire({
    icon: "error",
    title: "Nenhuma chapa ou conjugação selecionada.",
    text: "Precisa selecionar pelo menos 1 chapa ou conjugação!",
  });
}

function setupEventListeners(popupContainer) {
  window.addEventListener("click", (event) => {
    if (event.target === popupContainer) {
      popupContainer.style.display = "none";
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      popupContainer.style.display = "none";
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const showSwal = localStorage.getItem("showSwal");
    const partNumber = localStorage.getItem("partNumber");

    if (showSwal === "true") {
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      }).fire({
        icon: "success",
        title: `Item ${partNumber} reservado.`,
      });

      localStorage.removeItem("showSwal");
      localStorage.removeItem("partNumber");
    }
  });
}
