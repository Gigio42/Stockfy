
document.getElementById('drop_zone').addEventListener('dragover', function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
});

document.getElementById('drop_zone').addEventListener('drop', function(event) {
    event.preventDefault();
    var file = event.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
        var xml = event.target.result;
        parseXML(xml);
        document.getElementById('drop_zone').style.display = 'none';
        document.getElementById('output').style.display = 'table';
    };
    reader.readAsText(file);
});

function parseXML(xml) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, "application/xml");
    var products = xmlDoc.getElementsByTagName("det");
    var table = document.getElementById('output').getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    var supplier = extractSupplier(xmlDoc);

    Array.from(products).forEach(product => {
        switch(supplier) {
            case "PENHA":
                var prodDetails = prod_Penha(product);
                criarProd(table, product, prodDetails, xmlDoc);
                break;
            case "FERNANDEZ":
                var prodDetails = prod_Fernandez(product);
                criarProd(table, product, prodDetails, xmlDoc);
                break;
            case "Irani":
                var prodDetails = prod_Irani(product);
                criarProd(table, product, prodDetails, xmlDoc);
                break;
            default:
                // Handle case where no known supplier is found or do nothing
                break;
        }
    });
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


function criarProd(table, product, prodDetails, xmlDoc) {
    var row = table.insertRow(-1);
    var supplier = extractSupplier(xmlDoc);
    var purchaseDate = extractPurchaseDate(xmlDoc);

    var xPed = product.getElementsByTagName("xPed")[0].textContent;
    var qCom = parseFloat(product.getElementsByTagName("qCom")[0].textContent).toString();
    var vUnCom = parseFloat(product.getElementsByTagName("vUnCom")[0].textContent).toFixed(2);

    var cellContents = [
        `<input type='text' value='${supplier}'>`,
        `<input type='date' value='${formatDate(purchaseDate)}'>`,
        `<input type='text' value='${xPed}'>`,
        `<input type='text' class='quantity' value='${qCom}' oninput='calculateTotal(this)'>`,
        '<div class="currency-input"><span class="currency-symbol">R$</span><input type="text" class="currency" value="' + vUnCom + '" oninput="calculateTotal(this, \'unit\')"></div>',
        '<div class="currency-input"><span class="currency-symbol">R$</span><span class="currency total">' + (qCom * vUnCom).toFixed(2) + '</span></div>',
        `<input type='text' value='${prodDetails.qualidade}'>`,
        `<input type='text' value='${prodDetails.medida}'>`,
        `<select>${["E", "B", "C", "BB", "BC", ""].map(type => `<option value="${type}" ${type === prodDetails.tipoOnda ? "selected" : ""}>${type}</option>`).join("")}</select>`,
        `<select><option value="">Vazio</option><option value="Sim" ${"Sim" === prodDetails.vincada ? "selected" : ""}>Sim</option><option value="Não" ${"Não" === prodDetails.vincada ? "selected" : ""}>Não</option></select>`,
        `<select style='width: 120px;'>${["Comprado", "Recebido", "Parcialmente", "Atrasado", "Cancelado"].map(status => `<option>${status}</option>`).join("")}</select>`,
        `<input type='date' value='${new Date().toISOString().slice(0, 10)}'>`,
        `<button class='update-button'>Atualizar</button>`
    ];

    cellContents.forEach(content => {
        var cell = row.insertCell();
        cell.innerHTML = content;
    });
}

function extractPurchaseDate(xmlDoc) {
    var dhEmi = xmlDoc.getElementsByTagName("dhEmi")[0].textContent;
    var datePart = dhEmi.split('T')[0];
    var dateComponents = datePart.split('-');
    return dateComponents[2] + '/' + dateComponents[1] + '/' + dateComponents[0];
}

function extractSupplier(xmlDoc) {
    var xNome = xmlDoc.getElementsByTagName("emit")[0].getElementsByTagName("xNome")[0].textContent;
    if (xNome.includes("PENHA")) {
        return "PENHA";
    } else if (xNome.includes("FERNANDEZ")) {
        return "FERNANDEZ";
    } else if (xNome.includes("Irani")) {
        return "Irani";
    } else {
        return ""; // Caso não encontre nenhum fornecedor conhecido
    }
}


function toggleDropZone() {
    var dropZone = document.getElementById('drop_zone');
    var output = document.getElementById('output');
    if (dropZone.style.display === 'none') {
        dropZone.style.display = 'block';
        output.style.display = 'none';
    } else {
        dropZone.style.display = 'none';
        output.style.display = 'table';
    }
}

function toggleTheme() {
    var body = document.body;
    var output = document.getElementById('output');
    body.classList.toggle('light-mode');
    
    if (body.classList.contains('light-mode')) {
        body.style.backgroundColor = '#fff';
        body.style.color = '#333';
        output.style.color = '#333';
    } else {
        body.style.backgroundColor = '#333';
        body.style.color = '#fff';
        output.style.color = '#fff';
    }
}

function calculateTotal(input, type = 'quantity') {
    let row = input.closest('tr');
    let quantityInput = row.querySelector('.quantity');
    let unitPriceInput = row.querySelector('.currency-input .currency');
    let totalPriceDisplay = row.querySelector('.currency-input .total');

    let quantity = parseFloat(quantityInput.value) || 1;
    let unitPrice = parseFloat(unitPriceInput.value) || 0;

    let totalPrice = (quantity * unitPrice).toFixed(2);
    totalPriceDisplay.textContent = totalPrice;
}

function formatDate(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
