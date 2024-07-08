document.addEventListener('DOMContentLoaded', function () {
    const apiUrl = 'http://localhost:3000/historico/';
    let currentDisplay = 'part_number'; // Controla se estamos exibindo itens ou chapas
    let uniqueIds = new Set(); // Usado para armazenar IDs únicos
    let historicoGeral = []; // Armazena os dados recebidos na variável global
    let hideListTimeout; // Timeout para esconder a lista
    let selectedDates = []; // Armazena as datas selecionadas

    function parseDate(dateStr) {
        if (typeof dateStr === 'string') {
            const [day, month, year] = dateStr.split('/').map(Number);
            return new Date(year, month - 1, day);
        } else if (dateStr instanceof Date) {
            return dateStr;
        }
        return null;
    }

    // Configura o flatpickr para o input de calendário
    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "d/m/Y",
        onChange: function(selectedDatesArray) {
            selectedDates = selectedDatesArray;
            if (selectedDates.length === 1) {
                // Marcar o dia selecionado com um círculo vermelho
                document.querySelectorAll('.flatpickr-day').forEach(day => {
                    if (day.dateObj.getTime() === selectedDates[0].getTime()) {
                        day.style.backgroundColor = 'red';
                        day.style.color = 'white';
                    } else {
                        day.style.backgroundColor = '';
                        day.style.color = '';
                    }
                });
            } else {
                // Marcar os dois dias selecionados com um círculo vermelho
                document.querySelectorAll('.flatpickr-day').forEach(day => {
                    if (selectedDates.some(date => day.dateObj.getTime() === date.getTime())) {
                        day.style.backgroundColor = 'red';
                        day.style.color = 'white';
                    } else {
                        day.style.backgroundColor = '';
                        day.style.color = '';
                    }
                });
            }
        },
        onClose: function(selectedDatesArray) {
            if (selectedDatesArray.length === 1) {
                handleDateSelection(selectedDatesArray[0], selectedDatesArray[0]);
            } else if (selectedDatesArray.length === 2) {
                handleDateSelection(selectedDatesArray[0], selectedDatesArray[1]);
            }
        }
    });

    function handleDateSelection(startDate, endDate) {
        if (startDate && endDate) {
            const filteredData = historicoGeral.filter(item => {
                const itemDate = new Date(item.data_modificacao);
                return itemDate >= startDate && itemDate <= endDate;
            });
            updateTableAndIds(filteredData);
        }
    }

    function createTable(displayType, data) {
        const table = document.getElementById('resultsTable');
        const thead = table.getElementsByTagName('thead')[0];
        const tbody = table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';
        thead.innerHTML = '';

        const headers = {
            'part_number': ["Part Number", "Quantidade", "Modificação", "Modificado Por", "Data Modificação", "Máquina", "Ordem", "Pedido Venda", "Conjulgação", "Chapas"],
            'chapa': ["Chapa", "Quantidade", "Modificação", "Modificado Por", "Data Modificação", "Part Number"],
            'maquina': ["Máquina", "Part Number", "Quantidade", "Modificação", "Modificado Por", "Data Modificação", "Ordem", "Pedido Venda", "Conjulgação", "Chapas"]
        }[displayType];

        const jsonKeys = {
            'part_number': ["part_number", "quantidade", "modificacao", "modificado_por", "data_modificacao", "maquina", "ordem", "pedido_venda", "conjulgacao"],
            'chapa': ["id_chapa", "quantidade", "modificacao", "modificado_por", "data_modificacao", "part_number"],
            'maquina': ["maquina", "part_number", "quantidade", "modificacao", "modificado_por", "data_modificacao", "ordem", "pedido_venda", "conjulgacao"]
        }[displayType];

        let rowHeader = thead.insertRow();
        headers.forEach(header => {
            let th = document.createElement('th');
            th.textContent = header;
            rowHeader.appendChild(th);
        });

        data.forEach(item => {
            if (!item[jsonKeys[0]] || item[jsonKeys[0]].toString().trim() === "") {
                return; // Não adiciona linhas com part_number ou id_chapa vazio
            }
            let row = tbody.insertRow();
            jsonKeys.forEach(key => {
                const cell = row.insertCell();
                if (key === 'data_modificacao') {
                    const date = new Date(item[key]);
                    const formattedDate = date.toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                    });
                    cell.textContent = formattedDate;
                } else {
                    cell.textContent = item[key] || 'N/A';
                }
            });
            if (displayType === 'part_number' || displayType === 'maquina') {
                addChapasButton(row, item);
            }
        });
    }

    function addChapasButton(row, item) {
        let chapasCell = row.insertCell();
        let button = document.createElement('button');
        button.textContent = '➡️';

        button.addEventListener('mouseover', function() {
            showChapasList(button, item.part_number, item.pedido_venda, item.data_modificacao);
        });

        button.addEventListener('mouseout', function(event) {
            if (!event.relatedTarget || !event.relatedTarget.closest('#chapasList')) {
                hideListTimeout = setTimeout(hideChapasList, 100); // Delay para esconder a lista
            }
        });

        chapasCell.appendChild(button);
    }

    function showChapasList(button, partNumber, pedidoVenda, dataModificacao) {
        const listContainer = document.createElement('div');
        listContainer.id = 'chapasList';
        listContainer.style.position = 'absolute';
        listContainer.style.backgroundColor = '#333';
        listContainer.style.color = 'white';
        listContainer.style.padding = '10px';
        listContainer.style.border = '1px solid #555';
        listContainer.style.zIndex = '1000';

        const rect = button.getBoundingClientRect();
        listContainer.style.left = `${rect.left + window.scrollX - 200}px`;
        listContainer.style.top = `${rect.top + window.scrollY}px`;

        const filteredChapas = historicoGeral.filter(item => {
            return item.part_number === partNumber &&
                   item.pedido_venda === pedidoVenda &&
                   parseDate(item.data_modificacao) <= parseDate(dataModificacao);
        });

        const uniqueChapas = new Set(filteredChapas.map(chapa => chapa.id_chapa));
        console.log('Filtered chapas:', filteredChapas);
        console.log('Unique chapas:', uniqueChapas);

        if (uniqueChapas.size > 0) {
            let content = `<ul>`;
            uniqueChapas.forEach(chapaId => {
                content += `<li><button class="chapa-button" data-id="${chapaId}">ID da Chapa: ${chapaId}</button></li>`;
            });
            content += `</ul>`;
            listContainer.innerHTML = content;
        } else {
            listContainer.textContent = 'Nenhuma chapa encontrada.';
        }

        listContainer.addEventListener('mouseout', function(event) {
            if (!event.relatedTarget || (!event.relatedTarget.closest('#chapasList') && !event.relatedTarget.closest('button'))) {
                hideListTimeout = setTimeout(hideChapasList, 100); // Delay para esconder a lista
            }
        });

        listContainer.addEventListener('mouseover', function() {
            clearTimeout(hideListTimeout); // Cancela o timeout ao mover o mouse para a lista
        });

        document.body.appendChild(listContainer);

        document.querySelectorAll('.chapa-button').forEach(button => {
            button.addEventListener('click', function() {
                const chapaId = this.getAttribute('data-id');
                console.log('Clicked chapa ID:', chapaId);
                updateDisplay('chapa'); // Muda o display para chapa
                displayFilteredData(chapaId, 'id_chapa');
            });
        });
    }

    function hideChapasList() {
        const listContainer = document.getElementById('chapasList');
        if (listContainer) {
            listContainer.remove();
        }
    }

    function fetchData(extraPath = '', params = {}) {
        let url = new URL(apiUrl + extraPath);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Para depuração
            historicoGeral = data; // Armazena os dados recebidos na variável global
            historicoGeral.forEach(item => {
                item.data_modificacao = parseDate(item.data_modificacao);
            });
            updateTableAndIds(data);
        })
        .catch(error => console.error('Error:', error));
    }

    function updateTableAndIds(data) {
        updateTable(data);
        updateIds(data);
    }

    function updateTable(data) {
        createTable(currentDisplay, data);
    }

    function updateIds(data) {
        uniqueIds.clear(); // Limpa os IDs antigos
        data.forEach(item => {
            if (currentDisplay === 'part_number' && item.part_number) {
                uniqueIds.add(item.part_number);
            } else if (currentDisplay === 'chapa' && item.id_chapa) {
                uniqueIds.add(item.id_chapa);
            } else if (currentDisplay === 'maquina' && item.maquina) {
                uniqueIds.add(item.maquina);
            }
        });

        const idsContainer = document.getElementById('idsContainer');
        idsContainer.innerHTML = ""; // Limpa o contêiner de IDs
        uniqueIds.forEach(id => {
            const idDiv = document.createElement('button');
            idDiv.className = 'id-button';
            idDiv.textContent = id;
            idDiv.addEventListener('click', function() {
                console.log('Clicked ID button:', id);
                displayFilteredData(id, currentDisplay === 'part_number' ? 'part_number' : currentDisplay === 'chapa' ? 'id_chapa' : 'maquina');
            });
            idsContainer.appendChild(idDiv);
        });
    }

    function displayFilteredData(id, type) {
        console.log('Display filtered data for ID:', id, 'Type:', type);
        const keyMap = {
            'part_number': 'part_number',
            'id_chapa': 'id_chapa',
            'maquina': 'maquina'
        };
        const filteredData = historicoGeral.filter(item => {
            console.log('Checking item:', item[keyMap[type]], 'against ID:', id);
            return item[keyMap[type]] && item[keyMap[type]].toString() === id.toString();
        });
        console.log('Filtered data:', filteredData);
        updateTable(filteredData);
    }

    function updateDisplay(displayType) {
        currentDisplay = displayType;
        updateTableAndIds(historicoGeral);
    }

    document.getElementById('btnHistoricoPartNumber').addEventListener('click', function () {
        updateDisplay('part_number');
    });

    document.getElementById('btnHistoricoChapa').addEventListener('click', function () {
        updateDisplay('chapa');
    });

    document.getElementById('btnHistoricoMaquina').addEventListener('click', function () {
        updateDisplay('maquina');
    });

    document.getElementById('week').addEventListener('click', () => handleDateClick('week'));
    document.getElementById('month').addEventListener('click', () => handleDateClick('month'));
    document.getElementById('year').addEventListener('click', () => handleDateClick('year'));

    function handleDateClick(period) {
        const now = new Date();
        let startDate, endDate = now;

        switch (period) {
            case 'week':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            case 'year':
                startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
        }

        const filteredData = historicoGeral.filter(item => {
            const itemDate = new Date(item.data_modificacao);
            return itemDate >= startDate && itemDate <= endDate;
        });

        updateTableAndIds(filteredData);
    }

    fetchData(); // Carrega dados iniciais
});