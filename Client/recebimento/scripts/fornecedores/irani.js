export function prod_Irani(product) {
  var xProd = product.getElementsByTagName("xProd")[0].textContent;
  var qualidade = xProd.match(/OND\.(.*?)\//)[1].trim();
  var ondaEmedida = xProd.split("/")[1];
  var tipoOnda = ondaEmedida.match(/([A-Za-z]+) /)[1];
  var medida = ondaEmedida.match(/\d+ X \d+/)[0];

  medida = invertDimensions(medida);

  function invertDimensions(dimensions) {
    const parts = dimensions.split(" X ");
    if (parts.length !== 2) {
      return dimensions;
    }
    return parts.reverse().join("X");
  }
  return {
    qualidade: qualidade,
    medida: medida,
    tipoOnda: tipoOnda,
    vincada: "", // Sempre vazio para Irani
  };
}

export function irani(fullText) {
  var descricaoIndex = fullText.indexOf("ALÍQ. IPI");
  if (descricaoIndex === -1) {
    console.warn('Palavra-chave "ALÍQ. IPI" não encontrada.');
    return [];
  }
  var dadosIndex = fullText.indexOf("DADOS", descricaoIndex);
  if (dadosIndex === -1) {
    console.warn('Palavra-chave "DADOS" não encontrada.');
    return [];
  }
  var relevantText = fullText.substring(descricaoIndex + 10, dadosIndex);
  var resultArray = relevantText.split(/\s+/).filter(Boolean);
  return organizarirani(resultArray);
}

function organizarirani(array) {
  var indexesToRemove = [0, 1, 2, 3, 6, 8, 10, 11, 12, 13, 14, 15, 16, 20, 21, 22, 23, 24, 25];
  var newArray = [];
  for (var i = 0; i < array.length; i += 26) {
    var subArray = array.slice(i, i + 26);
    if (subArray.length > 0) {
      var filteredSubArray = subArray.filter((item, index) => !indexesToRemove.includes(index));
      var filteredAndProcessed = filtroIrani(filteredSubArray);
      var objeto = criaObjIrani(filteredAndProcessed);
      newArray.push(objeto);
    }
  }

  return newArray;
}

function filtroIrani(array) {
  var splitIndex = array.findIndex((item) => item.includes("/"));
  if (splitIndex !== -1) {
    var parts = array[splitIndex].split("/");
    array.push(parts[0].trim()); // Adiciona a primeira parte no final do array
    array.push(parts[1].trim()); // Adiciona a segunda parte no final do array
    array.splice(splitIndex, 1); // Remove o elemento original que continha a barra
  }
  array[3] = array[3].replace(",", ".");
  array[3] = parseFloat(array[3] * 1000).toFixed(0);
  array[4] = array[4].replace(",", "");
  array[5] = array[5].replace(".", "").replace(",", ".");

  return array;
}

function criaObjIrani(array) {
  return {
    id_compra: array[2],
    fornecedor: "Irani",
    qualidade: array[6],
    comprimento: array[1],
    largura: array[0],
    onda: array[7],
    vincos: "", // Vazio como solicitado
    quantidade_recebida: array[3],
    valor_unitario: array[4],
    valor_total: array[5],
  };
}
