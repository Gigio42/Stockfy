export class Card {
  constructor(chapa, keys, index, sortKey, onSubcardSelectionChange, isChecked = false) {
    this.chapa = chapa;
    this.keys = keys;
    this.index = index;
    this.sortKey = sortKey;
    this.onSubcardSelectionChange = onSubcardSelectionChange;
    this.isChecked = isChecked;
  }

  createDivWithClass(className) {
    let div = document.createElement("div");
    div.className = `card-${className}`;
    return div;
  }

  createValueDiv(key, value) {
    let valueDiv = this.createDivWithClass(`card-value-div col text-center value align-items-center justify-content-center rounded`);
    valueDiv.style.width = "100px";
    valueDiv.style.padding = "5px";
    valueDiv.textContent = value;

    if (key === "status") {
      valueDiv.className += " card-status";
      let status = value.toLowerCase();
      if (status === "recebido") {
        valueDiv.className += " bg-success";
      } else if (status === "comprado") {
        valueDiv.className += " bg-warning";
      }
    }

    if (key === this.keys[this.keys.length - 1]) {
      valueDiv.className += " mr-3";
    }

    return valueDiv;
  }

  createValueRow() {
    let valueRow = this.createDivWithClass("value-row row flex-nowrap overflow-auto w-100 align-items-stretch");
    this.keys.forEach((key) => valueRow.appendChild(this.createValueDiv(key, this.chapa[key])));
    return valueRow;
  }

  createCheckbox() {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "card-checkbox  mr-3";
    checkbox.checked = this.isChecked;
    checkbox.addEventListener("change", () => this.onSubcardSelectionChange(this.chapa, checkbox.checked));
    return checkbox;
  }

  createInfoButton() {
    let infoButton = document.createElement("button");
    infoButton.className = "btn btn-sm ml-2 card-info-button";
    infoButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
    infoButton.addEventListener("click", () => {
      alert(JSON.stringify(this.chapa, null, 2));
    });
    return infoButton;
  }

  createCardBody() {
    let cardBody = this.createDivWithClass("body-div card-body bg-red rounded d-flex align-items-center");
    cardBody.appendChild(this.createCheckbox());
    cardBody.appendChild(this.createValueRow());
    cardBody.appendChild(this.createInfoButton());
    return cardBody;
  }

  createCard() {
    let card = this.createDivWithClass("div card mb-3 shadow-sm");
    card.appendChild(this.createCardBody());
    return card;
  }

  create() {
    return this.createCard();
  }
}
