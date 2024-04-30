document.addEventListener('DOMContentLoaded', function() {
    var dropzone = document.getElementById('dropzone');

    // Evento de clique no dropzone
    dropzone.addEventListener('click', function() {
        openFilePicker();
    });

    // Eventos de arrastar e soltar
    dropzone.addEventListener('dragover', function(event) {
        event.preventDefault();
        dropzone.classList.add('dragover');
    });

    dropzone.addEventListener('dragleave', function(event) {
        event.preventDefault();
        dropzone.classList.remove('dragover');
    });

    dropzone.addEventListener('drop', function(event) {
        event.preventDefault();
        dropzone.classList.remove('dragover');

        var file = event.dataTransfer.files[0];
        handleFile(file);
    });

    function openFilePicker() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf';
        fileInput.style.display = 'none';

        // Evento de mudança no input de arquivo
        fileInput.addEventListener('change', function(event) {
            var file = event.target.files[0];
            handleFile(file);
        });

        // Simula o clique no input de arquivo
        fileInput.click();
    }

    function handleFile(file) {
        var reader = new FileReader();
    
        reader.onload = function(event) {
            var pdfData = new Uint8Array(event.target.result);
            pdfjsLib.getDocument({data: pdfData}).promise.then(function(pdf) {
                var infoPedido = {};
                var pedidoCompra = '';
                var infoProdComprados = [];
                var prodComprado = {};
                var lineNumber = 1;
                var isInfoPedido = false;
                var isPedidoCompra = false;
                var isInfoProdComprados = false;
                var isValoresExpressos = false;
                var hasInclusao = false;
    
                pdf.getPage(1).then(function(page) {
                    page.getTextContent().then(function(textContent) {
                        var items = textContent.items;
                        var fullText = items.map(function(item) {
                            return item.str.trim().toLowerCase();
                        }).join(' '); // Concatenar todo o texto em uma única string
                        // Verificar se a palavra "INCLUSÃO" está presente no texto
                        hasInclusao = fullText.includes('inclusão');
    
                        items.forEach(function(item) {
                            var line = item.str.trim();
                            if (isValoresExpressos) {
                                return; // Saímos do loop se chegarmos aos valores expressos
                            }
                            if (lineNumber === 1 || lineNumber === 15 || lineNumber === 23) {
                                isInfoPedido = true;
                                isPedidoCompra = false;
                                isInfoProdComprados = false;
                                if (line !== '') {
                                    // Alteração para definir as informações do pedido conforme o novo formato
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
                            } else if ((lineNumber === 55 || lineNumber === 53) && line.match(/\d{2}\.\d{3}/)) {
                                // Verifica se a linha é a linha 55 ou 53 e se contém o padrão xx.xxx
                                pedidoCompra = line;
                            } else if (lineNumber >= 54 && !isValoresExpressos) {
                                if ((lineNumber - 54) % 19 === 0) {
                                    isInfoPedido = false;
                                    isPedidoCompra = false;
                                    isInfoProdComprados = true;
                                    if (Object.keys(prodComprado).length !== 0) {
                                        // Adiciona as informações do pedido e número do pedido a cada objeto em infoProdComprados
                                        prodComprado.pedido_compra = hasInclusao ? "INCLUSÃO " + pedidoCompra : pedidoCompra;
                                        infoProdComprados.push(renameProperties(removeEmptyProperties(prodComprado)));
                                        prodComprado = {};
                                    }
                                }
                                if (line === 'Valores expressos em Reais') {
                                    isValoresExpressos = true;
                                    return;
                                }
                                if (isInfoProdComprados) {
                                    switch ((lineNumber - 54) % 19) {
                                        case 1:
                                            prodComprado.cliente = line;
                                            break;
                                        case 3:
                                            prodComprado['quant.'] = line;
                                            break;
                                        case 5:
                                            prodComprado.unidade = line;
                                            break;
                                        case 7:
                                            prodComprado['qual.'] = line;
                                            break;
                                        case 9:
                                            prodComprado.onda = line;
                                            break;
                                        case 11:
                                            prodComprado['gramat.'] = line;
                                            break;
                                        case 13:
                                            prodComprado['peso_lote_chapa'] = line;
                                            break;
                                        case 15:
                                            prodComprado.coluna = line;
                                            break;
                                        case 17:
                                            prodComprado['valor_lote_chapa'] = line;
                                            break;
                                        case 18:
                                            prodComprado['descrição'] = line;
                                            break;
                                    }
                                }
                            }
                            lineNumber++;
                        });
                        // Se encontramos "INCLUSÃO", procuramos um número no formato "XX.XXX" no texto completo
                        if (hasInclusao) {
                            var regex = /\b\d{2}\.\d{3}\b/;
                            var match = fullText.match(regex);
                            if (match) {
                                pedidoCompra = match[0];
                            }
                        }
                        // Construímos o objeto JSON final com base nas informações coletadas
                        var jsonData = {
                            "info_prod_comprados": infoProdComprados.map(function(prod) {
                                return {
                                    ...prod,
                                    ...infoPedido, // Adiciona as informações do pedido a cada objeto em info_prod_comprados
                                    "pedido_compra": hasInclusao ? "INCLUSÃO " + pedidoCompra : pedidoCompra // Adiciona o número do pedido a cada objeto em info_prod_comprados
                                };
                            })
                        };
                        // Exibimos o JSON na saída
                        var jsonOutput = document.getElementById('jsonOutput');
                        if (jsonOutput) {
                            jsonOutput.innerText = JSON.stringify(jsonData, null, 2);
                        } else {
                            console.error("Elemento 'jsonOutput' não encontrado.");
                        }
                    });
                });
            });
        };
    
        reader.readAsArrayBuffer(file);
    }
    

    // Função para remover propriedades vazias de um objeto
    function removeEmptyProperties(obj) {
        for (var prop in obj) {
            if (obj[prop] === '') {
                delete obj[prop];
            }
        }
        return obj;
    }

    // Função para renomear as propriedades do objeto
    function renameProperties(obj) {
        var newObj = {};
        newObj['cliente'] = obj['cliente'];
        newObj['quant.'] = obj['quant.'];
        newObj['unidade'] = obj['unidade'];
        newObj['qual.'] = obj['qual.'];
        newObj['onda'] = obj['onda'];
        newObj['gramat.'] = obj['gramat.'];
        newObj['peso_lote_chapa'] = obj['peso_lote_chapa'];
        newObj['coluna'] = obj['coluna'];
        newObj['valor_lote_chapa'] = obj['valor_lote_chapa'];
        newObj['descrição'] = obj['descrição'];
        return newObj;
    }
});
