import { createElementWithClass } from "../utils/dom.js";

export class Subcard {
  constructor(conjugacao) {
    this.conjugacao = conjugacao;
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
    let subcard = createElementWithClass("div", "subcard mb-3 shadow-sm");
    subcard.appendChild(this.createSubcardBody());
    return subcard;
  }
}
