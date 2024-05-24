import { createElementWithClass } from '../utils/dom.js';
import { deleteEntity } from '../utils/api.js';
import { ChapaCard } from './ChapaCard.js';

export class ItemCard {
  constructor(item) {
    this.item = item;
  }

  render() {
    const itemCard = createElementWithClass("div", "card");
    const cardBody = createElementWithClass("div", "card-body");
    itemCard.appendChild(cardBody);

    const titleContainer = createElementWithClass("div", "d-flex justify-content-between align-items-center");
    cardBody.appendChild(titleContainer);

    const itemInfo = createElementWithClass("h5", "card-title mb-0");
    itemInfo.textContent = this.item.part_number;
    titleContainer.appendChild(itemInfo);

    const statusDiv = this.createStatusDiv();
    titleContainer.appendChild(statusDiv);

    if (this.item.chapas.length > 0) {
      const briefView = this.createBriefView();
      titleContainer.appendChild(briefView);
    }

    const chapasContainer = this.createChapasContainer();
    cardBody.appendChild(chapasContainer);

    const buttonContainer = createElementWithClass("div", "d-flex justify-content-end");
    titleContainer.appendChild(buttonContainer);

    const dropdownButton = this.createDropdownButton(chapasContainer);
    buttonContainer.appendChild(dropdownButton);

    const deleteButton = this.createDeleteButton();
    buttonContainer.appendChild(deleteButton);

    return itemCard;
  }

  createStatusDiv() {
    const statusDiv = createElementWithClass("div", "btn btn-sm status");
    statusDiv.textContent = this.item.status;
    statusDiv.className += " card-status";
    const status = this.item.status.toLowerCase();
    if (status === "reservado") {
      statusDiv.className += " bg-primary";
    } else if (status === "comprado") {
      statusDiv.className += " bg-warning";
    } else {
      statusDiv.className += " bg-secondary";
    }
    return statusDiv;
  }

  createBriefView() {
    const lastChapa = this.item.chapas[this.item.chapas.length - 1];
    const briefView = createElementWithClass("div", "brief-view d-flex");
    briefView.style.flexWrap = "wrap";
    const keys = ["medida", "vincos", "qualidade", "onda", "quantidade_comprada", "quantidade_estoque", "data_prevista"];
    keys.forEach(key => {
      const span = document.createElement("span");
      span.textContent = lastChapa[key];
      span.style.marginRight = "1em";
      span.style.color = "#b3b3b3";
      briefView.appendChild(span);
    });

    const dotsSpan = document.createElement("span");
    dotsSpan.textContent = "...";
    briefView.appendChild(dotsSpan);

    return briefView;
  }

  createChapasContainer() {
    const chapasContainer = createElementWithClass("div", "card-body");
    chapasContainer.style.display = "none";
    this.item.chapas.forEach(chapa => {
      const chapaCard = new ChapaCard(chapa);
      chapasContainer.appendChild(chapaCard.render());
    });
    return chapasContainer;
  }

  createDropdownButton(chapasContainer) {
    const dropdownButton = document.createElement("button");
    dropdownButton.className = "btn btn-primary btn-sm ml-2 card-info-button";
    dropdownButton.innerHTML = 'Chapas <i class="fas fa-chevron-down"></i>';
    dropdownButton.addEventListener("click", function () {
      chapasContainer.style.display = chapasContainer.style.display === "none" ? "block" : "none";
    });
    return dropdownButton;
  }

  createDeleteButton() {
    const deleteButton = createElementWithClass("button", "btn btn-danger ml-2");
    deleteButton.textContent = "Deletar";
    deleteButton.addEventListener("click", () => {
      deleteEntity(this.item.id_item, "item");
    });
    return deleteButton;
  }
}
