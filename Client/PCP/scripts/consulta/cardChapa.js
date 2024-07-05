import { createElementWithClass } from "../utils/dom.js";
import { deleteChapaFromItem } from "../utils/connection.js";
import { CardConjugacao } from "./cardConjugacao.js";

export class CardChapa {
  constructor(chapa, itemStatus, itemId) {
    this.chapa = chapa;
    this.itemStatus = itemStatus;
    this.itemId = itemId;
    this.keys = ["status", "largura", "vincos", "qualidade", "onda", "data_prevista"];
  }

  createValueDiv(key, value) {
    let valueDiv = createElementWithClass("div", `card-value-div col text-center value align-items-center justify-content-center rounded`);

    if (key.startsWith("data")) {
      let dateParts;
      if (value.includes("/")) {
        dateParts = value.split("/");
      } else if (value.includes("-")) {
        dateParts = value.split("-");
        dateParts.reverse();
      }
      if (dateParts) {
        let [day, month] = dateParts;
        value = `${day}/${month}`;
      }
    }

    if (key === "status") {
      valueDiv.className += " card-status ";
      let status = value.toLowerCase();
      if (status === "recebido") {
        valueDiv.className += "card-status-recebido";
      } else if (status === "comprado") {
        valueDiv.className += "card-status-comprado";
      } else if (status === "parcial" || status === "parcialmente") {
        valueDiv.className += "card-status-parcial";
      } else if (status === "usado") {
        valueDiv.className += "card-status-usado";
      }

      valueDiv.textContent = value.toUpperCase();
    } else if (key === "largura") {
      let largura = this.chapa.largura;
      let comprimento = this.chapa.comprimento;
      value = `${largura} x ${comprimento}`;
      valueDiv.textContent = value;
    } else {
      valueDiv.textContent = value;
    }

    return valueDiv;
  }

  createValueRow() {
    let valueRow = createElementWithClass("div", "value-row d-flex flex-wrap align-items-center flex-grow-1");
    this.keys.forEach((key) => {
      if (this.chapa[key] !== null && this.chapa[key] !== undefined) {
        valueRow.appendChild(this.createValueDiv(key, this.chapa[key]));
      }
    });

    return valueRow;
  }

  createDeleteButton() {
    const deleteButton = createElementWithClass("button", "btn btn-danger ml-2 card-chapa-delete-button");
    deleteButton.textContent = "Deletar";
    deleteButton.addEventListener("click", () => {
      deleteChapaFromItem(this.itemId, this.chapa.id_chapa);
    });
    return deleteButton;
  }

  createDropdownButton(conjugacoesContainer) {
    const dropdownButton = document.createElement("button");
    dropdownButton.className = "btn btn-sm ml-2 card-info-button";
    dropdownButton.innerHTML = '<span style="font-size: 0.8em;">mostrar conjugações</span> <i class="fas fa-chevron-down" style="font-size: 1.2em;"></i>';
    const chevronIcon = dropdownButton.querySelector("i");
    dropdownButton.addEventListener("click", function () {
      conjugacoesContainer.style.display = conjugacoesContainer.style.display === "none" ? "block" : "none";
      chevronIcon.classList.toggle("rotate-icon");
    });
    return dropdownButton;
  }

  render() {
    const chapaCard = createElementWithClass("div", "card mt-3 chapa-card");
    const cardBody = createElementWithClass("div", "card-body d-flex flex-column align-items-start w-100");
    chapaCard.appendChild(cardBody);

    const valueRow = createElementWithClass("div", "d-flex justify-content-between align-items-center w-100");
    this.keys.forEach((key) => {
      if (this.chapa[key] !== null && this.chapa[key] !== undefined) {
        valueRow.appendChild(this.createValueDiv(key, this.chapa[key]));
      }
    });
    cardBody.appendChild(valueRow);

    const conjugacoesContainer = createElementWithClass("div", "conjugacoes-container w-100");
    conjugacoesContainer.style.display = "none";
    this.chapa.conjugacoes.forEach((conjugacao) => {
      const conjugacaoCard = new CardConjugacao(conjugacao);
      conjugacoesContainer.appendChild(conjugacaoCard.render());
    });
    cardBody.appendChild(conjugacoesContainer);

    const buttonsContainer = createElementWithClass("div", "d-flex justify-content-end");
    valueRow.appendChild(buttonsContainer);

    const dropdownButton = this.createDropdownButton(conjugacoesContainer);
    buttonsContainer.appendChild(dropdownButton);

    if (this.chapa.conjugacoes.length === 0) {
      dropdownButton.style.visibility = "hidden";
    }

    if (this.itemStatus.toLowerCase() === "reservado") {
      const deleteButton = this.createDeleteButton();
      buttonsContainer.appendChild(deleteButton);
    }

    return chapaCard;
  }
}
