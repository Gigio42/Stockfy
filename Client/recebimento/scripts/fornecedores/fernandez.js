export function prod_Fernandez(product) {
  var xProd = product.getElementsByTagName("xProd")[0].textContent;
  var parts = xProd.split("-");
  var tipoOnda = parts.length > 1 ? parts[1].match(/[A-Za-z]+/)[0] : "";
  var startOfMeasure = parts[1].indexOf(tipoOnda) + tipoOnda.length;
  var medida = parts.length > 1 ? parts[1].substring(startOfMeasure).trim() : "";

  return {
    qualidade: parts[0] ? parts[0].trim() : "",
    medida: medida,
    tipoOnda: tipoOnda,
    vincada: "", // Always empty for Fernandez
  };
}

export function fernandez(fullText) {
  var aiIndex = fullText.indexOf("A.IPI");
  if (aiIndex === -1) {
    console.warn('Palavra-chave "A.IPI" não encontrada.');
    return [];
  }
  var relevantText = fullText.substring(aiIndex + 5).replace(/UN/g, "");
  var resultArray = relevantText.split(/\s+/).filter(Boolean);
  var idCompra = id_compraF(fullText);
  return organizarFernandez(resultArray, idCompra);
}

function organizarFernandez(array, idCompra) {
  console.log(array);
  var indexesToRemove = [0, 2, 3, 4, 7, 9, 10, 11, 12];
  var newArray = [];
  for (var i = 0; i < array.length; i += 13) {
    var subArray = array.slice(i, i + 13);
    console.log(subArray);
    if (subArray.length > 1) {
      var filteredSubArray = subArray.filter((item, index) => !indexesToRemove.includes(index));
      var filteredAndProcessed = filtroFernandez(filteredSubArray[0]);
      filteredSubArray.splice(0, 1);
      var objeto = criaObjFernandez([...filteredSubArray, ...filteredAndProcessed]);

      if (objeto.quantidade_recebida) {
        let quantidadeModificada = objeto.quantidade_recebida.replace(/\.|\,/g, (match) => (match === "," ? "." : ""));
        objeto.quantidade_recebida = parseFloat(quantidadeModificada).toString();
      }

      objeto.valor_unitario = objeto.valor_unitario.replace(/\./g, "").replace(/,/g, ".");
      objeto.valor_total = objeto.valor_total.replace(/\./g, "").replace(/,/g, ".");
      objeto.id_compra = idCompra;

      newArray.push(objeto);
    }
  }
  return newArray;
}

function id_compraF(fullText) {
  var aiIndex = fullText.indexOf("PEDIDO DO CLIENTE:");
  if (aiIndex === -1) {
    console.warn('Palavra-chave "Pedido do Cliente:" não encontrada.');
    return [];
  }
  var dadosIndex = fullText.indexOf("PRODUTO", aiIndex);
  if (dadosIndex === -1) {
    console.warn('Palavra-chave "PRODUTO" não encontrada.');
    return [];
  }
  var relevantText = fullText.substring(aiIndex + 19, dadosIndex);
  relevantText = relevantText.replace(/\./g, "").replace("INCLUSAO", ""); // Remove ponto e a palavra INCLUSÃO
  var resultArray = relevantText.split(/\s+/).filter(Boolean);
  return resultArray;
}

function filtroFernandez(secondArray) {
  console.log(secondArray);
  let parts = secondArray.split("-");
  let secondPart = parts.length > 1 ? parts[1] : "";
  let result = secondPart.split(/(\d.+)/, 2);
  return [...parts.slice(0, 1), ...result];
}

function criaObjFernandez(array) {
  console.log(array);
  var medidas = array[5].split("X");
  return {
    id_compra: array[0],
    fornecedor: "Fernandez",
    qualidade: array[3],
    largura: medidas[0],
    comprimento: medidas[1],
    onda: array[4],
    vincos: "",
    quantidade_recebida: array[0],
    valor_unitario: array[2],
    valor_total: array[3],
  };
}
