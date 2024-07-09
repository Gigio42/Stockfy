import { updateCardboardRepresentation } from "./cardboard.js";
import { addStagedCard } from "./staged-cards.js";
export function addTableHeader(dataTable) {
  const headers = ["Quant. Comprada", "Qualidade", "Onda", "Largura", "Comprimento", "Vincos"];
  const headerRow = dataTable.insertRow();
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    th.classList.add("table-header");
    headerRow.appendChild(th);
  });
}

export function addTableRow(dataTable, prod, index) {
  const row = dataTable.insertRow();
  row.setAttribute("data-id", index);
  const infoToShow = ["quantidade_comprada", "qualidade", "onda", "largura", "comprimento", "vincos"];

  infoToShow.forEach((info) => {
    const cell = row.insertCell();
    cell.textContent = prod[info];
  });

  row.classList.add(index % 2 === 0 ? "even-row" : "odd-row");

  // Adiciona evento de clique para selecionar a linha
  row.addEventListener("click", () => {
    // Remove a classe 'selected' de todas as linhas
    const rows = dataTable.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      rows[i].classList.remove("selected");
    }
    // Adiciona a classe 'selected' à linha clicada
    row.classList.add("selected");

    // Atualiza o conteúdo do <pre> com o JSON da linha clicada
    const modalContent = document.getElementById("modal-content-conjugação");
    const preElement = modalContent.querySelector("pre");
    preElement.textContent = JSON.stringify(prod, null, 2);

    // Atualiza a representação da chapa de papelão
    updateCardboardRepresentation(prod);

    // Guarda as medidas do cartão na linha selecionada
    const selectedCardboard = {
      largura: prod.largura,
      comprimento: prod.comprimento,
    };
    console.log(`Medidas do cartão selecionado: largura ${selectedCardboard.largura}, comprimento ${selectedCardboard.comprimento}`);

    document.getElementById("AddConjugStaged").addEventListener("click", () => {
      addStagedCard(selectedCardboard);
    });
  });
}



export function populateTable(infoProdComprados) {
  const dataTable = document.getElementById("dataTable");
  if (dataTable) {
    dataTable.innerHTML = "";
    addTableHeader(dataTable);
    infoProdComprados.forEach((prod, index) => addTableRow(dataTable, prod, index));
  }
}
