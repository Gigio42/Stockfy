var dropzone = document.getElementById('dropzone');
var jsonData; // Variável global para armazenar os dados JSON processados
var dropEnabled = true; // Variável para controlar se o evento de solta (drop) está habilitado

// Evento de clique no dropzone
dropzone.addEventListener('click', openFilePicker);

// Adiciona um listener de evento de dragover no elemento document
document.addEventListener('dragover', function (event) {
    event.preventDefault(); // Impede o comportamento padrão de abrir o PDF no navegador
    event.stopPropagation();
    if (dropEnabled) {
        dropzone.classList.add('dragover');
    }
    return false; // Evita o comportamento padrão do navegador
});

// Adiciona um listener de evento de drop no elemento document
document.addEventListener('drop', function (event) {
    event.preventDefault(); // Impede o comportamento padrão de abrir o PDF no navegador
    event.stopPropagation();
    dropzone.classList.remove('dragover');

    if (dropEnabled) {
        var file = event.dataTransfer.files[0];
        console.log("Arquivo solto:", file.name);
        handleFile(file);
    }
});

function openFilePicker() {
    if (dropEnabled) {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf';
        fileInput.style.display = 'none';

        // Evento de mudança no input de arquivo
        fileInput.addEventListener('change', function (event) {
            var file = event.target.files[0];
            console.log("Arquivo selecionado:", file.name);
            handleFile(file);
        });

        // Simula o clique no input de arquivo
        fileInput.click();
    }
}



