
import { sendDataToServer } from "./connections.js";

var rowId = 0; // Variável global para manter o ID da linha
export function criarTable(table, chapaData) {
  var tbody = table.querySelector("tbody");
  var row = tbody.insertRow(-1);
  
  var idCell = row.insertCell(0);
  idCell.innerHTML = `<input type='text' value='${chapaData.id_chapa ? chapaData.id_chapa : ""}' class='editable-id'>`;
  
  var cellContents = [
    `<input type='text' value='${chapaData.fornecedor}'>`,
    `<input type='text' value='${chapaData.id_compra}'>`,
    `<input type='text' class='quantity' value='${chapaData.quantidade_recebida}'>`,
    `<input type='text' value='${chapaData.qualidade}'>`,
    `<input type='text' value='${chapaData.largura}'>`,
    `<input type='text' value='${chapaData.comprimento}'>`,
    `<select>${["E", "B", "C", "BB", "BC", ""].map((type) => `<option value="${type}" ${type === chapaData.onda ? "selected" : ""}>${type}</option>`).join("")}</select>`,
    `<select><option value="Sim" ${chapaData.vincos.toLowerCase() === "não" ? "" : "selected"}>Sim</option><option value="Não" ${chapaData.vincos.toLowerCase() === "não" ? "selected" : ""}>Não</option></select>`,
    `<select style='width: 120px;'>${["Comprado", "Recebido", "Parcialmente", "Atrasado", "Cancelado"].map((status) => `<option ${status === chapaData.status ? "selected" : ""}>${status}</option>`).join("")}</select>`,
  ];
  
  cellContents.forEach((content, index) => {
    var cell = row.insertCell(index + 1);
    cell.innerHTML = content;
  });
  
  // Adicionando as células específicas baseado no ID da tabela
  if (table.id === "bancoDados") {
    let dataPrevistaCell = row.insertCell(-1);
    let formattedDataPrevista = chapaData.data_prevista.split("/").reverse().join("-");
    dataPrevistaCell.innerHTML = `<input type='date' value='${formattedDataPrevista}'>`;
    
    let copiarCell = row.insertCell(-1);
    let copiarButton = document.createElement("button");
    copiarButton.className = "recebido";
    copiarButton.textContent = "Copiar";
    copiarButton.addEventListener("click", function () {
      copiarParaRecebimento(this);
    });
    copiarCell.appendChild(copiarButton);
  } else if (table.id === "recebimento") {
    let dataRecebimentoCell = row.insertCell(-1);
    let todayDate = new Date().toISOString().slice(0, 10); // Esta já está no formato correto
    dataRecebimentoCell.innerHTML = `<input type='date' value='${todayDate}'>`;
    
    const updateCell = row.insertCell(-1);
    let updateButton = document.createElement("button");
    updateButton.className = 'update-button';
    updateButton.textContent = 'Atualizar';    
    updateCell.appendChild(updateButton);
  }
  comparar()
}

export function clearTable() {
  clearRows(document.getElementById("tableBody"));
  clearRows(document.getElementById("tableBody2"));
}

function clearRows(tbody) {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }
}

export function copiarParaRecebimento(button) {
  const sourceRow = button.closest("tr"); // Encontra a linha do botão que foi clicado
  const targetTableBody = document.getElementById("tableBody2"); // Seleciona o tbody da tabela de destino
  const newRow = targetTableBody.insertRow(-1); // Cria uma nova linha no final do tbody de recebimento
  
  // Copia as células da linha de origem para a nova linha de destino, exceto as duas últimas
  Array.from(sourceRow.cells).forEach((cell, index) => {
    if (index < sourceRow.cells.length - 2) {
      // Ignora as duas últimas células
      let newCell = newRow.insertCell(-1);
      if (cell.querySelector("input, select")) {
        // Copia inputs ou selects
        if (cell.querySelector("input")) {
          let input = cell.querySelector("input");
          newCell.innerHTML = `<input type='${input.type}' value='${input.value}' ${input.type === "text" ? "" : "readonly"}>`;
        } else if (cell.querySelector("select")) {
          // Cria um novo select com as mesmas opções
          let select = cell.querySelector("select");
          let newSelect = document.createElement("select");
          Array.from(select.options).forEach((option) => {
            let newOption = new Option(option.text, option.value, option.selected, option.selected);
            newSelect.appendChild(newOption);
          });
          newCell.appendChild(newSelect);
        }
      } else {
        // Simplesmente copia o texto
        newCell.textContent = cell.textContent;
      }
    }
  });
  
  // Adiciona células específicas para a tabela de recebimento
  let todayDate = new Date().toISOString().slice(0, 10);
  newRow.insertCell(-1).innerHTML = `<input type='date' value='${todayDate}'>`; // Data de recebimento
  newRow.insertCell(-1).innerHTML = `<button class='update-button'>Atualizar</button>`; // Botão Atualizar
  
  comparar();
}

