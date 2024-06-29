import { createElementWithClass } from "../utils/dom.js";
import { InfoModal } from "./infoModal.js";
import { Subcard } from "./subcard.js";

export class Card {
  constructor(chapa, keys, index, sortKey, onSelectionChange, isChecked = false) {
    this.chapa = chapa;
    this.keys = keys;
    this.index = index;
    this.sortKey = sortKey;
    this.onSelectionChange = onSelectionChange;
    this.isChecked = isChecked;
    this.subcards = [];
    this.infoModal = new InfoModal();
    this.initSubcards();
  }

  initSubcards() {
    this.subcards = this.chapa.conjugacoes.map((conjugacao) => new Subcard(conjugacao, this.onSelectionChange));
  }

  createValueDiv(key, value) {
    let valueDiv = createElementWithClass("div", `card-value-div col text-center value d-flex align-items-center justify-content-center rounded`);

    if (value === null) {
      valueDiv.textContent = "N/A";
    } else {
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
    infoButton.innerHTML = '<i class="fas fa-info-circle"></i>';

    infoButton.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.infoModal.openModal(this.chapa);
    });

    return infoButton;
  }

  createDropdownButton() {
    let dropdownButton = createElementWithClass("button", "btn btn-sm ml-2 card-dropdown-button");
    dropdownButton.innerHTML = '<i class="fas fa-chevron-down"></i>';

    dropdownButton.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.toggleSubcards();
    });

    return dropdownButton;
  }

  createCardBody() {
    let cardBody = createElementWithClass("div", "body-div card-body rounded d-flex align-items-center");
    cardBody.appendChild(this.createValueRow());
    cardBody.appendChild(this.createInfoButton());
    cardBody.appendChild(this.createDropdownButton());
    return cardBody;
  }

  createSubcardsContainer() {
    let subcardsContainer = createElementWithClass("div", "subcards-container");
    this.subcards.forEach((subcard) => subcardsContainer.appendChild(subcard.createSubcard()));
    subcardsContainer.style.display = "none";
    return subcardsContainer;
  }

  toggleSubcards() {
    let subcardsContainer = this.card.querySelector(".subcards-container");
    if (subcardsContainer.style.display === "none") {
      subcardsContainer.style.display = "block";
      anime({
        targets: subcardsContainer,
        opacity: [0, 1],
        height: ["0px", subcardsContainer.scrollHeight + "px"],
        duration: 500,
        easing: "easeOutCubic",
      });
    } else {
      anime({
        targets: subcardsContainer,
        opacity: [1, 0],
        translateY: [0, -10],
        easing: 'easeOutQuad',
        duration: 500, // Ajuste a duração conforme desejado
        complete: () => {
          subcardsContainer.style.display = "none";
        }
      });
    }
  }

  createCard() {
    let card = createElementWithClass("div", "card mb-3 shadow-sm");
    this.card = card;
    card.appendChild(this.createCardBody());
    card.appendChild(this.createSubcardsContainer());

    if (this.isChecked) {
      card.classList.add("selected");
    }

    card.addEventListener("click", (event) => {
      if (event.target.closest(".card-info-button, .card-dropdown-button")) {
        return;
      }
      this.onSelectionChange(this.chapa, !this.isChecked, "chapa");
      this.isChecked = !this.isChecked;

      if (this.isChecked) {
        card.classList.add("selected");
      } else {
        card.classList.remove("selected");
      }
    });

    return card;
  }
}
