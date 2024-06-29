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
  valueRow.className = "value-row flex-grow-1";

  keys.forEach((key) => {
    const valueItem = document.createElement("div");
    valueItem.className = "value-item";
    valueItem.textContent = item[key];
    valueRow.appendChild(valueItem);
  });

  return valueRow;
}

function createFormRow(item) {
  const formRow = document.createElement("div");
  formRow.className = "form-row d-flex align-items-center justify-content-end";

  const quantidadeInput = document.createElement("input");
  quantidadeInput.type = "number";
  quantidadeInput.className = "form-control quantidade";
  quantidadeInput.value = item.quantidade || 1;

  formRow.appendChild(quantidadeInput);

  return formRow;
}

function createButtonFormContainer(selectedChapas, selectedSubcards) {
  const buttonFormContainer = document.createElement("div");
  buttonFormContainer.className = "button-form-container d-flex justify-content-end mt-3";

  const form = document.createElement("form");

  const submitButton = document.createElement("button");
  submitButton.className = "btn btn-primary";
  submitButton.type = "submit";
  submitButton.textContent = "Reservar";

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    handleFormSubmit(selectedChapas, selectedSubcards);
  });

  form.appendChild(submitButton);
  buttonFormContainer.appendChild(form);

  return buttonFormContainer;
}

async function handleFormSubmit(selectedChapas, selectedSubcards) {
  const reservasChapas = selectedChapas.map((chapa) => ({
    id_chapa: chapa.id_chapa,
    quantidade: parseInt(chapa.quantidade),
  }));

  const reservasConjugacoes = selectedSubcards.map((conjugacao) => ({
    id_conjugacoes: conjugacao.id_conjugacoes,
    quantidade: parseInt(conjugacao.quantidade),
  }));

  try {
    await reserveChapas([...reservasChapas, ...reservasConjugacoes]);
    Swal.fire({
      icon: "success",
      title: "Reserva realizada com sucesso!",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro ao realizar a reserva.",
      text: error.message,
    });
  }
}

function setupEventListeners(popupContainer) {
  window.addEventListener("click", (event) => {
    if (event.target === popupContainer) {
      popupContainer.style.display = "none";
    }
  });
}
