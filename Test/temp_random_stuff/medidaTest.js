function extractDimensions(chapa) {
  if (chapa.medida) {
    const dimensions = chapa.medida
      .toLowerCase()
      .replace(/\s/g, "")
      .split("x")
      .map((dim) => parseFloat(dim.replace(',', '.').replace('.', '')));
    if (dimensions.length === 2) {
      chapa.largura = dimensions[0];
      chapa.comprimento = dimensions[1];
    }
  }
  return chapa;
}

const chapa = {
  medida: '472x1201'
};

const result = extractDimensions(chapa);

console.log(result);  