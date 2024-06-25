export function prod_Penha(product) {
  var xProd = product.getElementsByTagName("xProd")[0].textContent;
  return {
    qualidade: xProd.match(/-QUAL\.(.*)-MED\./)[1],
    medida: xProd
      .match(/-MED\.(.*)--REF\./)[1]
      .replace(/^[^-]*-/, "")
      .trim(),
    tipoOnda: xProd.match(/ONDA (.*?)-SEU PEDIDO/)[1],
    vincada: /VINCADA/.test(xProd) ? "Sim" : "Não",
  };
}

export function penha(fullText) {
  var descricaoIndex = fullText.indexOf("DESCRIÇÃO DOS PRODUTOS/SERVIÇOS CÓDIGO");
  if (descricaoIndex === -1) {
    console.warn('Palavra-chave "DESCRIÇÃO DOS PRODUTOS/SERVIÇOS CÓDIGO" não encontrada.');
    return [];
  }
  var dadosIndex = fullText.indexOf("DADOS", descricaoIndex);
  if (dadosIndex === -1) {
    console.warn('Palavra-chave "DADOS" não encontrada.');
    return [];
  }
  var relevantText = fullText.substring(descricaoIndex + 40, dadosIndex);
  var resultArray = filtroPenha(relevantText);
  return resultArray.map(criaObjPenha); // Assegura que cada elemento de resultArray é processado por criaObjPenha
}

function filtroPenha(text) {
  function replaceMed(match) {
    return match.replace("-MED.", " ");
  }
  var result = text.replace(/\bUN\b|\bCHAPA DE PAP\. ONDUL\.-QUAL\.\b|\b--REF\.: CHAPA\b|\bPEDI DO\b|\b-N\/PEDIDO:\b|\b000\b|\bPEDI DO\b|\b:\b/g, "");
  result = result.replace(/(.*?)-MED\.(.*?)/g, replaceMed);
  result = result.replace(/(VINCADA)[\s\S]*?(ONDA)/, "$1 $2");
  result = result.replace(/PEDIDO/g, "");
  result = result.replace(/ONDA/g, "");
  result = result.replace(/-SEU PEDI  DO\b/g, "");
  result = result.replace(/:/g, "");
  result = result.replace(/-SEU/g, "");
  result = result.replace(/MEDIDAS/g, "");

  var resultArray = result.split(/\s+/).filter(Boolean);
  return organizarpenha(resultArray);
}

function organizarpenha(array) {
  var indexesToRemove = [0, 1, 2, 5, 6, 8, 9, 12, 17];
  var indexesToRemoveVincos = [0, 1, 2, 5, 6, 8, 9, 12, 17];
  var newArray = [];
  for (var i = 0; i < array.length; i += 18) {
    var subArray = array.slice(i, i + 18);
    // console.log(subArray)

    if (subArray.length === 18 && subArray[17].length !== 7) {
      // Remove o último índice
      subArray.pop();

      // Adiciona o próximo índice ao subArray se disponível
      if (array[i + 18] !== undefined) {
        subArray.push(array[i + 18]);
        i++; // Incrementa i para evitar que o próximo índice seja duplicado em outro subArray
      }
    }

    if (subArray.length > 0) {
      if (subArray[14] == "VINCADA" && subArray[16].length !== 11) {
        // Pular o próximo índice
        i++;
        // Remover os próximos 3 índices
        subArray.splice(16, 4);
        // Garantir que o array tenha 18 valores
        while (subArray.length < 18 && array[i + 18] !== undefined) {
          subArray.push(array[i + 18]);
          i++;
        }
      }

      for (var j = 0; j < indexesToRemove.length; j++) {
        if (subArray[14] == "VINCADA") {
          var index = indexesToRemoveVincos[j];
        } else {
          var index = indexesToRemove[j];
        }
        if (subArray[index]) {
          delete subArray[index];
        }
      }
      subArray = subArray.filter((item) => item !== undefined);

      if (subArray.length >= 5) {
        subArray[4] = subArray[4] + subArray[5];
        subArray.splice(5, 1);
      }

      newArray.push(subArray);
    }
  }
  return newArray;
}

function criaObjPenha(array) {
  let id_compra = array[7] || "";
  const slashIndex = id_compra.indexOf("/");
  if (slashIndex !== -1) {
    id_compra = id_compra.substring(0, slashIndex);
  }
  id_compra = id_compra.replace(/\./g, "");
  var qRec = parseFloat(array[2].replace(/[,.]/g, ""));
  var valorUnitario = parseFloat(array[1].replace(",", ".")); // Correção para formato de número
  var valor_total = parseFloat(array[0].replace(".", "").replace(",", "."));

  var medidas = array[4].split("X").map(function (medidas) {
    return medidas.replace(/^0+/, "");
  });
  var vinco = "";
  if (array[5] == "VINCADA") {
    vinco = "sim";
  } else {
    vinco = "não";
  }

  return {
    id_compra: (id_compra || "").trim(),
    fornecedor: "Penha",
    qualidade: array[3] || "",
    largura: medidas[1],
    comprimento: medidas[0],
    onda: array[6] || "",
    vincos: vinco,
    valor_unitario: valorUnitario || "0", // Verificação e correção
    quantidade_recebida: qRec || "",
    valor_total: valor_total,
  };
}
