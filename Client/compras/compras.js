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
                                        case 54: // Adicionamos o case para a linha 54
                                        case 57: // Adicionamos o case para a linha 57
                                            // Lógica para processar as informações de pedido com base no início do grupo
                                            isInfoPedido = true;
                                            isPedidoCompra = false;
                                            isInfoProdComprados = false;
                                            if (line !== '') {
                                                // Alteração para definir as informações do pedido conforme o novo formato
                                                switch (lineNumber) {
                                                    case 54:
                                                    case 57:
                                                        pedidoCompra = line;
                                                        break;
                                                }
                                            }
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
                                            prodComprado['quantidade_comprada'] = line; // Alterado de 'quant.' para 'quantidade'
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
                                            case 18:
                                                // Verifica se a linha contém o caractere "-" antes de tentar dividir a linha
                                                if (line.includes('-')) {
                                                    var parts = line.split('-');
                                                    // Verifica se o array resultante da divisão tem pelo menos dois elementos
                                                    if (parts.length >= 2) {
                                                        var descricao = parts[0]; // Remove tudo após o caractere "-"
                                                        prodComprado['medida'] = descricao.trim(); // Remove espaços em branco extras antes e depois da descrição
                                                    } else {
                                                        console.error("Formato de linha inválido para a medida:", line);
                                                        // Lidar com a situação em que a linha não está no formato esperado
                                                        // Por exemplo, definir um valor padrão para a medida ou deixá-la em branco
                                                        prodComprado['medida'] = ''; // Definindo medida como vazio
                                                    }
                                                } else {
                                                    console.error("Caractere '-' não encontrado na linha:", line);
                                                    // Lidar com a situação em que o caractere "-" não está presente na linha
                                                    // Por exemplo, definir um valor padrão para a medida ou deixá-la em branco
                                                    prodComprado['medida'] = ''; // Definindo medida como vazio
                                                }
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
                            editButton.classList.add('btn', 'btn-info', 'edit', 'mr-2');
                            editButton.addEventListener('click', function() {
                                editRow(row); // Função para editar os dados da linha
                            });

                            var editIcon = document.createElement('img');
                            editIcon.src = 'media/edit_icon_128873.svg';
                            editIcon.alt = 'Edit';
                            editIcon.classList.add('edit-icon'); // Aplica a classe CSS ao elemento img
                            editButton.appendChild(editIcon);


                            var confirmButton = document.createElement('button');
                            confirmButton.classList.add('btn', 'confirm', 'btn-success');
                            confirmButton.addEventListener('click', function() {
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
        let url = 'http://localhost:5500/compras';
        axios.post(url, jsonData, {
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

    // Função para renomear as propriedades do objeto quantidade qualidade onda e medida
    function renameProperties(obj) {
        var newObj = {};
        newObj['numero_cliente'] = obj.cliente;
        newObj['quantidade_comprada'] = obj['quantidade_comprada']; // Renomeado de 'quant.' para 'quantidade'
        newObj['unidade'] = obj['unidade'];
        newObj['qualidade'] = obj['qualidade']; // Renomeado de 'qual.' para 'qualidade'
        newObj['onda'] = obj['onda'];
        newObj['gramatura'] = obj['gramatura'];
        newObj['peso_total'] = obj['peso_total']; // Renomeado de 'peso_lote_chapa' para 'peso_total'
        newObj['valor_unitario'] = obj['valor_kilo']; // Renomeado de 'coluna' para 'valor_kilo'
        newObj['valor_total'] = obj['valor_total']; // Renomeado de 'valor_lote_chapa' para 'valor_total'
        newObj['medida'] = obj['medida'];
        newObj['status'] = "COMPRADO";
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
})