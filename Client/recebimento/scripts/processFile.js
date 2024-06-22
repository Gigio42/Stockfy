
import { fernandez, prod_Fernandez } from "./fornecedores/fernandez.js";
import { penha, prod_Penha } from "./fornecedores/penha.js";
import { irani, prod_Irani } from "./fornecedores/irani.js";
import { fetchChapas } from "./connections.js";
import { criarTable } from "./manipularTabela.js";



export function processPDF(file) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var typedarray = new Uint8Array(event.target.result);
    extractText(typedarray);
  };
  reader.readAsArrayBuffer(file);
}

export function processXML(file) {
  var reader = new FileReader();
  reader.onload = function (event) {
    var xml = event.target.result;
    parseXML(xml);
  };
  reader.readAsText(file);
}

export function extractText(data) {
  pdfjsLib.getDocument(data).promise.then(function (pdf) {
    var numPages = pdf.numPages;
    var promises = [];
    for (var i = 1; i <= numPages; i++) {
      promises.push(
        pdf.getPage(i).then(function (page) {
          return page.getTextContent().then(function (textContent) {
            return textContent.items.map((item) => item.str).join(" ");
          });
        }),
      );
    }

    Promise.all(promises)
      .then(function (pageTexts) {
        var fullText = pageTexts.join("\n").toUpperCase();
        processText(fullText);
      })
      .catch(function (error) {
        console.error("Erro ao extrair texto:", error);
      });
  });
}

function processText(text) {
  if (text.includes("FERNANDEZ")) {
    var result = fernandez(text);
    handleFetchAndCreateTable(result);
  } else if (text.includes("PENHA")) {
    var result = penha(text);
    handleFetchAndCreateTable(result);
  } else if (text.includes("IRANI")) {
    var result = irani(text);
    handleFetchAndCreateTable(result);
  } else {
    console.log("Não encontrou o fornecedor");
  }
}


function parseXML(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const products = xmlDoc.getElementsByTagName("det");
    const table = document.getElementById("recebimento");
  
    const supplier = extractSupplier(xmlDoc);
    const prodFunc = { Penha: prod_Penha, Fernandez: prod_Fernandez, Irani: prod_Irani };
  
    const uniqueIds = new Set();
  
    // Coletar todos os IDs de compra primeiro
    Array.from(products).forEach((product) => {
      const prodDetails = prodFunc[supplier]?.(product);
      if (!prodDetails) return;
  
      const chapaData = data_Chapa(prodDetails, product, supplier, xmlDoc);
      uniqueIds.add(chapaData.id_compra);
    });
  
    const fetchPromises = Array.from(uniqueIds).map((id) => fetchChapas(id));
  
    Array.from(products).forEach((product) => {
      const prodDetails = prodFunc[supplier]?.(product);
      if (!prodDetails) return;
  
      const chapaData = data_Chapa(prodDetails, product, supplier, xmlDoc);
      criarTable(table, chapaData); // Cria uma linha na tabela para cada chapaData
    });
  }
  
  function extractSupplier(xmlDoc) {
    const xNome = xmlDoc.getElementsByTagName("emit")[0].getElementsByTagName("xNome")[0].textContent;
    const supplierMap = {
      PENHA: "Penha",
      FERNANDEZ: "Fernandez",
      Irani: "Irani",
    };
  
    return Object.keys(supplierMap).find((key) => xNome.includes(key)) ? supplierMap[Object.keys(supplierMap).find((key) => xNome.includes(key))] : "";
  }
  
  function data_Chapa(prodDetails, product, supplier, xmlDoc) {
    const xPedContent = product.getElementsByTagName("xPed")[0].textContent;
    const slashIndex = xPedContent.indexOf("/");
    const cleanedText = slashIndex !== -1 ? xPedContent.substring(0, slashIndex) : xPedContent;
    const xPed = cleanedText.replace(/\D/g, "");
    let qCom = "";
    if (supplier == "Irani") {
      qCom = parseFloat(product.getElementsByTagName("qCom")[0].textContent * 1000).toFixed(0);
    } else {
      qCom = parseFloat(product.getElementsByTagName("qCom")[0].textContent) || 0;
    }
    const vUnCom = parseFloat(product.getElementsByTagName("vUnCom")[0].textContent) || 0;
    const vProd = parseFloat(product.getElementsByTagName("vProd")[0].textContent) || 0;
  
    const { qualidade, medida, tipoOnda, vincada } = prodDetails;
    var medidas = medida.split(/x/i).map(function (medidas) {
      return medidas.replace(/^0+/, "");
    });
    return {
      id_compra: xPed,
      fornecedor: supplier,
      qualidade: qualidade,
      comprimento: medidas[0],
      largura: medidas[1],
      onda: tipoOnda,
      quantidade_recebida: qCom,
      vincos: vincada,
      valor_unitario: vUnCom,
      valor_total: vProd,
    };
  }


function handleFetchAndCreateTable(result) {
  const table = document.getElementById("recebimento");
  const uniqueIds = new Set(result.map(obj => obj.id_compra));
  const fetchPromises = Array.from(uniqueIds).map(id => fetchChapas(id));
  
  Promise.all(fetchPromises).then(() => {
    result.forEach(obj => criarTable(table, obj));
  }).catch(error => {
    console.error("Erro durante a busca de chapas:", error);
  });
}

