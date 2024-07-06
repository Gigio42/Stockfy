import BASE_URL from "../utils/config.js";

var dropzone = document.getElementById("dropzone");
var jsonData;
var dropEnabled = true;

function openFilePicker() {
  if (dropEnabled) {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.style.display = "none";

    fileInput.addEventListener("change", function (event) {
      var file = event.target.files[0];
      console.log("Arquivo selecionado:", file.name);
      handleFile(URL.createObjectURL(file));
    });

    fileInput.click();
  }
}

dropzone.addEventListener("click", openFilePicker);

document.addEventListener("dragover", function (event) {
  event.preventDefault();
  event.stopPropagation();
  if (dropEnabled) {
    dropzone.classList.add("dragover");
  }
  return false;
});

document.addEventListener("drop", function (event) {
  event.preventDefault();
  event.stopPropagation();
  dropzone.classList.remove("dragover");

  if (dropEnabled) {
    var file = event.dataTransfer.files[0];
    console.log("Arquivo solto:", file.name);
    handleFile(URL.createObjectURL(file));
  }
});

window.handleFile = function (fileUrl) {
  console.log("Lendo arquivo:", fileUrl);
  pdfjsLib
    .getDocument(fileUrl)
    .promise.then(function (pdf) {
      console.log("PDF processado com sucesso:", fileUrl);
      extractPdfData(pdf);
    })
    .finally(function () {
      dropEnabled = true;
      console.log("Evento de solta reativado.");
    });
};

function extractPdfData(pdf) {
  var infoPedido = {};
  var infoProdComprados = [];
  var prodComprado = {};
  var lineNumber = 1;
  var isInfoPedido = false;
  var isInfoProdComprados = false;
  var isValoresExpressos = false;

  pdf.getPage(1).then(function (page) {
    page.getTextContent().then(function (textContent) {
      var items = textContent.items;
      var fullText = items
        .map(function (item) {
          return item.str.trim().toLowerCase();
        })
        .join(" ");

      parsePdfContent(items, fullText, infoPedido, infoProdComprados, prodComprado, lineNumber, isInfoPedido, isInfoProdComprados, isValoresExpressos);
    });
  });
}

function parsePdfContent(items, fullText, infoPedido, infoProdComprados, prodComprado, lineNumber, isInfoPedido, isInfoProdComprados, isValoresExpressos) {
  items.forEach(function (item, index) {
    var line = item.str.trim();

    if (isValoresExpressos) return;

    if (lineNumber === 1 || lineNumber === 15 || lineNumber === 23) {
      isInfoPedido = true;
      isInfoProdComprados = false;
      if (line !== "") {
        switch (lineNumber) {
          case 1:
            infoPedido.comprador = line;
            break;
          case 15:
            infoPedido.data_compra = line;
            break;
          case 23:
            infoPedido.fornecedor = line;
            break;
        }
      }
    } else if (!isValoresExpressos) {
      if ((lineNumber - 56) % 19 === 0) {
        isInfoPedido = false;
        isInfoProdComprados = true;
        if (Object.keys(prodComprado).length !== 0) {
          infoProdComprados.push(renameProperties(removeEmptyProperties(prodComprado)));
          prodComprado = {};
        }
      }
      if (line === "Valores expressos em Reais") {
        isValoresExpressos = true;
        return;
      }
      if (isInfoProdComprados) {
        handleProdCompradoLine(line, prodComprado, lineNumber);
      }
    }
    lineNumber++;
  });

  var pedidoCompra = extractPedidoCompra(fullText);
  handleExpectedDateChange(pedidoCompra, infoPedido, infoProdComprados);
  populateTable(infoProdComprados);

  console.log("JSON extraído:", { infoPedido, infoProdComprados });

  showModal();
}

function handleProdCompradoLine(line, prodComprado, lineNumber) {
  switch ((lineNumber - 56) % 19) {
    case 1:
      prodComprado.cliente = line;
      break;
    case 3:
      prodComprado["quantidade_comprada"] = line;
      break;
    case 5:
      prodComprado.unidade = line;
      break;
    case 7:
      prodComprado["qualidade"] = line;
      break;
    case 9:
      prodComprado.onda = line;
      break;
    case 11:
      prodComprado["gramatura"] = line;
      break;
    case 13:
      prodComprado["peso_total"] = line;
      break;
    case 15:
      prodComprado["valor_kilo"] = line;
      break;
    case 17:
      prodComprado["valor_total"] = line;
      break;
    case 18:
      parseMedidas(line, prodComprado);
      break;
  }
}

function parseMedidas(line, prodComprado) {
  console.log("Linha recebida:", line); // Adicionado para depuração

  if (line.includes("-")) {
    var parts = line.split("-");
    if (parts.length >= 2) {
      var medidas = parts[0].match(/\d+(\.\d+)?/g);
      if (medidas && medidas.length == 2) {
        var largura = medidas[0].trim().replace(".", "");
        var comprimento = medidas[1].trim().replace(".", "");
        var vincos = parts[1].trim().replace("VINCOS:", "").replace("vincos:", "").trim();
        if (!vincos.includes("+")) {
          vincos = "não";
        }
        prodComprado["largura"] = largura;
        prodComprado["comprimento"] = comprimento;
        prodComprado["vincos"] = vincos;
      } else {
        console.error("Formato de linha inválido para a medida (números):", line);
        prodComprado["largura"] = "";
        prodComprado["comprimento"] = "";
        prodComprado["vincos"] = "";
      }
    } else {
      console.error("Formato de linha inválido para a medida (partes):", line);
      prodComprado["largura"] = "";
      prodComprado["comprimento"] = "";
      prodComprado["vincos"] = "";
    }
  } else {
    console.error("Caractere '-' não encontrado na linha:", line);
    prodComprado["largura"] = "";
    prodComprado["comprimento"] = "";
    prodComprado["vincos"] = "";
  }
}

