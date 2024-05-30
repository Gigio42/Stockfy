import { createElementWithClass } from "../utils/dom.js";
import { deleteItem } from "../utils/connection.js";
import { ChapaCard } from "./ChapaCard.js";

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

    const partNumberDiv = this.createPartNumberDiv();
    const statusDiv = this.createStatusDiv();

    //Conteiner p/ info dos itens na esquerda
    const itemContainer = createElementWithClass("div", "d-flex justify-content-start");
    titleContainer.appendChild(itemContainer);

    itemContainer.appendChild(partNumberDiv);
    itemContainer.appendChild(statusDiv);

    const previewDiv = this.createPreviewDiv();
    titleContainer.appendChild(previewDiv);

    const chapasContainer = this.createChapasContainer(); // Define chapasContainer here
    cardBody.appendChild(chapasContainer);

    const buttonContainer = createElementWithClass("div", "d-flex justify-content-end");
    titleContainer.appendChild(buttonContainer);

    const dropdownButton = this.createDropdownButton(chapasContainer); // Now chapasContainer is defined
    buttonContainer.appendChild(dropdownButton);

    const deleteButton = this.createDeleteButton();
    buttonContainer.appendChild(deleteButton);
    if (this.item.status.toLowerCase() != "reservado") {
      deleteButton.disabled = true;
      deleteButton.classList.remove("btn-danger");
      deleteButton.classList.add("btn-secondary");
    }

    return itemCard;
  }

  createPartNumberDiv() {
    const partNumberDiv = createElementWithClass("div", "btn btn-sm card-part-number");
    partNumberDiv.textContent = this.item.part_number;
    return partNumberDiv;
  }

  createStatusDiv() {
    const statusDiv = createElementWithClass("div", "btn btn-sm status");
    statusDiv.textContent = this.item.status;
    statusDiv.className += " card-status";
    const status = this.item.status.toLowerCase();
    if (status === "reservado") {
      statusDiv.className += " card-status-reservado";
    } else {
      statusDiv.className += " bg-secondary";
    }
    return statusDiv;
  }

  createPreviewDiv() {
    const lastChapa = this.item.chapas[this.item.chapas.length - 1];
    const previewDiv = createElementWithClass("div", "preview dark-background");
    const keys = ["largura", "qualidade", "onda", "quantidade_comprada"];
    keys.forEach((key) => {
      const span = document.createElement("span");
      span.style.marginRight = "10px";
      if (lastChapa[key] !== null) {
        if (key === "largura") {
          let largura = lastChapa.largura;
          let comprimento = lastChapa.comprimento;
          span.textContent = `${largura} x ${comprimento}`;
        } else if (key.startsWith("data")) {
          let [day, month] = lastChapa[key].split("/");
          span.textContent = `${day}/${month}`;
        } else {
          span.textContent = lastChapa[key];
        }
      }
      previewDiv.appendChild(span);
    });
    return previewDiv;
  }

  createChapasContainer() {
    const chapasContainer = createElementWithClass("div", "card-body chapas-container");
    chapasContainer.style.display = "none";
    this.item.chapas.forEach((chapa) => {
      const chapaCard = new ChapaCard(chapa, this.item.status, this.item.id_item);
      const chapaCardElement = chapaCard.render();
      chapaCardElement.classList.add("chapa-card-element");
      chapasContainer.appendChild(chapaCardElement);
    });
    return chapasContainer;
  }

  createDropdownButton(chapasContainer) {
    const dropdownButton = document.createElement("button");
    dropdownButton.className = "btn btn-sm ml-2 card-info-button";
    dropdownButton.innerHTML = 'Chapas <i class="fas fa-chevron-down"></i>';
    dropdownButton.addEventListener("click", function () {
      chapasContainer.style.display = chapasContainer.style.display === "none" ? "block" : "none";
    });
    return dropdownButton;
  }

  createDeleteButton() {
    const deleteButton = createElementWithClass("button", "btn btn-danger ml-2 card-item-delete-button");
    deleteButton.textContent = "Deletar";
    deleteButton.addEventListener("click", () => {
      deleteItem(this.item.id_item, "item");
    });
    return deleteButton;
  }
}
