document.addEventListener('DOMContentLoaded', function() {
    // Adiciona o ouvinte ao elemento 'document' ou a algum contêiner mais específico que você sabe que estará no DOM
    document.body.addEventListener('click', function(event) {
        // Checa se o elemento clicado é o botão de atualizar
        if (event.target.classList.contains('update-button')) {
            sendDataToServer();
        }
    });
});



function sendDataToServer() {
    var data = tableObj();
    if (!data) {
        alert('Nenhum dado para enviar.');
        return;
    }
    console.log(data)
    axios.put('http://localhost:5500/recebimento', data)
    
        .then(function(response) {
            alert('Dados atualizados com sucesso!');
        })
        .catch(function(error) {
            console.error('Erro ao enviar dados: ', error);
            alert('Erro ao atualizar os dados: ' + error.message);
        });
}

function tableObj() {
    var table = document.getElementById('recebimento').getElementsByTagName('tbody')[0];
    var rows = table.rows;
    var data = [];

    for (let i = 0; i < rows.length; i++) {
        var row = rows[i];
        var rowData = {
            id_grupo_chapas: row.cells[0].querySelector('input').value,
            fornecedor: row.cells[1].querySelector('input').value,
            id_compra: row.cells[2].querySelector('input').value,
            quantidade_recebida: parseFloat(row.cells[3].querySelector('input').value) || 0,
            valor_unitario: parseFloat(row.cells[4].querySelector('.currency').value.replace(/[^0-9,.-]+/g, '').replace(',', '.')) || 0,
            valor_total: parseFloat(row.cells[5].querySelector('.total').textContent.replace(/[^0-9,.-]+/g, '').replace(',', '.')) || 0,
            qualidade: row.cells[6].querySelector('input').value,
            medida: row.cells[7].querySelector('input').value,
            onda: row.cells[8].querySelector('select').value,
            vincos: row.cells[9].querySelector('select').value,
            status: row.cells[10].querySelector('select').value,
            data_recebimento: row.cells[11].querySelector('input').value
        };
        data.push(rowData);
    }
    return data;
}