function extractPedidoCompra(fullText) {
  var pedidoCompra = "";
  var pedidoCompraMatch = fullText.match(/\b\d{2}\.\d{3}\b/);
  if (pedidoCompraMatch) {
    pedidoCompra = pedidoCompraMatch[0];
    console.log("Número do pedido de compra:", pedidoCompra);
  } else {
    console.error("Número do pedido de compra não encontrado no PDF.");
    pedidoCompra = "";
  }
  return pedidoCompra;
}

function handleExpectedDateChange(pedidoCompra, infoPedido, infoProdComprados) {
  var expectedDateInput = document.getElementById("expectedDate");

  expectedDateInput.addEventListener("change", function () {
    var dateValue = expectedDateInput.value;
    jsonData = {
      info_prod_comprados: infoProdComprados.map(function (prod) {
        return {
          ...prod,
          ...infoPedido,
          id_compra: convertToInteger(pedidoCompra),
          data_prevista: dateValue,
        };
      }),
    };

    console.log("JSON atualizado com a data prevista:");
    console.log(jsonData);
  });
}

function convertToInteger(idCompraStr) {
  return parseInt(idCompraStr.replace(/\./g, ""));
}

function addTableHeader(dataTable) {
  const headers = ["Quant. Comprada", "Qualidade", "Onda", "Largura", "Comprimento", "Vincos"];
  const headerRow = dataTable.insertRow();
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    th.classList.add("table-header");
    headerRow.appendChild(th);
  });
}

function addTableRow(dataTable, prod, index) {
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
  });
}
function updateCardboardRepresentation(prod) {
  const cardboardDiv = document.getElementById("cardboardRepresentation");

  // Obtém largura e comprimento do JSON
  const comprimento = parseInt(prod.comprimento);
  const largura = parseInt(prod.largura);

  // Define o fator de escala (por exemplo, 0.8 para reduzir em 20%)
  const scale = 0.3;

  // Converte para pixels (assumindo 1 pixel = 1 mm)
  const larguraPx = comprimento * scale;
  const comprimentoPx = largura * scale;

  // Cria a representação da chapa de papelão em pixels
  cardboardDiv.innerHTML = `
    <div class="cardboard-sheet" style="width: ${larguraPx}px; height: ${comprimentoPx}px;">
      <div class="cardboard-dimensions">
        ${largura} X ${comprimento}
      </div>
    </div>
  `;
}







function populateTable(infoProdComprados) {
  const dataTable = document.getElementById("dataTable");
  if (dataTable) {
    dataTable.innerHTML = "";
    addTableHeader(dataTable);
    infoProdComprados.forEach((prod, index) => addTableRow(dataTable, prod, index));
  }
}




function showModal() {
  var modal = document.getElementById("myModal");
  if (modal) {
    modal.style.display = "block";
    console.log("JSON Data:", jsonData);
  } else {
    console.error("Modal não encontrado.");
  }
}

function sendJSONDataToBackend() {
  let url = `${BASE_URL}/compras`;

  var jsonDataToSend = JSON.parse(JSON.stringify(jsonData), function (key, value) {
    if (typeof value === "string" && !isNaN(value) && value !== "") {
      var intValue = parseInt(value.replace(/\./g, ""), 10);
      return intValue;
    }
    return value;
  });

  axios
    .post(url, jsonDataToSend, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(() => {
      console.log("Dados enviados com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Erro ao enviar dados:", error);
    });
}

function removeEmptyProperties(obj) {
  for (var prop in obj) {
    if (obj[prop] === "") {
      delete obj[prop];
    }
  }
  return obj;
}

function renameProperties(obj) {
  var newObj = {};
  newObj["numero_cliente"] = parseInt(obj.cliente, 10); // Converter para inteiro
  newObj["quantidade_comprada"] = obj["quantidade_comprada"];
  newObj["unidade"] = obj["unidade"];
  newObj["qualidade"] = obj["qualidade"];
  newObj["onda"] = obj["onda"];
  newObj["gramatura"] = obj["gramatura"];
  newObj["peso_total"] = obj["peso_total"];
  newObj["valor_unitario"] = obj["valor_kilo"];
  newObj["valor_total"] = obj["valor_total"];
  newObj["largura"] = obj["largura"];
  newObj["comprimento"] = obj["comprimento"];
  newObj["vincos"] = obj["vincos"];
  newObj["status"] = "COMPRADO";
  return newObj;
}

var expectedDateInput = document.getElementById("expectedDate");

var sendButton = document.getElementById("sendButton");
if (sendButton) {
  sendButton.addEventListener("click", function () {
    if (expectedDateInput.value === "") {
      expectedDateInput.classList.add("invalid-date");
      console.error("A data prevista não foi selecionada.");
      return;
    }

    sendJSONDataToBackend();
  });
} else {
  console.error("Botão 'Enviar' não encontrado.");
}
