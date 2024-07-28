export function criarTable(table, chapaData) {
  var tbody = table.querySelector("tbody");
  var row = tbody.insertRow(-1);

  // Definindo data-id corretamente na linha
  const dataId = chapaData.id_chapa || "";
  row.setAttribute("data-id", dataId); 

  var cellContents = [
      `<input type='text' value='${dataId}' class='editable-id' style='color: var(--text-color);' ${table.id === "recebimento" ? "readonly" : ""}>`,
      `<input type='text' value='${chapaData.fornecedor || ""}' style='color: var(--text-color);'>`,
      `<input type='text' value='${chapaData.id_compra || ""}' style='color: var(--text-color);'>`,
      `<input type='text' class='quantity' value='${chapaData.quantidade_recebida || ""}' style='color: var(--text-color);'>`,
      `<input type='text' value='${chapaData.qualidade || ""}' style='color: var(--text-color);'>`,
      `<input type='text' value='${chapaData.largura || ""}' style='color: var(--text-color);'>`,
      `<input type='text' value='${chapaData.comprimento || ""}' style='color: var(--text-color);'>`,
      `<select style='color: var(--text-color);'>
          ${["E", "B", "C", "BB", "BC", ""].map((type) => `<option value="${type}" ${type === chapaData.onda ? "selected" : ""}>${type}</option>`).join("")}
      </select>`,
      `<select style='color: var(--text-color);'>
          <option value="Sim" ${chapaData.vincos && chapaData.vincos.toLowerCase() === "não" ? "" : "selected"}>Sim</option>
          <option value="Não" ${chapaData.vincos && chapaData.vincos.toLowerCase() === "não" ? "selected" : ""}>Não</option>
      </select>`,
      `<select style='color: var(--text-color);'>
          ${["COMPRADO", "RECEBIDO", "PARCIALMENTE", "ATRASADO", "CANCELADO"].map((status) => `<option ${status === chapaData.status ? "selected" : ""}>${status}</option>`).join("")}
      </select>`
  ];

  cellContents.forEach((content, index) => {
      var cell = row.insertCell(index);
      cell.innerHTML = content;
  });

  if (table.id === "bancoDados") {
      let dataPrevistaCell = row.insertCell(-1);
      let formattedDataPrevista = (chapaData.data_prevista || "").split("/").reverse().join("-");
      dataPrevistaCell.innerHTML = `<input type='date' value='${formattedDataPrevista}' style='color: var(--text-color);'>`;

      let copiarCell = row.insertCell(-1);
      let copiarButton = document.createElement("img");
      copiarButton.src = "icons8-copy-48 (2).png";
      copiarButton.className = "copiar";
      copiarButton.addEventListener("click", function () {
          copiarParaRecebimento(this);
      });
      copiarCell.appendChild(copiarButton);
  } else if (table.id === "recebimento") {
      let dataRecebimentoCell = row.insertCell(-1);
      let todayDate = new Date().toISOString().slice(0, 10);
      dataRecebimentoCell.innerHTML = `<input type='date' value='${todayDate}' style='color: var(--text-color);'>`;

      const updateCell = row.insertCell(-1);
      let updateButton = document.createElement("img");
      updateButton.src = "icons8-synchronize-48.png";
      updateButton.className = "atualizar";
      updateCell.appendChild(updateButton);
  }

  comparar();
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
  const sourceRow = button.closest("tr");
  const targetTableBody = document.getElementById("tableBody2");
  const newRow = targetTableBody.insertRow(-1);

  // Copiar o data-id da linha de origem para a nova linha
  const dataId = sourceRow.getAttribute("data-id");
  newRow.setAttribute("data-id", dataId);
  console.log("Copying row with data-id:", dataId);

  Array.from(sourceRow.cells).forEach((cell, index) => {
    if (index < sourceRow.cells.length - 2) {
      let newCell = newRow.insertCell(-1);
      if (cell.querySelector("input, select")) {
        if (cell.querySelector("input")) {
          let input = cell.querySelector("input");
          newCell.innerHTML = `<input type='${input.type}' value='${input.value}' ${input.type === "text" && index === 0 ? "readonly" : ""}>`;
        } else if (cell.querySelector("select")) {
          let select = cell.querySelector("select");
          let newSelect = document.createElement("select");
          Array.from(select.options).forEach((option) => {
            let newOption = new Option(option.text, option.value, option.selected, option.selected);
            newSelect.appendChild(newOption);
          });
          newCell.appendChild(newSelect);
        }
      } else {
        newCell.textContent = cell.textContent;
      }
    }
  });

  let todayDate = new Date().toISOString().slice(0, 10);
  newRow.insertCell(-1).innerHTML = `<input type='date' value='${todayDate}'>`;
  
  // Adicionar o mesmo ícone de atualização utilizado na função criarTable
  let updateCell = newRow.insertCell(-1);
  let updateButton = document.createElement("img");
  updateButton.src = "icons8-synchronize-48.png";
  updateButton.className = "update-button";
  updateButton.style.width = "25px"; // Ajustar tamanho
  updateButton.style.height = "25px"; // Ajustar tamanho
  updateCell.appendChild(updateButton);

  comparar();
}


