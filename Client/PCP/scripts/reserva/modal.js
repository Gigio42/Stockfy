import { reserveChapas } from "../utils/connection.js";

export function reservarModal(getSelectedChapasAndConjugacoes) {
  const showSelectedButton = document.getElementById("showSelectedButton");
  const modalContent = document.getElementById("modalContent");
  const closeModal = document.getElementById("closeModal");
  const popupContainer = document.getElementById("popupContainer");

  removeExistingListener(showSelectedButton);
  showSelectedButton.onclick = () => {
    const [selectedChapas, selectedSubcards] = getSelectedChapasAndConjugacoes();
    if (selectedChapas.length > 0 || selectedSubcards.length > 0) {
      const modalHandler = createModalHandler(modalContent, closeModal, () => [selectedChapas, selectedSubcards], popupContainer);
      modalHandler();
    } else {
      Swal.fire({
        icon: "error",
        title: "Nenhuma chapa ou conjugação selecionada.",
        text: "Precisa selecionar pelo menos 1 chapa ou conjugação!",
      });
    }
  };
  closeModal.onclick = () => {
    popupContainer.style.display = "none";
  };

  setupEventListeners(popupContainer);
}

function removeExistingListener(element) {
  if (element.onclick) {
    element.removeEventListener("click", element.onclick);
  }
}

function createModalHandler(modalContent, closeModal, getSelectedChapasAndConjugacoes, popupContainer) {
  return () => {
    const newContent = document.createElement("div");
    const contentWrapper = document.createElement("div");
    contentWrapper.style.maxHeight = "70vh";
    contentWrapper.style.overflowY = "auto";

    const keysChapas = ["id_chapa", "largura", "fornecedor", "qualidade", "quantidade_disponivel"];
    const keysConjugacoes = ["id_conjugacoes", "medida", "quantidade", "usado"];
    const [selectedChapas, selectedSubcards] = getSelectedChapasAndConjugacoes();

    selectedChapas.forEach((chapa) => {
      contentWrapper.appendChild(createCard(chapa, keysChapas));
    });

    selectedSubcards.forEach((conjugacao) => {
      contentWrapper.appendChild(createSubcard(conjugacao, keysConjugacoes));
    });

    contentWrapper.appendChild(createButtonFormContainer(selectedChapas, selectedSubcards));
    newContent.appendChild(contentWrapper);

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

function createCard(chapa, keys) {
  const card = document.createElement("div");
  card.className = "card mb-3 shadow-sm";

  const cardBody = document.createElement("div");
  cardBody.className = "body-div card-body rounded d-flex align-items-center";

  const valueRow = createValueRow(chapa, keys);
  cardBody.appendChild(valueRow);

  const formRow = createFormRow(chapa);
  cardBody.appendChild(formRow);

  card.appendChild(cardBody);
  return card;
}

function createSubcard(conjugacao, keys) {
  const subcard = document.createElement("div");
  subcard.className = "subcard mb-3 shadow-sm";

  const subcardBody = document.createElement("div");
  subcardBody.className = "body-div subcard-body rounded d-flex align-items-center";

  const valueRow = createValueRow(conjugacao, keys);
  subcardBody.appendChild(valueRow);

  const formRow = createFormRow(conjugacao);
  subcardBody.appendChild(formRow);

  subcard.appendChild(subcardBody);
  return subcard;
}

function createValueRow(item, keys) {
  const valueRow = document.createElement("div");
  valueRow.className = "value-row row overflow-auto w-100 align-items-stretch";

  keys.forEach((key) => {
    const valueDiv = document.createElement("div");
    valueDiv.className = "card-value-div col text-center value align-items-center justify-content-center rounded";
    valueDiv.style.display = "flex";
    valueDiv.style.whiteSpace = "nowrap";
    valueDiv.textContent = key === "largura" ? `${item.largura} x ${item.comprimento}` : item[key];
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

  container.appendChild(createPartNumberForm());
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

function createReserveButton(selectedChapas, selectedSubcards) {
  const reserveButton = document.createElement("button");
  reserveButton.textContent = "RESERVAR";
  reserveButton.classList.add("agrupar-button");
  reserveButton.onclick = async () => {
    const partNumber = document.getElementById("partNumberInput").value;

    const chapas = selectedChapas.map((chapa) => ({
      chapaID: chapa.id_chapa,
      quantity: document.getElementById(`quantityInput-${chapa.id_chapa}`).value,
      keepRemaining: false,
    }));

    const conjugacoes = selectedSubcards.map((conjugacao) => ({
      id_conjugacoes: conjugacao.id_conjugacoes,
      quantidade: document.getElementById(`quantityInput-${conjugacao.id_conjugacoes}`).value,
    }));

    await handleReserveChapas(partNumber, chapas, conjugacoes);
  };
  return reserveButton;
}

async function handleReserveChapas(partNumber, chapas, conjugacoes) {
  const loadingSpinner = document.getElementById("loadingSpinner");
  loadingSpinner.style.display = "block";

  try {
    const reservedBy = localStorage.getItem("nome");
    const response = await reserveChapas({ partNumber, chapas, conjugacoes, reservedBy });
    localStorage.setItem("showSwal", "true");
    localStorage.setItem("partNumber", partNumber);
    location.reload();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
  } finally {
    loadingSpinner.style.display = "none";
  }
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
}

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
