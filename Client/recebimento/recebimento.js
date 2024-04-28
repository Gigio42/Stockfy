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

    var today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

    for (var i = 0; i < products.length; i++) {
        var product = products[i];
        var xPed = product.getElementsByTagName("xPed")[0].textContent;
        var qCom = product.getElementsByTagName("qCom")[0].textContent;
        var vUnCom = product.getElementsByTagName("vUnCom")[0].textContent;
        var vProd = product.getElementsByTagName("vProd")[0].textContent;
        var xProd = product.getElementsByTagName("xProd")[0].textContent;

        var qualidade = xProd.match(/-QUAL\.(.*)-MED\./)[1];
        var medida = xProd.match(/-MED\.(.*)--REF\./)[1];
        var tipoOnda = xProd.match(/ONDA (.*?)-SEU PEDIDO/)[1];
        var vincada = /VINCADA/.test(xProd) ? "Sim" : "Não";

        var purchaseDate = extractPurchaseDate(xmlDoc);
        var supplier = extractSupplier(xmlDoc);

        var row = table.insertRow();
        row.insertCell().textContent = supplier;
        row.insertCell().textContent = purchaseDate;

        [xPed, qCom, vUnCom, vProd, qualidade, medida, tipoOnda, vincada].forEach(text => {
            row.insertCell().textContent = text;
        });

        var statusCell = row.insertCell();
        statusCell.innerHTML = '<select><option>Comprado</option><option>Recebido</option><option>Parcialmente</option><option>Atrasado</option><option>Cancelado</option></select>';

        var dateCell = row.insertCell();
        dateCell.innerHTML = '<input type="date" value="' + today + '">';

        // Add update button
        var updateCell = row.insertCell();
        updateCell.innerHTML = '<button class="update-button">Atualizar</button>';
    }
}

function extractPurchaseDate(xmlDoc) {
    var dhEmi = xmlDoc.getElementsByTagName("dhEmi")[0].textContent;
    var datePart = dhEmi.split('T')[0];
    var dateComponents = datePart.split('-');
    return dateComponents[2] + '/' + dateComponents[1] + '/' + dateComponents[0];
}

function extractSupplier(xmlDoc) {
    var verProc = xmlDoc.getElementsByTagName("verProc")[0].textContent;
    return verProc.replace("Emissor ", "");
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
        body.style.color = '#000';
        output.style.color = '#000';
    }
}