export function copiarTudo() {
  const bancoDadosTable = document.getElementById("bancoDados");
  const rows = Array.from(bancoDadosTable.querySelectorAll("tbody tr"));
  rows.forEach((row) => {
    const copiarButton = row.querySelector(".copiar");
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

      for (let k = 4; k <= 7; k++) {
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
        foundMatch = true;
        row2.setAttribute("data-id", row1.getAttribute("data-id")); // Atribui o data-id corretamente
        row2.cells[0].querySelector("input").value = row1.cells[0].querySelector("input").value;

        const select1 = row1.cells[8].querySelector("select");
        const select2 = row2.cells[8].querySelector("select");
        if (select1 && select2) {
          select2.value = select1.value;
        }

        validar_status(row1, row2);
        break;
      }
    }

    if (!foundMatch) {
      // console.log(`Nenhuma correspondência encontrada para a linha ${i + 1}`);
    }

    // Adiciona a classe 'row-error' se o data-id estiver vazio
    if (!row2.getAttribute("data-id")) {
      row2.classList.add("row-error");
    } else {
      row2.classList.remove("row-error");
    }
  }
}

function validar_status(rowBancoDados, rowRecebimento) {
  const quantidadeBancoDados = parseInt(rowBancoDados.cells[3].querySelector("input").value, 10);
  const quantidadeRecebimento = parseInt(rowRecebimento.cells[3].querySelector("input").value, 10);

  if (quantidadeRecebimento >= quantidadeBancoDados) {
    rowRecebimento.cells[9].querySelector("select").value = "RECEBIDO";
    console.log("Status mudado para Recebido");
  } else if (quantidadeRecebimento < quantidadeBancoDados) {
    rowRecebimento.cells[9].querySelector("select").value = "PARCIALMENTE";
    console.log("Status mudado para Parcialmente");
  }
}



export function addLine() {
  console.log("Função addLine chamada");
  const table = document.getElementById("recebimento");
  const tbody = table.querySelector("tbody");
  const row = tbody.insertRow(-1);
  const fields = ["ID", "Fornecedor", "Id_compra", "Quantidade", "Qualidade", "Largura", "Comprimento", "Onda", "Vincos", "Status", "Data_recebimento"];

  fields.forEach((field, index) => {
    const cell = row.insertCell(index);
    if (field === "Status" || field === "Onda" || field == "Vincos") {
      let selectHTML = `<select>`;
      if (field === "Status") {
        selectHTML += `<option>COMPRADO</option><option>RECEBIDO</option><option>PARCIALMENTE</option>`;
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
      cell.innerHTML = `<input type='text'>`;
    }
  });

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