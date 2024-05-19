export function handleShowSelectedButtonClick(getSelectedSubcards) {
    const showSelectedButton = document.getElementById('showSelectedButton');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');
    const popupContainer = document.getElementById('popupContainer');

    if (showSelectedButton.onclick) {
        showSelectedButton.removeEventListener('click', showSelectedButton.onclick);
    }

    showSelectedButton.onclick = () => {
        modalContent.innerHTML = '';
        modalContent.appendChild(closeModal);

        const selectedSubcards = getSelectedSubcards();

        const table = document.createElement('table');
        table.className = 'table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        ['id_chapa', 'fornecedor', 'medida', 'qualidade', 'quantidade', 'medida a usar'].forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        selectedSubcards.forEach(chapa => {
            const row = document.createElement('tr');
            ['id_chapa', 'fornecedor', 'medida', 'qualidade'].forEach(key => {
                const td = document.createElement('td');
                td.textContent = chapa[key];
                row.appendChild(td);
            });

            const quantityTd = document.createElement('td');
            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.min = '1';
            quantityInput.placeholder = 'Quantidade';
            quantityTd.appendChild(quantityInput);
            row.appendChild(quantityTd);

            const measureTd = document.createElement('td');
            const measureInput = document.createElement('input');
            measureInput.type = 'text';
            measureInput.placeholder = 'medida';
            measureTd.appendChild(measureInput);
            row.appendChild(measureTd);

            tbody.appendChild(row);
        });
        table.appendChild(tbody);

        modalContent.appendChild(table);

        const buttonFormContainer = document.createElement('div');
        buttonFormContainer.style.display = 'flex';
        buttonFormContainer.style.justifyContent = 'space-between';

        const partNumberForm = document.createElement('form');
        const partNumberLabel = document.createElement('label');
        partNumberLabel.textContent = 'Part Number:';
        const partNumberInput = document.createElement('input');
        partNumberInput.type = 'text';
        partNumberForm.appendChild(partNumberLabel);
        partNumberForm.appendChild(partNumberInput);

        buttonFormContainer.appendChild(partNumberForm);

        const reserveButton = document.createElement('button');
        reserveButton.textContent = 'RESERVAR';
        reserveButton.classList.add('agrupar-button')
        reserveButton.onclick = () => {
        };
        buttonFormContainer.appendChild(reserveButton);

        modalContent.appendChild(buttonFormContainer);

        popupContainer.style.display = 'block';
    };

    closeModal.onclick = () => {
        popupContainer.style.display = 'none';
    };
}