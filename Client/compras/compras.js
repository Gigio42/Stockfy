document.addEventListener('DOMContentLoaded', function() {
    var dropzone = document.getElementById('dropzone');
    var jsonData; // Variável global para armazenar os dados JSON processados

    // Evento de clique no dropzone
    dropzone.addEventListener('click', function() {
        openFilePicker();
    });

    // Adiciona um evento de clique ao botão "Voltar" para fechar o modal
    var backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', function() {
            var modal = document.getElementById('myModal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    } else {
        console.error("Botão 'Voltar' não encontrado.");
    }

    // Adiciona um listener de evento de dragover no elemento document
    document.addEventListener('dragover', function(event) {
        event.preventDefault(); // Impede o comportamento padrão de abrir o PDF no navegador
        event.stopPropagation();
        dropzone.classList.add('dragover');
        return false; // Evita o comportamento padrão do navegador
    });

    // Remove a classe 'dragover' quando o cursor do mouse sai da área de dropzone
    document.addEventListener('dragleave', function(event) {
        event.preventDefault(); // Impede o comportamento padrão de abrir o PDF no navegador
        event.stopPropagation();
        dropzone.classList.remove('dragover');
        return false; // Evita o comportamento padrão do navegador
    });

    // Adiciona um listener de evento de drop no elemento document
    document.addEventListener('drop', function(event) {
        event.preventDefault(); // Impede o comportamento padrão de abrir o PDF no navegador
        event.stopPropagation();
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
                                        // Dentro da função handleFile()
                                        case 18:
                                            var descricao = line.split('-')[0]; // Remove tudo após o caractere "-"
                                            prodComprado['descrição'] = descricao.trim(); // Remove espaços em branco extras antes e depois da descrição
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
                        jsonData = {
                            "info_prod_comprados": infoProdComprados.map(function(prod) {
                                return {
                                    ...prod,
                                    ...infoPedido,
                                    "pedido_compra": hasInclusao ? "INCLUSÃO " + pedidoCompra : pedidoCompra
                                };
                            })
                        };

                        // Adiciona o JSON diretamente à tabela no modal
                        var dataTable = document.getElementById('dataTable');
                        if (dataTable) {
                            // Limpa a tabela antes de adicionar novos dados
                            dataTable.innerHTML = '';

                            // Loop sobre cada item de infoProdComprados
                            infoProdComprados.forEach(function(prod, index) {
                                var row = dataTable.insertRow(); // Insere uma nova linha na tabela
                                Object.values(prod).forEach(function(value, colIndex) {
                                    var cell = row.insertCell(); // Insere uma nova célula na linha
                                    cell.textContent = value; // Define o valor da célula como o valor do objeto
                                });

                                // Adiciona a classe 'gray-row' a cada segunda linha da tabela (linha par)
                                if (index % 2 === 1) {
                                    row.classList.add('gray-row');
                                }
                            });
                        } else {
                            console.error("Elemento da tabela não encontrado.");
                        }

                        // Exibe o modal com os dados
                        var modal = document.getElementById('myModal');
                        if (modal) {
                            modal.style.display = 'block';
                        } else {
                            console.error("Modal não encontrado.");
                        }
                    });
                });
            });
        };

        reader.readAsArrayBuffer(file);
    }

    // Função para enviar os dados JSON para o backend
    function sendJSONDataToBackend() {
        // Aqui você pode fazer uma requisição HTTP para enviar os dados JSON ao backend
        // Por exemplo, usando fetch() ou XMLHttpRequest
        // Substitua a URL pelo endpoint do seu backend
        var url = 'http://seu-backend.com/api/salvar_dados';
        fetch(url, {
            method: 'POST', // Método POST para enviar os dados
            headers: {
                'Content-Type': 'application/json' // Tipo de conteúdo JSON
            },
            body: JSON.stringify(jsonData) // Converte os dados JSON em uma string JSON
        })
        .then(response => {
            if (response.ok) {
                // Se a requisição foi bem sucedida, faça algo, como mostrar uma mensagem de sucesso
                console.log('Dados enviados com sucesso!');
            } else {
                // Se a requisição falhou, mostre uma mensagem de erro
                console.error('Erro ao enviar dados:', response.statusText);
            }
        })
        .catch(error => {
            // Se ocorreu um erro durante a requisição, mostre a mensagem de erro
            console.error('Erro ao enviar dados:', error);
        });
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

    // Adiciona um evento de clique ao botão "Enviar"
    var sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            sendJSONDataToBackend();
        });
    } else {
        console.error("Botão 'Enviar' não encontrado.");
    }
});
