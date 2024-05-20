//PDF

function extractText(data) {
    pdfjsLib.getDocument(data).promise.then(function(pdf) {
        var numPages = pdf.numPages;
        var promises = [];
        for (var i = 1; i <= numPages; i++) {
            promises.push(pdf.getPage(i).then(function(page) {
                return page.getTextContent().then(function(textContent) {
                    return textContent.items.map(item => item.str).join(' ');
                });
            }));
        }

        Promise.all(promises).then(function(pageTexts) {
            var fullText = pageTexts.join('\n').toUpperCase();
            processText(fullText);
        }).catch(function(error) {
            console.error('Erro ao extrair texto:', error);
        });
    });
}

function processText(text) {
    if (text.includes('FERNANDEZ')) {
        var result = fernandez(text);
        const tablef = document.getElementById('recebimento').getElementsByTagName('tbody')[0];
        const uniqueIds = new Set(); // Conjunto para armazenar IDs únicos

        // Primeiro acumula todos os IDs de compra únicos
        result.forEach(obj => {
            if (Array.isArray(obj.id_compra)) {
                obj.id_compra.forEach(id => uniqueIds.add(id)); // Adiciona cada ID ao conjunto
            } else {
                uniqueIds.add(obj.id_compra); // Adiciona o ID ao conjunto
            }
        });

        // Prepara chamadas de fetchChapas e acumula promessas
        const fetchPromises = [];
        uniqueIds.forEach(id => {
            const fetchPromise = fetchChapas(id);
            fetchPromises.push(fetchPromise);
        });

        // Espera todas as fetchChapas terminarem
        Promise.all(fetchPromises).then(() => {
            // Depois que todas as chamadas forem concluídas, processa cada objeto para criar a tabela
            result.forEach(obj => {
                criarTable(tablef, obj);
            });
        }).catch(error => {
            console.error('Erro durante a busca de chapas:', error);
        });
} else if (text.includes('PENHA')) {
    var result = penha(text); // result é um array de objetos
    const tablep = document.getElementById('recebimento').getElementsByTagName('tbody')[0];
    const processedIds = new Set(); // Set para armazenar ids únicos

    result.forEach(obj => {
        if (!processedIds.has(obj.id_compra)) {
            fetchChapas(obj.id_compra); // Executa se o id_compra ainda não foi processado
            processedIds.add(obj.id_compra); // Adiciona o id_compra ao Set
        }
    });

    result.forEach(obj => criarTable(tablep, obj)); // Criar uma linha para cada objeto
} else if (text.includes('IRANI')) {
    var result = irani(text); // result é um array de objetos
    const tablep = document.getElementById('recebimento').getElementsByTagName('tbody')[0];
    const processedIds = new Set(); // Set para armazenar ids únicos

    result.forEach(obj => {
        if (!processedIds.has(obj.id_compra)) {
            fetchChapas(obj.id_compra); // Executa se o id_compra ainda não foi processado
            processedIds.add(obj.id_compra); // Adiciona o id_compra ao Set
        }
    });

    result.forEach(obj => criarTable(tablep, obj)); // Criar uma linha para cada objeto
} else {
console.log('Não encontrou o fornecedor');
}
}



function penha(fullText) {
    var descricaoIndex = fullText.indexOf('DESCRIÇÃO DOS PRODUTOS/SERVIÇOS CÓDIGO');
    if (descricaoIndex === -1) {
        console.warn('Palavra-chave "DESCRIÇÃO DOS PRODUTOS/SERVIÇOS CÓDIGO" não encontrada.');
        return [];
    }
    var dadosIndex = fullText.indexOf('DADOS', descricaoIndex);
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
        return match.replace('-MED.', ' ');
    }

    var result = text.replace(/\bUN\b|\bCHAPA DE PAP\. ONDUL\.-QUAL\.\b|\b--REF\.: CHAPA\b|\bONDA\b|\b-SEU PEDI DO\b|\b-N\/PEDIDO:\b|\b000\b|\b-N\/PEDIDO\b|\b-SEU PEDI DO\b|\b:\b/g, '');
    result = result.replace(/VINCADA.*?\d.*?:/g, function(match) {
        return match.replace(/\d.*?:/, ':');
    });
    result = result.replace(/-SEU PEDI  DO\b/g, '');
    result = result.replace(/:/g, '');
    result = result.replace(/-SEU/g, '');
    result = result.replace(/PEDIDO/g, ''); 
    result = result.replace(/(.*?)-MED\.(.*?)/g, replaceMed);

    var resultArray = result.split(/\s+/).filter(Boolean);
    return organizarpenha(resultArray);
}

