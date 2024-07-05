import { createElementWithClass } from "../utils/dom.js";

export class CardConjugacao {
  constructor(conjugacao) {
    this.conjugacao = conjugacao;
  }

  createValueDiv(value, classes = "") {
    let valueDiv = createElementWithClass("div", `value ${classes}`);
    valueDiv.textContent = value;
    return valueDiv;
  }

  createRendimentoDiv() {
    return this.createValueDiv(`${this.conjugacao.rendimento}x`, "col-12 col-sm-6 col-md-3 text-center");
  }

  createUsadoDiv() {
    let usadoDiv = this.createValueDiv(this.conjugacao.usado ? "USADO" : "DISP", "col-12 col-sm-6 col-md-3 text-center");
    usadoDiv.classList.remove(this.conjugacao.usado ? "usado" : "disponivel");
    return usadoDiv;
  }

  createMedidaDiv() {
    return this.createValueDiv(this.conjugacao.medida, "col-12 col-sm-6 col-md-3 text-center");
  }

  createQuantidadeDisponivelDiv() {
    return this.createValueDiv(`${this.conjugacao.quantidade_disponivel}`, "col-12 col-sm-6 col-md-3 text-center");
  }

  createValueRow() {
    let valueRow = createElementWithClass("div", "value-row row");
    valueRow.appendChild(this.createMedidaDiv());
    valueRow.appendChild(this.createRendimentoDiv());
    valueRow.appendChild(this.createUsadoDiv());
    valueRow.appendChild(this.createQuantidadeDisponivelDiv());
    return valueRow;
  }

  render() {
    const conjugacaoCard = createElementWithClass("div", "card mt-3 conjugacao-card");
    const cardBody = createElementWithClass("div", "card-body");
    conjugacaoCard.appendChild(cardBody);
    cardBody.appendChild(this.createValueRow());
    return conjugacaoCard;
  }
}
