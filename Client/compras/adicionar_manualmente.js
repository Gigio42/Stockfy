abrirModal()
function abrirModal() {
    var modal = document.getElementById('mModal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Modal não encontrado.");
    }
}
// Função para adicionar uma chapa e criar um card com as informações
function addPlate() {
    // Seleciona todos os campos de entrada dentro do formulário
    var formInputs = document.querySelectorAll('#purchaseForm input[type="text"]');
    
    // Cria um objeto para armazenar os valores
    var plateInfo = {};

    // Nomes dos campos
    var fieldNames = [
        "Número Cliente",
        "Quantidade Comprada",
        "Qualidade",
        "Onda",
        "Gramatura",
        "Peso Total",
        "Valor Unitário",
        "Valor Total",
        "Largura",
        "Comprimento",
        "Vincos",
        "Fornecedor",
        "ID Compra"
    ];

    // Itera sobre os campos de entrada para obter seus valores e atribuí-los ao objeto
    formInputs.forEach(function(input, index) {
        plateInfo[fieldNames[index]] = input.value;
    });

    // Exibe o objeto no console para verificação
    console.log("Objeto da chapa:", plateInfo);

    // Cria um elemento div para representar o card
    var cardDiv = document.createElement("div");
    cardDiv.classList.add("card");

    // Cria um elemento div para representar o conteúdo do card
    var cardContentDiv = document.createElement("div");
    cardContentDiv.classList.add("card-content");

    // Itera sobre as propriedades do objeto e cria elementos HTML para exibir os dados
    for (var key in plateInfo) {
        if (plateInfo.hasOwnProperty(key)) {
            var p = document.createElement("p");
            p.textContent = key + ": " + plateInfo[key];
            cardContentDiv.appendChild(p);
        }
    }

    // Adiciona o conteúdo do card ao elemento do card
    cardDiv.appendChild(cardContentDiv);

    // Seleciona a div table-container
    var tableContainer = document.querySelector('.table-container');

    // Adiciona o card à div table-container
    tableContainer.appendChild(cardDiv);
}

// Adiciona um ouvinte de evento para o botão de adicionar chapa
document.getElementById("addPlateButton").addEventListener("click", addPlate);
