export class Card {
    constructor(group, keys, index, sortKey, onSubcardSelectionChange) {
        this.group = group;
        this.keys = keys;
        this.index = index;
        this.sortKey = sortKey;
        this.onSubcardSelectionChange = onSubcardSelectionChange;
    }

    createDivWithClass(className) {
        let div = document.createElement('div');
        div.className = className;
        return div;
    }

    createHeaderRow(keys) {
        let headerRow = this.createDivWithClass('rowstyle row flex-nowrap overflow-auto bg-primary text-white w-100');
        keys.forEach(key => {
            let headerDiv = this.createDivWithClass('col text-center header');
            headerDiv.textContent = key.toUpperCase();
            headerRow.appendChild(headerDiv);
        });

        let headerDiv = this.createDivWithClass('col text-center header');
        headerDiv.textContent = 'QUANTIDADE COMPRADA';
        headerRow.appendChild(headerDiv);

        return headerRow;
    }

    createValueRow(group, keys) {
        let valueRow = this.createDivWithClass('row flex-nowrap overflow-auto');
        keys.forEach(key => {
            let valueDiv = this.createDivWithClass('col text-center value');
            valueDiv.textContent = group[key];
            valueRow.appendChild(valueDiv);
        });

        let quantidadeCompradaDiv = document.createElement('div');
        quantidadeCompradaDiv.className = 'col text-center value';
        quantidadeCompradaDiv.textContent = this.group.quantidade_comprada;
        valueRow.appendChild(quantidadeCompradaDiv);

        return valueRow;
    }

    createButton(index) {
        let button = document.createElement('button');
        button.className = 'btn btn-primary mt-2 w-100';
        button.type = 'button';
        button.dataset.toggle = 'collapse';
        button.dataset.target = `#collapse${index}`;
        button.textContent = '▼ Expandir';
        button.addEventListener('click', () => {
            button.textContent = button.textContent.charAt(0) === '▼' ? '▲ Colapsar' : '▼ Expandir';
        });
        return button;
    }

    createSubcard(chapa) {
        let subcard = this.createDivWithClass('card card-body mt-2 shadow-sm rounded');
        subcard.style.display = 'inline-block';

        let flexContainer = document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.flexDirection = 'row';
        subcard.appendChild(flexContainer);

        let checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'bg-primary';
        checkboxContainer.style.borderTopLeftRadius = '0.25rem';
        checkboxContainer.style.borderBottomLeftRadius = '0.25rem';
        checkboxContainer.style.display = 'flex';
        checkboxContainer.style.justifyContent = 'center';
        checkboxContainer.style.alignItems = 'center';
        flexContainer.appendChild(checkboxContainer);

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'subcard-checkbox-input';
        checkbox.id = 'subcard-checkbox-' + JSON.stringify(chapa);
        checkbox.style.display = 'none';
        checkbox.value = JSON.stringify(chapa);
        checkbox.addEventListener('change', (event) => {
            this.onSubcardSelectionChange(chapa, event.target.checked);
        });
        checkboxContainer.appendChild(checkbox);

        let label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.className = 'subcard-checkbox';
        label.style.width = '20px';
        label.style.height = '20px';
        checkboxContainer.appendChild(label);

        let cardContentContainer = this.createDivWithClass('card-content-container');
        flexContainer.appendChild(cardContentContainer);

        let cardContent = this.createDivWithClass('card-content');
        cardContentContainer.appendChild(cardContent);

        let subcardHeaderRow = this.createHeaderRow(Object.keys(chapa));
        cardContent.appendChild(subcardHeaderRow);

        let subcardRow = this.createValueRow(chapa, Object.keys(chapa));
        cardContent.appendChild(subcardRow);

        let totalWidth = 0;
        Object.keys(chapa).forEach(() => {
            totalWidth += 200;
        });
        cardContent.style.minWidth = `${totalWidth}px`;

        return subcard;
    }

    createCard(group, keys, index, sortKey) {
        let card = this.createDivWithClass('card mb-3 shadow-sm');
        let cardBody = this.createDivWithClass('card-body bg-secondary rounded');
        card.appendChild(cardBody);

        cardBody.appendChild(this.createHeaderRow(keys));
        cardBody.appendChild(this.createValueRow(group, keys));
        cardBody.appendChild(this.createButton(index));

        let collapseDiv = this.createDivWithClass('collapse overflow-auto mt-2');
        collapseDiv.id = `collapse${index}`;

        group.chapas.sort((a, b) => a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0);
        group.chapas.forEach(chapa => {
            let subcard = this.createSubcard(chapa);
            collapseDiv.appendChild(subcard);
        });

        cardBody.appendChild(collapseDiv);

        return card;
    }

    create() {
        let { group, keys, index, sortKey } = this;
        return this.createCard(group, keys, index, sortKey);
    }
}