import { createElementWithClass } from "../utils/dom.js";

export class Subcard {
  constructor(conjugacao, onSelectionChange) {
    this.conjugacao = conjugacao;
    this.onSelectionChange = onSelectionChange;
    this.isChecked = false;
    this.disabled = false;
  }

  createValueDiv(value) {
    let valueDiv = createElementWithClass("div", "subcard-value-div col text-center value d-flex align-items-center justify-content-center rounded");
    valueDiv.textContent = value || "N/A";
    return valueDiv;
}

createUsadoDiv() {
    let status = this.conjugacao.usado ? "USADO" : "DISP";
    let statusDiv = createElementWithClass("div", "subcard-status-div col text-center value d-flex align-items-center justify-content-center rounded");
    statusDiv.textContent = status;
    statusDiv.className += this.conjugacao.usado ? " text-danger" : " text-success";
    return statusDiv;
}

createValueRow() {
    let valueRow = createElementWithClass("div", "value-row d-flex flex-wrap w-100 justify-content-between");
    valueRow.appendChild(this.createValueDiv(this.conjugacao.medida));
    valueRow.appendChild(this.createValueDiv(this.conjugacao.quantidade));
    valueRow.appendChild(this.createUsadoDiv());
    return valueRow;
}

  createSubcardBody() {
    let subcardBody = createElementWithClass("div", "subcard-body rounded d-flex align-items-center");
    subcardBody.appendChild(this.createValueRow());
    return subcardBody;
  }

  createSubcard() {
    let subcard = createElementWithClass("div", "subcard p-2 rounded mb-2 d-flex flex-column");
    subcard.setAttribute("data-id-conjugacao", this.conjugacao.id_conjugacoes);
    subcard.style.flex = "1 0 21%";

    if (this.conjugacao.usado) {
        subcard.className += " usado";
    }

    subcard.appendChild(this.createValueRow());

    subcard.addEventListener("click", (event) => {
      event.stopPropagation();

      if (this.disabled) {
        return;
      }

      this.isChecked = !this.isChecked;
      subcard.classList.toggle("selected");
      this.onSelectionChange(this.conjugacao, this.isChecked, "subcard");

      if (this.isChecked) {
        this.parentCard.disabled = true;
      } else {
        if (!this.parentCard.subcards.some((subcard) => subcard.isChecked)) {
          this.parentCard.disabled = false;
        }
      }
    });

    return subcard;
  }

  deselect() {
    this.isChecked = false;
    this.subcard.classList.remove("selected");
  }
}