function handleFile(file) {
    console.log("Lendo arquivo:", file.name);
    var reader = new FileReader();

    reader.onload = function (event) {
        console.log("Arquivo lido com sucesso:", file.name);
        var pdfData = new Uint8Array(event.target.result);
        pdfjsLib.getDocument({ data: pdfData }).promise.then(function (pdf) {
            console.log("PDF processado com sucesso:", file.name);
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
                    var fullText = items.map(function (item) {
                        return item.str.trim().toLowerCase();
                    }).join(' ');

                    // Encontre a linha que contém o pedido de compra
                    var pedidoCompraLine = 0;

                    // Loop sobre cada item do texto
                    items.forEach(function (item, index) {
                        var line = item.str.trim();

                        if (isValoresExpressos) {
                            return; // Saímos do loop se chegarmos aos valores expressos
                        }

                        if (lineNumber === 1 || lineNumber === 15 || lineNumber === 23) {
                            isInfoPedido = true;
                            isInfoProdComprados = false;
                            if (line !== '') {
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
                            if ((lineNumber - 56) % 19 === 0) {
                                isInfoPedido = false;
                                isInfoProdComprados = true;
                                if (Object.keys(prodComprado).length !== 0) {
                                    // Adiciona o número do cliente ao objeto prodComprado
                                    infoProdComprados.push(renameProperties(removeEmptyProperties(prodComprado)));
                                    prodComprado = {};
                                }
                            }
                            if (line === 'Valores expressos em Reais') {
                                isValoresExpressos = true;
                                return;
                            }
                            if (isInfoProdComprados) {
                                switch ((lineNumber - 56) % 19) {
                                    case 1:
                                        prodComprado.cliente = line;
                                        break;
                                    case 3:
                                        prodComprado['quantidade_comprada'] = line;
                                        break;
                                    case 5:
                                        prodComprado.unidade = line;
                                        break;
                                    case 7:
                                        prodComprado['qualidade'] = line;
                                        break;
                                    case 9:
                                        prodComprado.onda = line;
                                        break;
                                    case 11:
                                        prodComprado['gramatura'] = line;
                                        break;
                                    case 13:
                                        prodComprado['peso_total'] = line;
                                        break;
                                    case 15:
                                        prodComprado['valor_kilo'] = line;
                                        break;
                                    case 17:
                                        prodComprado['valor_total'] = line;
                                        break;
                                    case 18:
                                        if (line.includes('-')) {
                                            var parts = line.split('-');
                                            if (parts.length >= 2) {
                                                var medidas = parts[0].match(/\d+(\.\d+)?/g); // Extrair apenas os números
                                                if (medidas && medidas.length == 2) {
                                                    var largura = medidas[0].trim().replace('.', ''); // Remover pontos da largura
                                                    var comprimento = medidas[1].trim().replace('.', ''); // Remover pontos do comprimento
                                                    var vincos = parts[1].trim().replace('VINCOS:', '').replace('vincos:', '').trim();
                                                    if (!vincos.includes('+')) {
                                                        vincos = 'não';
                                                    }
                                                    prodComprado['largura'] = largura; // Armazenar largura
                                                    prodComprado['comprimento'] = comprimento; // Armazenar comprimento
                                                    prodComprado['vincos'] = vincos;
                                                } else {
                                                    console.error("Formato de linha inválido para a medida:", line);
                                                    prodComprado['largura'] = '';
                                                    prodComprado['comprimento'] = '';
                                                    prodComprado['vincos'] = '';
                                                }
                                            } else {
                                                console.error("Formato de linha inválido para a medida:", line);
                                                prodComprado['largura'] = '';
                                                prodComprado['comprimento'] = '';
                                                prodComprado['vincos'] = '';
                                            }
                                        } else {
                                            console.error("Caractere '-' não encontrado na linha:", line);
                                            prodComprado['largura'] = '';
                                            prodComprado['comprimento'] = '';
                                            prodComprado['vincos'] = '';
                                        }
                                        break;
                                }
                            }
                        }
                        lineNumber++;
                    });

                    // Extrair o número do pedido de compra do texto completo do PDF
                    var pedidoCompra = '';
                    var pedidoCompraMatch = fullText.match(/\b\d{2}\.\d{3}\b/);
                    if (pedidoCompraMatch) {
                        pedidoCompra = pedidoCompraMatch[0];
                        console.log("Número do pedido de compra:", pedidoCompra); // Adicionado para depuração
                    } else {
                        console.error("Número do pedido de compra não encontrado no PDF.");
                        pedidoCompra = '';
                    }


                    // Função para converter o id_compra no formato "xx.xxx" em um inteiro
                    function convertToInteger(idCompraStr) {
                        return parseInt(idCompraStr.replace(/\./g, ''));
                    }

                    // Obtém o valor do input de data prevista
                    var expectedDateInput = document.getElementById('expectedDate');

                    // Adiciona um evento de mudança para detectar quando a data for selecionada
                    expectedDateInput.addEventListener('change', function () {
                        // Obtém o valor da data selecionada
                        var dateValue = expectedDateInput.value;

                        // Atualiza o JSON com a data selecionada
                        jsonData = {
                            "info_prod_comprados": infoProdComprados.map(function (prod) {
                                return {
                                    ...prod,
                                    ...infoPedido,
                                    "id_compra": convertToInteger(pedidoCompra), // Incluído o ID de compra
                                    "data_prevista": dateValue
                                };
                            })
                        };

                        // Exibe o JSON atualizado no console
                        console.log("JSON atualizado com a data prevista:");
                        console.log(jsonData);
                    });



                    // Adiciona o JSON diretamente à tabela no modal
                    var dataTable = document.getElementById('dataTable');
                    if (dataTable) {
                        // Limpa a tabela antes de adicionar novos dados
                        dataTable.innerHTML = '';

                        // Adiciona o cabeçalho da tabela
                        var headerRow = dataTable.insertRow();
                        ['Quant. Comprada', 'Qualidade', 'Onda', 'Largura', 'Comprimento', 'Vincos'].forEach(function (header) {
                            var th = document.createElement('th');
                            th.textContent = header;
                            th.classList.add('table-header'); // Adiciona a classe 'table-header'
                            headerRow.appendChild(th);
                        });

                        // Loop sobre cada item de infoProdComprados
                        infoProdComprados.forEach(function (prod, index) {
                            var row = dataTable.insertRow(); // Insere uma nova linha na tabela

                            // Definir o atributo 'data-id' com o índice do item em infoProdComprados
                            row.setAttribute('data-id', index);

                            // Exibir as informações desejadas na tabela, incluindo 'largura', 'comprimento' e 'vincos'
                            var infoToShow = ['quantidade_comprada', 'qualidade', 'onda', 'largura', 'comprimento', 'vincos'];

                            infoToShow.forEach(function (info) {
                                var cell = row.insertCell(); // Insere uma nova célula na linha
                                cell.textContent = prod[info]; // Define o valor da célula como o valor do objeto
                            });

                            // Adiciona uma classe específica para cada linha, alternando entre duas classes para linhas pares e ímpares
                            row.classList.add(index % 2 === 0 ? 'even-row' : 'odd-row');

                            // Criação dos botões "Editar" e "Confirmar"
                            var buttonContainer = document.createElement('div');
                            buttonContainer.classList.add('button-container');

                            var editButton = document.createElement('button');
                            editButton.classList.add('btn', 'btn-info', 'edit', 'mr-2');
                            editButton.addEventListener('click', function () {
                                editRow(row); // Função para editar os dados da linha
                            });

                            var editIcon = document.createElement('img');
                            editIcon.src = 'media/edit_icon_128873.svg';
                            editIcon.alt = 'Edit';
                            editIcon.classList.add('edit-icon'); // Aplica a classe CSS ao elemento img
                            editButton.appendChild(editIcon);

                            var confirmButton = document.createElement('button');
                            confirmButton.classList.add('btn', 'confirm', 'btn-success');
                            confirmButton.addEventListener('click', function () {
                                confirmData(row); // Função para confirmar os dados da linha
                            });

                            // Criar um elemento SVG
                            var confirmIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                            confirmIcon.setAttribute("width", "24");
                            confirmIcon.setAttribute("height", "24");
                            confirmIcon.setAttribute("viewBox", "0 0 512 512");
                            confirmIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");

                            // Adicionar o conteúdo do SVG
                            confirmIcon.innerHTML = `
            <path fill="#0c9113" d="M505.942,29.589c-8.077-8.077-21.172-8.077-29.249,0L232.468,273.813l-55.971-55.971c-8.077-8.076-21.172-8.076-29.249,0    c-8.077,8.077-8.077,21.172,0,29.249l70.595,70.596c3.879,3.879,9.14,6.058,14.625,6.058c5.485,0,10.746-2.179,14.625-6.058    l258.85-258.85C514.019,50.761,514.019,37.666,505.942,29.589z"/>
            <path fill="#0c9113" d="M444.254,235.318c-11.423,0-20.682,9.26-20.682,20.682v164.722c0,14.547-11.835,26.381-26.381,26.381H67.746    c-14.547,0-26.381-11.835-26.381-26.381V91.277c0-14.547,11.835-26.381,26.381-26.381h258.85c11.423,0,20.682-9.26,20.682-20.682    c0-11.422-9.259-20.682-20.682-20.682H67.746C30.391,23.532,0,53.923,0,91.277v329.445c0,37.356,30.391,67.746,67.746,67.746    h329.445c37.355,0,67.746-30.39,67.746-67.746V256C464.936,244.578,455.677,235.318,444.254,235.318z"/>
        `;

                            // Adicionar o ícone ao botão
                            confirmButton.appendChild(confirmIcon);

                            // Insere os botões no container
                            buttonContainer.appendChild(editButton); // Adiciona o botão "Editar" ao container
                            buttonContainer.appendChild(confirmButton); // Adiciona o botão "Confirmar" ao container

                            // Insere o container de botões na última célula da linha na tabela
                            var lastCell = row.insertCell();
                            lastCell.appendChild(buttonContainer);
                        });

                        // Função para desativar o botão "Editar" após ser clicado
                        function disableEditButton(button) {
                            button.disabled = true; // Desativa o botão
                            button.classList.add('disabled'); // Adiciona a classe 'disabled' para aplicar o estilo
                        }

                        // Função para editar os dados da linha
                        function editRow(row) {
                            // Percorre todas as células da linha, exceto a última que contém os botões
                            for (var i = 0; i < row.cells.length - 1; i++) {
                                var cell = row.cells[i];
                                var text = cell.textContent.trim();
                                // Substitui o texto pela entrada de texto para edição
                                cell.innerHTML = '<input type="text" class="form-control" value="' + text + '">';
                            }
                            // Desativa o botão "Editar" da linha
                            var editButton = row.querySelector('.edit');
                            editButton.disabled = true; // Desativa o botão
                            editButton.classList.add('disabled'); // Adiciona a classe 'disabled' para alterar o estilo do botão

                            // Define a imagem dentro do botão como cinza
                            var editIcon = editButton.querySelector('.edit-icon');
                            editIcon.style.filter = 'grayscale(100%)'; // Torna a imagem cinza
                        }

                        // Função para confirmar os dados da linha
                        function confirmData(row) {
                            // Verifica se jsonData está definido e se possui a propriedade info_prod_comprados
                            if (jsonData && jsonData.info_prod_comprados) {
                                var rowId = row.getAttribute('data-id'); // Obtém o identificador exclusivo da linha
                                var rowData = jsonData.info_prod_comprados[rowId]; // Obtém os dados correspondentes no objeto jsonData

                                // Verifica se rowData está definido antes de atualizar seus valores
                                if (rowData) {
                                    // Atualiza os valores correspondentes no objeto jsonData com os valores das células editadas
                                    rowData.quantidade_comprada = row.cells[0].querySelector('input').value;
                                    rowData.qualidade = row.cells[1].querySelector('input').value;
                                    rowData.onda = row.cells[2].querySelector('input').value;
                                    rowData.largura = row.cells[3].querySelector('input').value;
                                    rowData.comprimento = row.cells[4].querySelector('input').value;
                                    rowData.vincos = row.cells[5].querySelector('input').value; // Adiciona vincos

                                    // Percorre todas as células da linha, exceto a última que contém os botões
                                    for (var i = 0; i < row.cells.length - 1; i++) {
                                        var cell = row.cells[i];
                                        var input = cell.querySelector('input');
                                        if (input) {
                                            // Atualiza o texto da célula com o valor do campo de entrada
                                            cell.textContent = input.value;
                                        }
                                    }

                                    // Reativa o botão "Editar" da linha
                                    var editButton = row.querySelector('.edit');
                                    editButton.disabled = false; // Ativa o botão
                                    editButton.classList.remove('disabled'); // Remove a classe 'disabled' para restaurar o estilo normal

                                    // Restaura a cor original da imagem dentro do botão
                                    var editIcon = editButton.querySelector('.edit-icon');
                                    editIcon.style.filter = 'none'; // Remove o efeito de escala de cinza
                                } else {
                                    console.error("Não foi possível encontrar os dados da linha no objeto jsonData.");
                                }
                            } else {
                                console.error("Objeto jsonData ou sua propriedade info_prod_comprados não estão definidos.");
                            }
                        }
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

        }).finally(function () {
            dropEnabled = true; // Reativa o evento de solta (drop) no documento
            console.log("Evento de solta reativado.");
        });
    };

    reader.readAsArrayBuffer(file);
}


function sendJSONDataToBackend() {
    let url = 'http://localhost:3000/compras';

    // Validar e converter tipos de dados
    var jsonDataToSend = JSON.parse(JSON.stringify(jsonData), function (key, value) {
        // Se o valor for uma string e contiver um número com ponto decimal, converter para inteiro
        if (typeof value === 'string' && !isNaN(value) && value !== '') {
            // Remover pontos decimais e converter para inteiro
            var intValue = parseInt(value.replace(/\./g, ''));
            return intValue;
        }
        // Caso contrário, manter o valor como está
        return value;
    });

    axios.post(url, jsonDataToSend, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(() => {
            console.log('Dados enviados com sucesso!');
        })
        .catch(error => {
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

// Dentro da função renameProperties
function renameProperties(obj) {
    var newObj = {};
    newObj['numero_cliente'] = obj.cliente;
    newObj['quantidade_comprada'] = obj['quantidade_comprada'];
    newObj['unidade'] = obj['unidade'];
    newObj['qualidade'] = obj['qualidade'];
    newObj['onda'] = obj['onda'];
    newObj['gramatura'] = obj['gramatura'];
    newObj['peso_total'] = obj['peso_total'];
    newObj['valor_unitario'] = obj['valor_kilo'];
    newObj['valor_total'] = obj['valor_total'];
    newObj['largura'] = obj['largura']; // Adiciona largura
    newObj['comprimento'] = obj['comprimento']; // Adiciona comprimento
    newObj['vincos'] = obj['vincos'];
    newObj['status'] = "COMPRADO";
    return newObj;
}

// Obtém o valor do input de data prevista
var expectedDateInput = document.getElementById('expectedDate');

// Adiciona um evento de clique ao botão "Enviar"
var sendButton = document.getElementById('sendButton');
if (sendButton) {
    sendButton.addEventListener('click', function () {
        // Verifica se o valor do input de data está vazio
        if (expectedDateInput.value === '') {
            // Adiciona uma classe ao input de data para destacá-lo como inválido
            expectedDateInput.classList.add('invalid-date');
            console.error("A data prevista não foi selecionada.");
            return; // Impede o envio do JSON se a data prevista não estiver selecionada
        }

        // Se a data prevista estiver selecionada, envie o JSON para o backend
        sendJSONDataToBackend();
    });
} else {
    console.error("Botão 'Enviar' não encontrado.");
}



// Adiciona um evento de clique ao botão "Editar"
var editButton = document.getElementById('editButton');
if (editButton) {
    editButton.addEventListener('click', function () {
        var jsonContent = document.getElementById('jsonContent');
        if (jsonContent) {
            // Exibe o conteúdo JSON formatado no elemento com id 'jsonContent'
            jsonContent.textContent = JSON.stringify(jsonData, null, 2);
            jsonContent.style.display = 'block'; // Exibe o elemento
        } else {
            console.error("Elemento 'jsonContent' não encontrado.");
        }
    });
} else {
    console.error("Botão 'Editar' não encontrado.");
}

