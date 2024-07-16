import { jsonData } from "./extractToJson.js"; // Importe jsonData do arquivo extractToJson.js

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

  // Adicionar checkbox em cada linha
  const checkboxCell = document.createElement("div");
  checkboxCell.classList.add("table-cell");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkboxCell.appendChild(checkbox);
  row.appendChild(checkboxCell);

  row.classList.add(index % 2 === 0 ? "even-row" : "odd-row");

  // Adiciona evento de clique para selecionar a linha
  checkbox.addEventListener("change", (event) => {
    if (event.target.checked) {
      // Marcar o status como "A_CONJUGAR"
      prod.status = "A_CONJUGAR";
    } else {
      // Voltar o status para "COMPRADO"
      prod.status = "COMPRADO";
    }
    
    // Verificar se jsonData existe antes de atualizar
    if (window.jsonData && jsonData.infoProdComprados) {
      // Atualizar jsonData.infoProdComprados com a nova informação
      jsonData.infoProdComprados = jsonData.infoProdComprados.map((p, i) =>
        i === index ? { ...p, status: prod.status } : p
      );

      console.log("JSON atualizado com o status:");
      console.log(jsonData);

      // Atualizar tabela
      populateTable(jsonData.infoProdComprados);
    } else {
      console.error("jsonData.infoProdComprados não está definido ou vazio.");
    }
  });

  dataTable.appendChild(row);
}