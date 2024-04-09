function handleFileSelect(event) {
    event.stopPropagation();
    event.preventDefault();

    const files = event.dataTransfer.files;
    const patternsDiv = document.getElementById("patterns");
    patternsDiv.innerHTML = ""; // Limpa o conteúdo anterior

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function(e) {
            const xmlString = e.target.result;
            const xmlDoc = new DOMParser().parseFromString(xmlString, "text/xml");
            const xProdElements = xmlDoc.getElementsByTagName("xProd");

            let patternFound = false;

            for (let j = 0; j < xProdElements.length; j++) {
                const texto = xProdElements[j].textContent;
                const { padrao, info } = extrairPadraoEInfo(texto);
                if (padrao) {
                    patternFound = true;
                    const patternElement = document.createElement("p");
                    patternElement.innerText = `${padrao} - ${info}`;
                    patternsDiv.appendChild(patternElement);
                }
            }

            if (patternFound) {
                document.getElementById("output").style.display = "block";
            } else {
                const noPatternElement = document.createElement("p");
                noPatternElement.innerText = "Nenhum padrão encontrado.";
                patternsDiv.appendChild(noPatternElement);
                document.getElementById("output").style.display = "block";
            }
        };

        reader.readAsText(file);
    }
}

function extrairPadraoEInfo(texto) {
    const regex = /-(.*?)\-MED\./;
    const matches = texto.match(regex);
    if (matches && matches.length > 1) {
        const padrao = matches[1];
        const medidaRegex = /\b0?(\d{4})x(\d{4})\b/g; // Adicionado um 0 opcional
        const medidaMatch = texto.match(medidaRegex);
        let medida = medidaMatch ? medidaMatch[0] : null;
        if (medida) {
            medida = medida.replace(/^0/, ""); // Remove o zero inicial do primeiro número
            const numeros = medida.split("x");
            medida = numeros[1] + "x" + numeros[0];
        }
        return { padrao, info: medida ? `Medida: ${medida}` : "Medida não encontrada" };
    }
    return { padrao: null, info: null };
}


function handleDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
}