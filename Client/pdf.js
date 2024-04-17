let allCellsData = [];

// Função para lidar com a seleção de arquivos arrastados
function handleFileSelect(event) {
    // Evita a ação padrão do navegador
    event.stopPropagation();
    event.preventDefault();

    // Obtém os arquivos arrastados
    const files = event.dataTransfer.files;
    // Obtém a div onde os padrões serão exibidos
    const patternsDiv = document.getElementById("patterns");
    // Limpa o conteúdo anterior da div
    patternsDiv.innerHTML = "";

    // Cria uma tabela para exibir os padrões
    const table = document.createElement("table");
    table.classList.add("table");

    // Cria o cabeçalho da tabela
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");
    // Cria as colunas do cabeçalho
    const columns = ["Qualidade", "Medida", "Quantidade", "Vincos"];
    columns.forEach(columnText => {
        const th = document.createElement("th");
        th.scope = "col";
        th.innerText = columnText;
        trHead.appendChild(th);
    });
    // Adiciona o cabeçalho à tabela
    thead.appendChild(trHead);
    table.appendChild(thead);

    // Itera sobre os arquivos
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        // Evento disparado quando o arquivo é lido
        reader.onload = function(e) {
            const xmlString = e.target.result;
            const xmlDoc = new DOMParser().parseFromString(xmlString, "text/xml");
            const detElements = xmlDoc.getElementsByTagName("det");

            // Itera sobre os elementos "det" do XML
            for (let j = 0; j < detElements.length; j++) {
                const prodElement = detElements[j].getElementsByTagName("prod")[0];
                const descricao = prodElement.getElementsByTagName("xProd")[0].textContent;
                const quantidade = parseFloat(prodElement.getElementsByTagName("qCom")[0].textContent);
                const { padrao, info, vincos } = extrairPadraoEInfo(descricao);

                // Verifica se o padrão foi encontrado
                if (padrao) {
                    // Cria uma linha na tabela para exibir os dados
                    const tbody = document.createElement("tbody");
                    const trBody = document.createElement("tr");
                    // Cria as células com os dados
                    const cellsData = [padrao, info, quantidade, vincos ? "Sim" : "Não"];
                    allCellsData.push(cellsData);
                    cellsData.forEach(cellText => {
                        const td = document.createElement("td");
                        td.innerText = cellText;
                        trBody.appendChild(td);
                    });
                    // Adiciona a linha à tabela
                    tbody.appendChild(trBody);
                    table.appendChild(tbody);
                }
            }

            // Adiciona a tabela à div de padrões
            patternsDiv.appendChild(table);
        };

        // Lê o arquivo como texto
        reader.readAsText(file);
    }

    // Exibe a div de padrões
    document.getElementById("output").style.display = "block";
}

// Função para extrair padrão e informações do texto da descrição
function extrairPadraoEInfo(texto) {
    const regex = /-(.*?)\-MED\./;
    const matches = texto.match(regex);
    if (matches && matches.length > 1) {
        // Remove "QUAL." do padrão, se presente
        let padrao = matches[1].replace("QUAL.", "");
        const medidaRegex = /\b0?(\d{4})x(\d{4})\b/g; // Adicionado um 0 opcional
        const medidaMatch = texto.match(medidaRegex);
        let medida = medidaMatch ? medidaMatch[0] : null;
        if (medida) {
            medida = medida.replace(/^0/, ""); // Remove o zero inicial do primeiro número
            const numeros = medida.split("x");
            medida = numeros[1] + "x" + numeros[0];
        }
        const vincos = texto.includes("VINCOS");
        return { padrao, info: medida ? `${medida}` : "Medida não encontrada", vincos };
    }
    return { padrao: null, info: null, vincos: false };
}

// Função para lidar com a sobreposição de arrastar
function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}


// Parte para mandar para o servidor
function sendData() {
/*     if (!allCellsData.length) {
        console.error('Nenhuma informação para enviar');
        return;
    } */
    console.log(allCellsData);

    fetch('http://localhost:5500/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(allCellsData)
    })
    .then(response => response.json())
    .then(data => console.log(data.message))
    .catch((error) => {
        console.error('Error:', error);
    });

}
document.getElementById('sendDataButton').addEventListener('click', sendData);