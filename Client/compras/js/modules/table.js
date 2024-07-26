export function addTableHeader(dataTable) {
  const headers = [
    "Quant. Comprada",
    "Qualidade",
    "Onda",
    "Largura",
    "Comprimento",
    "Vincos",
  ];
  const headerRow = document.createElement("div");
  headerRow.classList.add("header-row");

  headers.forEach((header) => {
    const th = document.createElement("div");
    th.textContent = header;
    th.classList.add("table-header");
    headerRow.appendChild(th);
  });

  // Adicionar célula para o checkbox de "conjug."
  const thConjug = document.createElement("div");
  thConjug.textContent = "Conjugado"; // Texto para a célula do cabeçalho
  thConjug.classList.add("table-header");
  headerRow.appendChild(thConjug);

  dataTable.appendChild(headerRow);
}

export function populateTable(infoProdComprados) {
  const dataTable = document.getElementById("dataTable");
  if (dataTable) {
    dataTable.innerHTML = "";
    addTableHeader(dataTable);

    if (infoProdComprados && infoProdComprados.length > 0) {
      infoProdComprados.forEach((prod, index) =>
        addTableRow(dataTable, prod, index)
      );
    } else {
      console.log("Nenhum produto comprado encontrado para exibir na tabela.");
    }
  }
}

export function addTableRow(dataTable, prod, index) {
  const row = document.createElement("div");
  row.classList.add("table-row");
  row.setAttribute("data-id", index);

  const infoToShow = [
    "quantidade_comprada",
    "qualidade",
    "onda",
    "largura",
    "comprimento",
    "vincos",
  ];

  infoToShow.forEach((info) => {
    const cell = document.createElement("div");
    cell.textContent = prod[info];
    cell.classList.add("table-cell");
    row.appendChild(cell);
  });

  const checkboxCell = document.createElement("div");
  checkboxCell.classList.add("table-cell");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = prod.conjugado === true; // Marcar checkbox se "conjugado" for true
  checkbox.addEventListener("change", (event) => {
    handleCheckboxChange(event, prod, index);
  });
  checkboxCell.appendChild(checkbox);
  row.appendChild(checkboxCell);

  row.classList.add(index % 2 === 0 ? "even-row" : "odd-row");

  dataTable.appendChild(row);
}

function handleCheckboxChange(event, prod, index) {
  const isChecked = event.target.checked;
  prod.conjugado = isChecked;

  // Enviar atualização para o backend ou atualizar estado local
  console.log(`Linha ${index} atualizada:`, prod);


}