export function copiarTudo() {
  const bancoDadosTable = document.getElementById("bancoDados");
  const rows = Array.from(bancoDadosTable.querySelectorAll("tbody tr"));
  rows.forEach(row => {
    const copiarButton = row.querySelector(".recebido");
    if (copiarButton) {
      copiarParaRecebimento(copiarButton);
    }
  });
}

export function comparar() {
  const table1 = document.getElementById("bancoDados").querySelector("tbody");
  const table2 = document.getElementById("recebimento").querySelector("tbody");
  
  for (let i = 0; i < table2.rows.length; i++) {
    const row2 = table2.rows[i];
    let foundMatch = false;
    
    for (let j = 0; j < table1.rows.length; j++) {
      const row1 = table1.rows[j];
      let allMatch = true;
      
      for (let k = 4; k <= 8; k++) {
        const cell1 = row1.cells[k].querySelector("input, select")
        ? row1.cells[k].querySelector("input, select").value.trim().toLowerCase()
        : row1.cells[k].textContent.trim().toLowerCase();
        const cell2 = row2.cells[k].querySelector("input, select")
        ? row2.cells[k].querySelector("input, select").value.trim().toLowerCase()
        : row2.cells[k].textContent.trim().toLowerCase();
        
        if (cell1 !== cell2) {
          allMatch = false;
          break;
        }
      }
      
      if (allMatch) {
        console.log(`Correspondência completa encontrada na linha ${i + 1}`);
        foundMatch = true;
        row2.cells[0].querySelector("input").value = row1.cells[0].querySelector("input").value;
        validar_status(row1, row2);
        break;
      }
    }
    
    if (!foundMatch) {
      console.log(`Nenhuma correspondência completa encontrada para a linha ${i + 1}`);
    }
  }
}

function validar_status(rowBancoDados, rowRecebimento) {
  console.log("Validando status...");
  
  const quantidadeBancoDados = parseInt(rowBancoDados.cells[3].querySelector("input").value, 10);
  const quantidadeRecebimento = parseInt(rowRecebimento.cells[3].querySelector("input").value, 10);
  
  if (quantidadeRecebimento >= quantidadeBancoDados) {
    rowRecebimento.cells[9].querySelector("select").value = "Recebido";
    console.log("Status mudado para Recebido");
  } else if (quantidadeRecebimento < quantidadeBancoDados) {
    rowRecebimento.cells[9].querySelector("select").value = "Parcialmente";
    console.log("Status mudado para Parcialmente");
  }
}

export function addLine() {
  const table = document.getElementById("recebimento");
  const tbody = table.querySelector("tbody");
  const row = tbody.insertRow(-1);
  const fields = ["ID", "Fornecedor", "Id_compra", "Quantidade", "Qualidade", "Largura", "Comprimento", "Onda", "Vincos", "Status", "Data_recebimento"];
  
  fields.forEach((field, index) => {
    const cell = row.insertCell(index);
    if (field === "Status" || field === "Onda" || field == "Vincos") {
      // Adicionar dropdowns para campos específicos
      let selectHTML = `<select>`;
      if (field === "Status") {
        selectHTML += `<option>Comprado</option><option>Recebido</option><option>Parcialmente</option>`;
      } else if (field == "Onda") {
        selectHTML += `<option>E</option><option>B</option><option>C</option><option>BB</option><option>BC</option>`;
      } else {
        selectHTML += `<option>Sim</option><option>Não</option>`;
      }
      selectHTML += `</select>`;
      cell.innerHTML = selectHTML;
    } else if (field == "Data_recebimento") {
      cell.innerHTML = `<input type='date'>`;
    } else {
      cell.innerHTML = `<input type='text'>`; // Campos editáveis
    }
  });
  
  // Adicionar botão de atualizar
  const updateCell = row.insertCell(-1);
  updateCell.innerHTML = `<button class='update-button'>Atualizar</button>`;
}

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        // Verifica se o nó é do tipo Element
        // Aplica readonly aos inputs de texto e de data
        if (node.matches('#bancoDados input[type="text"], #bancoDados input[type="date"]')) {
          node.setAttribute("readonly", "true");
        }
        // Aplica disabled aos selects
        if (node.matches("#bancoDados select")) {
          node.setAttribute("disabled", "true");
        }
        // Verifica e modifica elementos filhos dentro de nó adicionado
        node.querySelectorAll('#bancoDados input[type="text"], #bancoDados input[type="date"], #bancoDados select').forEach((child) => {
          if (child.tagName === "INPUT" && (child.type === "text" || child.type === "date")) {
            child.setAttribute("readonly", "true");
          }
          if (child.tagName === "SELECT") {
            child.setAttribute("disabled", "true");
          }
        });
      }
    });
  });
});

// Configura o observer para observar mudanças na árvore do DOM
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
