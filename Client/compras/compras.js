document.getElementById('pdfForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var fileInput = document.getElementById('pdfFile');
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
        var pdfData = new Uint8Array(event.target.result);
        pdfjsLib.getDocument({data: pdfData}).promise.then(function(pdf) {
            var xml = ''; // Inicia o XML
            pdf.getPage(1).then(function(page) {
                page.getTextContent().then(function(textContent) {
                    var items = textContent.items;
                    var lineNumber = 1; // Inicia o número de linha
                    var isInRange = false; // Flag para verificar se estamos dentro do intervalo desejado
                    var linesBeforeValues = 5; // Quantidade de linhas antes de "Valores expressos em Reais"
                    var linesBeforeEnd = linesBeforeValues; // Contador para linhas antes de "Valores expressos em Reais"
                    items.forEach(function(item) {
                        // Verifica se a linha é uma das linhas desejadas
                        if (lineNumber === 1 || lineNumber === 15 || lineNumber === 23 || lineNumber === 53 || (linesBeforeEnd > 0 && linesBeforeEnd <= linesBeforeValues)) {
                            xml += '<span class="line-number">' + lineNumber + '</span>' + item.str + '\n'; // Adiciona a linha ao XML
                        }
                        if (lineNumber === 54) {
                            isInRange = true; // Estamos dentro do intervalo desejado
                        }
                        if (isInRange) {
                            if (item.str.trim() === 'Valores expressos em Reais') {
                                isInRange = false; // Saímos do intervalo desejado
                            }
                            linesBeforeEnd--;
                        }
                        lineNumber++; // Incrementa o número de linha
                    });
                    document.getElementById('xmlOutput').innerHTML = xml; // Exibe o XML na tela
                });
            });
        });
    };

    reader.readAsArrayBuffer(file);
});