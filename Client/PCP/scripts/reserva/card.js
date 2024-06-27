import { createElementWithClass } from "../utils/dom.js";
import { InfoModal } from "./infoModal.js";

export class Card {
  constructor(chapa, keys, index, sortKey, onSubcardSelectionChange, isChecked = false) {
    this.chapa = chapa;
    this.keys = keys;
    this.index = index;
    this.sortKey = sortKey;
    this.onSubcardSelectionChange = onSubcardSelectionChange;
    this.isChecked = isChecked;
    this.cards = [];
    this.infoModal = new InfoModal();
  }

  createValueDiv(key, value) {
    let valueDiv = createElementWithClass("div", `card-value-div col text-center value d-flex align-items-center justify-content-center rounded`);

    if (value === null) {
      valueDiv.textContent = "N/A";
    } else {
      if (key.startsWith("data")) {
        let dateParts;
        if (value.includes("/")) {
          //"dd/mm/yyyy" format
          dateParts = value.split("/");
        } else if (value.includes("-")) {
          //"yyyy-mm-dd" format
          dateParts = value.split("-");
          dateParts.reverse();
        }
        if (dateParts) {
          let [day, month] = dateParts;
          valueDiv.textContent = `${day}/${month}`;
        }
      } else {
        valueDiv.textContent = value;
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
        }

        valueDiv.textContent = value.toUpperCase();
      }

      if (key === "quantidade_disponivel") {
        if (this.chapa.status.toUpperCase() === "RECEBIDO") {
          valueDiv.style.color = "green";
        } else if (this.chapa.status.toUpperCase() === "COMPRADO") {
          valueDiv.style.color = "red";
        } else if (this.chapa.status.toUpperCase() === "PARCIAL") {
          valueDiv.style.color = "orange";
        }
      }

      if (key === "largura") {
        let largura = this.chapa.largura;
        let comprimento = this.chapa.comprimento;
        valueDiv.textContent = `${largura} x ${comprimento}`;
      }

      if (key === this.keys[this.keys.length - 1]) {
        valueDiv.className += " mr-3";
      }
    }

    return valueDiv;
  }

  createValueRow() {
    let valueRow = createElementWithClass("div", "value-row row overflow-auto w-100 align-items-stretch");
    this.keys.forEach((key) => valueRow.appendChild(this.createValueDiv(key, this.chapa[key])));
    return valueRow;
  }

  createInfoButton() {
    let infoButton = createElementWithClass("button", "btn btn-sm ml-2 card-info-button");
    infoButton.innerHTML = '<i class="fas fa-chevron-down"></i>';

    infoButton.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.infoModal.openModal(this.chapa);
    });

    return infoButton;
  }

  createCardBody() {
    let cardBody = createElementWithClass("div", "body-div card-body rounded d-flex align-items-center");
    cardBody.appendChild(this.createValueRow());
    cardBody.appendChild(this.createInfoButton());
    return cardBody;
  }

  createCard() {
    let card = createElementWithClass("div", "card mb-3 shadow-sm");
    card.appendChild(this.createCardBody());

    if (this.isChecked) {
      card.classList.add("selected");
    }

    card.addEventListener("click", (event) => {
      if (event.target !== this.createInfoButton()) {
        this.onSubcardSelectionChange(this.chapa, !this.isChecked);
        this.isChecked = !this.isChecked;

        if (this.isChecked) {
          card.classList.add("selected");
        } else {
          card.classList.remove("selected");
        }
      }
    });

    return card;
  }
}