function organizarpenha(array) {
    var indexesToRemove = [0, 1, 2, 5, 6, 8, 9, 12, 17];
    var newArray = [];
    for (var i = 0; i < array.length; i += 18) {
        var subArray = array.slice(i, i + 18);


        if (subArray.length > 0) {
            for (var j = 0; j < indexesToRemove.length; j++) {
                var index = indexesToRemove[j];
                if (subArray[index]) {
                    delete subArray[index];
                }
            }
            subArray = subArray.filter(item => item !== undefined);

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
    let id_compra = array[7] || '';
    const slashIndex = id_compra.indexOf('/');
    if (slashIndex !== -1) {
        id_compra = id_compra.substring(0, slashIndex);
    }
    id_compra = id_compra.replace(/\./g, '');

    var qRec = parseFloat(array[2].replace(/[,.]/g, ''));
    var valorUnitario = parseFloat(array[1].replace(',', '.')); // Correção para formato de número
    var valor_total = parseFloat(array[0].replace('.', '').replace(',', '.'));

    return {
        id_compra: (id_compra || '').trim(),
        fornecedor: 'Penha',
        qualidade: array[3] || '',
        medida: array[4] || '',
        onda: array[6] || '',
        vincos: array[5] || '',
        valor_unitario: valorUnitario || '0', // Verificação e correção
        quantidade_recebida: qRec || '',
        valor_total: valor_total
    };
}


function irani(fullText) {
    var descricaoIndex = fullText.indexOf('ALÍQ. IPI');
    if (descricaoIndex === -1) {
        console.warn('Palavra-chave "ALÍQ. IPI" não encontrada.');
        return [];
    }
    var dadosIndex = fullText.indexOf('DADOS', descricaoIndex);
    if (dadosIndex === -1) {
        console.warn('Palavra-chave "DADOS" não encontrada.');
        return [];
    }
    var relevantText = fullText.substring(descricaoIndex + 10, dadosIndex);
    var resultArray = relevantText.split(/\s+/).filter(Boolean);
    var idCompra = id_compraI(fullText)
    return organizarirani(resultArray, idCompra);
}

function id_compraI(fullText) {
    var aiIndex = fullText.indexOf('PEDIDO(S):');
    if (aiIndex === -1) {
        console.warn('Palavra-chave "PEDIDO(S):" não encontrada.');
        return [];
    }
    var dadosIndex = fullText.indexOf('LOTE(S):', aiIndex);
    if (dadosIndex === -1) {
        console.warn('Palavra-chave "LOTE(S):" não encontrada.');
        return [];
    }
    var relevantText = fullText.substring(aiIndex + 10, dadosIndex);
    relevantText = relevantText.replace(/\./g, '').replace(/\//g, '').replace('INCLUSAO', '');
    var resultArray = relevantText.split(/\s+/).filter(Boolean);
    return resultArray;
}




function organizarirani(array, idCompra) {
    var indexesToRemove = [1, 2, 3, 6, 8, 9, 10, 11, 12, 13, 19, 20, 21, 22];
    var newArray = [];
    for (var i = 0; i < array.length; i += 23) {
        var subArray = array.slice(i, i + 23);
        if (subArray.length > 0) {
            var filteredSubArray = subArray.filter((item, index) => !indexesToRemove.includes(index));
            var filteredAndProcessed = filtroIrani(filteredSubArray);
            var objeto = criaObjIrani(filteredAndProcessed, idCompra);
            newArray.push(objeto);
        }
    }


    return newArray;
}

function filtroIrani(array) {
    var splitIndex = array.findIndex(item => item.includes('/'));
    if (splitIndex !== -1) {
        var parts = array[splitIndex].split('/');
        array.push(parts[0].trim());  // Adiciona a primeira parte no final do array
        array.push(parts[1].trim());  // Adiciona a segunda parte no final do array
        array.splice(splitIndex, 1);  // Remove o elemento original que continha a barra
    }
    array = array.map(item => item.replace(/\bMIL\b/gi, "1000"));
    return array;
}

function criaObjIrani(array, idCompra) {
    return {
        id_compra: idCompra,
        fornecedor: 'Irani',
        qualidade: array[8],
        medida: array[1] + 'X' + array[2],
        onda: array[9],
        vincos: '', // Vazio como solicitado
        quantidade_recebida: array[4],
        valor_unitario: array[6].replace('.', '') || '0',
        valor_total: array[7].replace(',', '.') || '0',
    };
}


function fernandez(fullText) {
    var aiIndex = fullText.indexOf('A.IPI');
    if (aiIndex === -1) {
        console.warn('Palavra-chave "A.IPI" não encontrada.');
        return [];
    }
    var relevantText = fullText.substring(aiIndex + 5).replace(/UN|000/g, '');
    var resultArray = relevantText.split(/\s+/).filter(Boolean);
    var idCompra = id_compraF(fullText)
    return organizarFernandez(resultArray, idCompra);
}

function organizarFernandez(array, idCompra) {
    var indexesToRemove = [2, 3, 8, 9, 10, 11];
    var newArray = [];
    for (var i = 0; i < array.length; i += 12) {
        var subArray = array.slice(i, i + 12);
        if (subArray.length > 1) {
            var filteredSubArray = subArray.filter((item, index) => !indexesToRemove.includes(index));
            var filteredAndProcessed = filtroFernandez(filteredSubArray[1]);
            filteredSubArray.splice(1, 1);
            var objeto = criaObjFernandez([...filteredSubArray, ...filteredAndProcessed]);

            if (objeto.quantidade_recebida) {
                let quantidadeModificada = objeto.quantidade_recebida.replace(/\.|\,/g, (match) => (match === ',' ? '.' : ''));
                objeto.quantidade_recebida = parseFloat(quantidadeModificada).toString();
            }

            
            objeto.valor_unitario = objeto.valor_unitario.replace(/\./g, '').replace(/,/g, '.');
            objeto.valor_total = objeto.valor_total.replace(/\./g, '').replace(/,/g, '.');
            objeto.id_compra = idCompra;
            newArray.push(objeto);
        } 
    }
    return newArray;
}


function id_compraF(fullText) {
    var aiIndex = fullText.indexOf('PEDIDO DO CLIENTE:');
    if (aiIndex === -1) {
        console.warn('Palavra-chave "Pedido do Cliente:" não encontrada.');
        return [];
    }
    var dadosIndex = fullText.indexOf('PRODUTO', aiIndex);
    if (dadosIndex === -1) {
        console.warn('Palavra-chave "PRODUTO" não encontrada.');
        return [];
    }
    var relevantText = fullText.substring(aiIndex + 19, dadosIndex);
    relevantText = relevantText.replace(/\./g, '').replace('INCLUSAO', ''); // Remove ponto e a palavra INCLUSÃO
    var resultArray = relevantText.split(/\s+/).filter(Boolean);
    return resultArray;
}





function filtroFernandez(secondArray) {
    let parts = secondArray.split('-');
    let secondPart = parts.length > 1 ? parts[1] : "";
    let result = secondPart.split(/(\d.+)/, 2);
    return [...parts.slice(0, 1), ...result];
}

function criaObjFernandez(array) {
    return {
        id_compra: array[0],
        fornecedor: 'Fernandez',
        qualidade: array[5],
        medida: array[7],
        onda: array[6],
        vincos: '', 
        quantidade_recebida: array[1],
        valor_unitario: array[2],
        valor_total: array[3]
    };
}

//XML


function parseXML(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const products = xmlDoc.getElementsByTagName("det");
    const table = document.getElementById('recebimento').getElementsByTagName('tbody')[0];
    table.innerHTML = '';  // Limpa a tabela antes de adicionar novos dados

    const supplier = extractSupplier(xmlDoc);
    const prodFunc = { "Penha": prod_Penha, "Fernandez": prod_Fernandez, "Irani": prod_Irani };

    const uniqueIds = new Set();
    
    // Coletar todos os IDs de compra primeiro
    Array.from(products).forEach(product => {
        const prodDetails = prodFunc[supplier]?.(product);
        if (!prodDetails) return;

        const chapaData = data_Chapa(prodDetails, product, supplier, xmlDoc);
        uniqueIds.add(chapaData.id_compra);
    });

    // Prepara chamadas de fetchChapas e acumula promessas
    const fetchPromises = Array.from(uniqueIds).map(id => fetchChapas(id));

    // Espera todas as fetchChapas terminarem
    Promise.all(fetchPromises).then(() => {
        // Processar cada produto após a conclusão de todas as fetchChapas
        Array.from(products).forEach(product => {
            const prodDetails = prodFunc[supplier]?.(product);
            if (!prodDetails) return;

            const chapaData = data_Chapa(prodDetails, product, supplier, xmlDoc);
            criarTable(table, chapaData);  // Cria uma linha na tabela para cada chapaData
        });
    }).catch(error => {
        console.error('Erro durante a busca de chapas:', error);
    });
}


function extractSupplier(xmlDoc) {
    const xNome = xmlDoc.getElementsByTagName("emit")[0].getElementsByTagName("xNome")[0].textContent;
    const supplierMap = {
        "PENHA": "Penha",
        "FERNANDEZ": "Fernandez",
        "Irani": "Irani"
    };

    return Object.keys(supplierMap).find(key => xNome.includes(key)) ? supplierMap[Object.keys(supplierMap).find(key => xNome.includes(key))] : "";
}

    
function data_Chapa(prodDetails, product, supplier, xmlDoc) {
    const xPedContent = product.getElementsByTagName("xPed")[0].textContent;
    const slashIndex = xPedContent.indexOf('/');
    const cleanedText = slashIndex !== -1 ? xPedContent.substring(0, slashIndex) : xPedContent;
    const xPed = cleanedText.replace(/\D/g, '');
    const qCom = parseFloat(product.getElementsByTagName("qCom")[0].textContent) || 0;
    const vUnCom = parseFloat(product.getElementsByTagName("vUnCom")[0].textContent) || 0;
    const vProd = parseFloat(product.getElementsByTagName("vProd")[0].textContent) || 0;

    const { qualidade, medida, tipoOnda, vincada } = prodDetails;

    return {
        id_compra: xPed,
        fornecedor: supplier,
        qualidade: qualidade,
        medida: medida,
        onda: tipoOnda,
        quantidade_recebida: qCom,
        vincos: vincada,
        valor_unitario: vUnCom,
        valor_total: vProd
    };
}



function prod_Fernandez(product) {
    var xProd = product.getElementsByTagName("xProd")[0].textContent;
    var parts = xProd.split('-');
    var tipoOnda = parts.length > 1 ? parts[1].match(/[A-Za-z]+/)[0] : "";
    var startOfMeasure = parts[1].indexOf(tipoOnda) + tipoOnda.length;
    var medida = parts.length > 1 ? parts[1].substring(startOfMeasure).trim() : "";

    return {
        qualidade: parts[0] ? parts[0].trim() : "",
        medida: medida,
        tipoOnda: tipoOnda,
        vincada: "" // Always empty for Fernandez
    };
}


function prod_Irani(product) {
    var xProd = product.getElementsByTagName("xProd")[0].textContent;
    var qualidade = xProd.match(/OND\.(.*?)\//)[1].trim();
    var ondaEmedida = xProd.split('/')[1];
    var tipoOnda = ondaEmedida.match(/([A-Za-z]+) /)[1];
    var medida = ondaEmedida.match(/\d+ X \d+/)[0];

    return {
        qualidade: qualidade,
        medida: medida,
        tipoOnda: tipoOnda,
        vincada: "" // Sempre vazio para Irani
    };
}


function prod_Penha(product) {
    var xProd = product.getElementsByTagName("xProd")[0].textContent;
    return {
        qualidade: xProd.match(/-QUAL\.(.*)-MED\./)[1],
        medida: xProd.match(/-MED\.(.*)--REF\./)[1].replace(/^[^-]*-/,'').trim(),
        tipoOnda: xProd.match(/ONDA (.*?)-SEU PEDIDO/)[1],
        vincada: /VINCADA/.test(xProd) ? "Sim" : "Não"
    };
}