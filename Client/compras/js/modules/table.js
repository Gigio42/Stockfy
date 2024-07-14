import { updateCardboardRepresentation } from "./cardboard.js";
import { addStagedCard } from "./staged-cards.js";

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

  // Adicionar célula vazia para o checkbox de "conjug."
  const thConjug = document.createElement("div");
  thConjug.classList.add("table-header");
  headerRow.appendChild(thConjug);

  dataTable.appendChild(headerRow);
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

  // Adicionar checkbox em cada linha
  const checkboxCell = document.createElement("div");
  checkboxCell.classList.add("table-cell");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkboxCell.appendChild(checkbox);
  row.appendChild(checkboxCell);

  row.classList.add(index % 2 === 0 ? "even-row" : "odd-row");

  // Adiciona evento de clique para selecionar a linha
  row.addEventListener("click", () => {
    // Remove a classe 'selected' de todas as linhas
    const rows = dataTable.getElementsByClassName("table-row");
    Array.from(rows).forEach((r) => r.classList.remove("selected"));
    // Adiciona classe 'selected' à linha clicada
    row.classList.add("vai_conjugar");
  });

  dataTable.appendChild(row);
}

export function populateTable(infoProdComprados) {
  const dataTable = document.getElementById("dataTable");
  if (dataTable) {
    dataTable.innerHTML = "";
    addTableHeader(dataTable);
    infoProdComprados.forEach((prod, index) =>
      addTableRow(dataTable, prod, index)
    );
  }
}
