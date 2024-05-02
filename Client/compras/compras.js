document.addEventListener('DOMContentLoaded', function() {
    var dropzone = document.getElementById('dropzone');
    var jsonData; // Variável global para armazenar os dados JSON processados

    // Evento de clique no dropzone
    dropzone.addEventListener('click', openFilePicker);

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
                                            prodComprado['quantidade'] = line; // Alterado de 'quant.' para 'quantidade'
                                            break;
                                        case 5:
                                            prodComprado.unidade = line;
                                            break;
                                        case 7:
                                            prodComprado['qualidade'] = line; // Alterado de 'qual.' para 'qualidade'
                                            break;
                                        case 9:
                                            prodComprado.onda = line;
                                            break;
                                        case 11:
                                            prodComprado['gramatura'] = line;
                                            break;
                                        case 13:
                                            prodComprado['peso_total'] = line; // Alterado de 'peso_lote_chapa' para 'peso_total'
                                            break;
                                        case 15:
                                            prodComprado['valor_kilo'] = line; // Renomeado de 'coluna' para 'valor_kilo'
                                            break;
                                        case 17:
                                            prodComprado['valor_total'] = line; // Alterado de 'valor_lote_chapa' para 'valor_total'
                                            break;
                                        // Dentro da função handleFile()
                                        case 18:
                                            var descricao = line.split('-')[0]; // Remove tudo após o caractere "-"
                                            prodComprado['medida'] = descricao.trim(); // Remove espaços em branco extras antes e depois da descrição
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

    // Exibir apenas as informações desejadas na tabela
    var infoToShow = ['quantidade', 'qualidade', 'onda', 'medida'];
    infoToShow.forEach(function(info) {
        var cell = row.insertCell(); // Insere uma nova célula na linha
        cell.textContent = prod[info]; // Define o valor da célula como o valor do objeto
    });

    // Adiciona uma classe específica para cada linha, alternando entre duas classes para linhas pares e ímpares
    row.classList.add(index % 2 === 0 ? 'even-row' : 'odd-row');

    // Criação dos botões "Editar" e "Confirmar"
    var buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    var editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('btn', 'btn-info', 'mr-2');
    editButton.addEventListener('click', function() {
        editRow(row); // Função para editar os dados da linha
    });

    var confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirmar';
    confirmButton.classList.add('btn', 'btn-success');
    confirmButton.addEventListener('click', function() {
        confirmData(row); // Função para confirmar os dados da linha
    });

    // Insere os botões no container
    buttonContainer.appendChild(editButton); // Adiciona o botão "Editar" ao container
    buttonContainer.appendChild(confirmButton); // Adiciona o botão "Confirmar" ao container

    // Insere o container de botões na última célula da linha na tabela
    var lastCell = row.insertCell();
    lastCell.appendChild(buttonContainer);
});

// Função para editar os dados da linha
function editRow(row) {
    // Percorre todas as células da linha, exceto a última que contém os botões
    for (var i = 0; i < row.cells.length - 1; i++) {
        var cell = row.cells[i];
        var text = cell.textContent.trim();
        // Substitui o texto pela entrada de texto para edição
        cell.innerHTML = '<input type="text" class="form-control" value="' + text + '">';
    }
}

// Função para confirmar os dados da linha
function confirmData(row) {
    // Percorre todas as células da linha, exceto a última que contém os botões
    for (var i = 0; i < row.cells.length - 1; i++) {
        var cell = row.cells[i];
        var input = cell.querySelector('input');
        if (input) {
            // Atualiza o texto da célula com o valor do campo de entrada
            cell.textContent = input.value;
        }
    }
}






                            // Adiciona bordas arredondadas às linhas da tabela
                            addRoundedBordersToTableRows();
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

    // Função para renomear as propriedades do objeto quantidade qualidade onda e medida
    function renameProperties(obj) {
        var newObj = {};
        newObj['cliente'] = obj['cliente'];
        newObj['quantidade'] = obj['quantidade']; // Renomeado de 'quant.' para 'quantidade'
        newObj['unidade'] = obj['unidade'];
        newObj['qualidade'] = obj['qualidade']; // Renomeado de 'qual.' para 'qualidade'
        newObj['onda'] = obj['onda'];
        newObj['gramatura'] = obj['gramatura'];
        newObj['peso_total'] = obj['peso_total']; // Renomeado de 'peso_lote_chapa' para 'peso_total'
        newObj['valor_kilo'] = obj['valor_kilo']; // Renomeado de 'coluna' para 'valor_kilo'
        newObj['valor_total'] = obj['valor_total']; // Renomeado de 'valor_lote_chapa' para 'valor_total'
        newObj['medida'] = obj['medida'];
        return newObj;
    }

    function addRoundedBordersToTableRows() {
        var tableRows = document.querySelectorAll('#dataTable tbody tr');
        tableRows.forEach(function(row) {
            row.classList.add('rounded-rows'); // Adiciona a classe de bordas arredondadas a cada linha
        });
    }

    // Adiciona um evento de clique ao botão "Enviar"
    var sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', sendJSONDataToBackend);
    } else {
        console.error("Botão 'Enviar' não encontrado.");
    }

    // Adiciona um evento de clique ao botão "Editar"
    var editButton = document.getElementById('editButton');
    if (editButton) {
        editButton.addEventListener('click', function() {
            var jsonContent = document.getElementById('jsonContent');
            if (jsonContent) {
                jsonContent.textContent = JSON.stringify(jsonData, null, 2);
                jsonContent.style.display = 'block';
            } else {
                console.error("Elemento 'jsonContent' não encontrado.");
            }
        });
    } else {
        console.error("Botão 'Editar' não encontrado.");
    }
});
