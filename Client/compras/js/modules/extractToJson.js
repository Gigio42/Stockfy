import { populateTable } from "./table.js";  
import { showModal } from "./utils.js";  


let jsonData = {};

export function extractPdfData(pdf, jsonData) {
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

      parsePdfContent(items, fullText, infoPedido, infoProdComprados, prodComprado, lineNumber, isInfoPedido, isInfoProdComprados, isValoresExpressos, jsonData);
    });
  });
}


  
 export function handleExpectedDateChange(pedidoCompra, infoPedido, infoProdComprados) {
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

  
  
  export function parsePdfContent(items, fullText, infoPedido, infoProdComprados, prodComprado, lineNumber, isInfoPedido, isInfoProdComprados, isValoresExpressos, jsonData) {
    let hasFernandez = false;
    
    // Verifica se a palavra "FERNANDEZ" está presente em algum lugar do PDF
    if (fullText.includes("fernandez")) {
        hasFernandez = true;
        console.log("A palavra 'FERNANDEZ' foi encontrada no PDF.");
    }
  
    items.forEach(function (item) {
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
        const adjustedLineNumber = hasFernandez ? lineNumber - 54 : lineNumber - 56;
        if (adjustedLineNumber % 19 === 0) {
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
          handleProdCompradoLine(line, prodComprado, lineNumber, hasFernandez);
        }
      }
      lineNumber++;
    });
    
    var pedidoCompra = extractPedidoCompra(fullText);
    handleExpectedDateChange(pedidoCompra, infoPedido, infoProdComprados);
    populateTable(infoProdComprados);
  
    // Atualiza jsonData
    jsonData.infoPedido = infoPedido;
    jsonData.infoProdComprados = infoProdComprados;
  
    console.log("JSON extraído:", { infoPedido, infoProdComprados });
  
    showModal(jsonData);
  }
  

export function handleProdCompradoLine(line, prodComprado, lineNumber, hasFernandez) {
  const adjustedLineNumber = hasFernandez ? lineNumber - 54 : lineNumber - 56;

  switch (adjustedLineNumber % 19) {
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



  export function parseMedidas(line, prodComprado) {
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


export function extractPedidoCompra(fullText) {
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


  
  export function convertToInteger(idCompraStr) {
    return parseInt(idCompraStr.replace(/\./g, ""));
  }

  export function renameProperties(obj) {
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
    newObj["medida"] = `${obj.largura} X ${obj.comprimento}`; // Concatenando largura e comprimento
    newObj["vincos"] = obj["vincos"];
    newObj["status"] = "COMPRADO";
    return newObj;
  }
  

  export function removeEmptyProperties(obj) {
    for (var prop in obj) {
      if (obj[prop] === "") {
        delete obj[prop];
      }
    }
    return obj;
  }

  export {jsonData}
  