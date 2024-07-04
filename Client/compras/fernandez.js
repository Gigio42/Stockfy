import BASE_URL from "../utils/config.js";

var dropzone = document.getElementById("dropzone");
var jsonData; // Variável global para armazenar os dados JSON processados
var dropEnabled = true; // Variável para controlar se o evento de solta (drop) está habilitado

// Evento de clique no dropzone
dropzone.addEventListener("click", openFilePicker);

// Adiciona um listener de evento de dragover no elemento document
document.addEventListener("dragover", function (event) {
  event.preventDefault(); // Impede o comportamento padrão de abrir o PDF no navegador
  event.stopPropagation();
  if (dropEnabled) {
    dropzone.classList.add("dragover");
  }
  return false; // Evita o comportamento padrão do navegador
});

// Adiciona um listener de evento de drop no elemento document
document.addEventListener("drop", function (event) {
  event.preventDefault(); // Impede o comportamento padrão de abrir o PDF no navegador
  event.stopPropagation();
  dropzone.classList.remove("dragover");

  if (dropEnabled) {
    var file = event.dataTransfer.files[0];
    console.log("Arquivo solto:", file.name);
    handleFile(file);
  }
});

function openFilePicker() {
  if (dropEnabled) {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";
    fileInput.style.display = "none";

    // Evento de mudança no input de arquivo
    fileInput.addEventListener("change", function (event) {
      var file = event.target.files[0];
      console.log("Arquivo selecionado:", file.name);
      handleFile(file);
    });

    // Simula o clique no input de arquivo
    fileInput.click();
  }
}

function handleFile(file) {
  console.log("Lendo arquivo:", file.name);
  var reader = new FileReader();

  reader.onload = function (event) {
    console.log("Arquivo lido com sucesso:", file.name);
    var pdfData = new Uint8Array(event.target.result);
    pdfjsLib
      .getDocument({ data: pdfData })
      .promise.then(function (pdf) {
        console.log("PDF processado com sucesso:", file.name);
        extractPdfData(pdf);
      })
      .finally(function () {
        dropEnabled = true; // Reativa o evento de solta (drop) no documento
        console.log("Evento de solta reativado.");
      });
  };

  reader.readAsArrayBuffer(file);
}

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

    if (isValoresExpressos) return; // Saímos do loop se chegarmos aos valores expressos

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
      if ((lineNumber - 54) % 19 === 0) {
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

  // Mostra o JSON extraído no console
  console.log("JSON extraído:", { infoPedido, infoProdComprados });

  showModal();
}

function handleProdCompradoLine(line, prodComprado, lineNumber) {
  switch ((lineNumber - 54) % 19) {
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
      var medidas = parts[0].match(/\d+(\.\d+)?/g); // Extrair apenas os números
      if (medidas && medidas.length == 2) {
        var largura = medidas[0].trim().replace(".", ""); // Remover pontos da largura
        var comprimento = medidas[1].trim().replace(".", ""); // Remover pontos do comprimento
        var vincos = parts[1].trim().replace("VINCOS:", "").replace("vincos:", "").trim();
        if (!vincos.includes("+")) {
          vincos = "não";
        }
        prodComprado["largura"] = largura; // Armazenar largura
        prodComprado["comprimento"] = comprimento; // Armazenar comprimento
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
    console.log("Número do pedido de compra:", pedidoCompra); // Adicionado para depuração
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
          id_compra: convertToInteger(pedidoCompra), // Incluído o ID de compra
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

// Função para adicionar cabeçalho à tabela
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

// Função para adicionar uma linha de dados à tabela
function addTableRow(dataTable, prod, index) {
  const row = dataTable.insertRow();
  row.setAttribute("data-id", index);
  const infoToShow = ["quantidade_comprada", "qualidade", "onda", "largura", "comprimento", "vincos"];

  infoToShow.forEach((info) => {
    const cell = row.insertCell();
    cell.textContent = prod[info];
  });

  row.classList.add(index % 2 === 0 ? "even-row" : "odd-row");
}

// Adiciona o JSON diretamente à tabela no modal
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
    console.log("JSON Data:", jsonData); // Adicionado para mostrar o JSON no console
  } else {
    console.error("Modal não encontrado.");
  }
}

function sendJSONDataToBackend() {
  let url = `${BASE_URL}/compras`;

  // Validar e converter tipos de dados
  var jsonDataToSend = JSON.parse(JSON.stringify(jsonData), function (key, value) {
    // Se o valor for uma string e contiver um número com ponto decimal, converter para inteiro
    if (typeof value === "string" && !isNaN(value) && value !== "") {
      // Remover pontos decimais e converter para inteiro
      var intValue = parseInt(value.replace(/\./g, ""));
      return intValue;
    }
    // Caso contrário, manter o valor como está
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
      window.location.reload(); // Recarrega a página ao enviar dados com sucesso
    })
    .catch((error) => {
      console.error("Erro ao enviar dados:", error);
    });
}

// Função para remover propriedades vazias de um objeto
function removeEmptyProperties(obj) {
  for (var prop in obj) {
    if (obj[prop] === "") {
      delete obj[prop];
    }
  }
  return obj;
}

// Dentro da função renameProperties
function renameProperties(obj) {
  var newObj = {};
  newObj["numero_cliente"] = obj.cliente;
  newObj["quantidade_comprada"] = obj["quantidade_comprada"];
  newObj["unidade"] = obj["unidade"];
  newObj["qualidade"] = obj["qualidade"];
  newObj["onda"] = obj["onda"];
  newObj["gramatura"] = obj["gramatura"];
  newObj["peso_total"] = obj["peso_total"];
  newObj["valor_unitario"] = obj["valor_kilo"];
  newObj["valor_total"] = obj["valor_total"];
  newObj["largura"] = obj["largura"]; // Adiciona largura
  newObj["comprimento"] = obj["comprimento"]; // Adiciona comprimento
  newObj["vincos"] = obj["vincos"];
  newObj["status"] = "COMPRADO";
  return newObj;
}

// Obtém o valor do input de data prevista
var expectedDateInput = document.getElementById("expectedDate");

// Adiciona um evento de clique ao botão "Enviar"
var sendButton = document.getElementById("sendButton");
if (sendButton) {
  sendButton.addEventListener("click", function () {
    // Verifica se o valor do input de data está vazio
    if (expectedDateInput.value === "") {
      // Adiciona uma classe ao input de data para destacá-lo como inválido
      expectedDateInput.classList.add("invalid-date");
      console.error("A data prevista não foi selecionada.");
      return; // Impede o envio do JSON se a data prevista não estiver selecionada
    }

    // Se a data prevista estiver selecionada, envie o JSON para o backend
    sendJSONDataToBackend();
  });
} else {
  console.error("Botão 'Enviar' não encontrado.");
}

// Adiciona um evento de clique ao botão "Editar"
var editButton = document.getElementById("editButton");
if (editButton) {
  editButton.addEventListener("click", function () {
    var jsonContent = document.getElementById("jsonContent");
    if (jsonContent) {
      // Exibe o conteúdo JSON formatado no elemento com id 'jsonContent'
      jsonContent.textContent = JSON.stringify(jsonData, null, 2);
      jsonContent.style.display = "block"; // Exibe o elemento
    } else {
      console.error("Elemento 'jsonContent' não encontrado.");
    }
  });
} else {
  console.error("Botão 'Editar' não encontrado.");
}
