export function handleShowSelectedButtonClick(getSelectedSubcards) {
  const showSelectedButton = document.getElementById("showSelectedButton");
  const modalContent = document.getElementById("modalContent");
  const closeModal = document.getElementById("closeModal");
  const popupContainer = document.getElementById("popupContainer");

  removeExistingListener(showSelectedButton);
  showSelectedButton.onclick = createModalContent(modalContent, closeModal, getSelectedSubcards, popupContainer);
  closeModal.onclick = closePopup(popupContainer);
}

function removeExistingListener(element) {
  if (element.onclick) {
    element.removeEventListener("click", element.onclick);
  }
}

function createModalContent(modalContent, closeModal, getSelectedSubcards, popupContainer) {
  return () => {
    modalContent.innerHTML = "";
    modalContent.appendChild(closeModal);

    const contentWrapper = document.createElement("div");
    contentWrapper.style.maxHeight = "50vh";
    contentWrapper.style.overflowY = "auto";

    const selectedSubcards = getSelectedSubcards();
    const table = createTable(selectedSubcards);
    contentWrapper.appendChild(table);

    const buttonFormContainer = createButtonFormContainer(selectedSubcards);
    contentWrapper.appendChild(buttonFormContainer);

    modalContent.appendChild(contentWrapper);

    popupContainer.style.display = "block";
  };
}

function createTable(selectedSubcards) {
  const table = document.createElement("table");
  table.className = "table";

  const headers = ["Chapa ID", "Fornecedor", "Medida", "Qualidade", "Comprado", "Estoque", "Quantidade", "Reciclar"];
  table.appendChild(createTableHeader(headers));
  table.appendChild(createTableBody(selectedSubcards));

  return table;
}

function createTableHeader(headers) {
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  return thead;
}

function createTableBody(selectedSubcards) {
  const tbody = document.createElement("tbody");

  selectedSubcards.forEach((chapa) => {
    const row = document.createElement("tr");
    ["id_chapa", "fornecedor", "medida", "qualidade", "quantidade_comprada", "quantidade_estoque"].forEach((key) => {
      const td = document.createElement("td");
      td.textContent = chapa[key];
      row.appendChild(td);
    });

    row.appendChild(createTableCellWithInput("number", "Quantidade", `quantityInput-${chapa.id_chapa}`));

    const medidaTd = createTableCellWithInput("text", "medida", `medidaInput-${chapa.id_chapa}`);
    medidaTd.style.display = "none";
    row.appendChild(medidaTd);

    const recycleTd = document.createElement("td");
    const recycleCheckbox = document.createElement("input");
    recycleCheckbox.type = "checkbox";
    recycleCheckbox.id = `recycleCheckbox-${chapa.id_chapa}`;
    recycleCheckbox.style.width = "25px";
    recycleCheckbox.style.height = "25px";
    recycleCheckbox.onchange = () => {
      medidaTd.style.display = recycleCheckbox.checked ? "" : "none";
    };
    recycleTd.appendChild(recycleCheckbox);
    row.appendChild(recycleTd);

    tbody.appendChild(row);
  });

  return tbody;
}

function createTableCellWithInput(type, placeholder, id) {
  const td = document.createElement("td");
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
  td.appendChild(input);
  return td;
}

function createButtonFormContainer(selectedSubcards) {
  const buttonFormContainer = document.createElement("div");
  buttonFormContainer.style.display = "flex";
  buttonFormContainer.style.justifyContent = "space-between";

  buttonFormContainer.appendChild(createPartNumberForm());
  buttonFormContainer.appendChild(createReserveButton(selectedSubcards));

  return buttonFormContainer;
}

function createPartNumberForm() {
  const form = document.createElement("form");
  const input = document.createElement("input");
  input.type = "text";
  input.id = "partNumberInput";
  input.placeholder = "PART NUMBER";
  form.appendChild(input);
  return form;
}

function createReserveButton(selectedSubcards) {
  const reserveButton = document.createElement("button");
  reserveButton.textContent = "RESERVAR";
  reserveButton.classList.add("agrupar-button");
  reserveButton.onclick = () => {
    const partNumberInput = document.querySelector("#partNumberInput");
    const partNumber = partNumberInput.value;

    const chapas = selectedSubcards.map((subcard) => {
      const chapaID = subcard.id_chapa;
      const quantityInput = document.querySelector(`#quantityInput-${chapaID}`);
      const quantity = quantityInput.value;
      const medidaInput = document.querySelector(`#medidaInput-${chapaID}`);
      const medida = medidaInput.value;
      const recycleCheckbox = document.querySelector(`#recycleCheckbox-${chapaID}`);
      const keepRemaining = recycleCheckbox.checked;

      return {
        chapaID,
        quantity,
        medida,
        keepRemaining,
      };
    });

    const data = {
      partNumber,
      chapas,
    };

    axios
      .post("http://localhost:3000/PCP", data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
          alert(`Error: ${error.response.data.error}`);
        } else if (error.request) {
          console.log(error.request);
          alert("Error: No response from server");
        } else {
          console.log("Error", error.message);
          alert(`Error: ${error.message}`);
        }
      });
  };

  return reserveButton;
}

function closePopup(popupContainer) {
  return () => {
    popupContainer.style.display = "none";
  };
}
