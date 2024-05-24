import { createElementWithClass } from '../utils/dom.js';
import { deleteEntity } from '../utils/connection.js';

export class ChapaCard {
  constructor(chapa) {
    this.chapa = chapa;
  }

  render() {
    const chapaCard = createElementWithClass("div", "card mt-3");
    chapaCard.style.backgroundColor = "#252525";
    const cardBody = createElementWithClass("div", "card-body");
    chapaCard.appendChild(cardBody);

    const chapaInfo = createElementWithClass("h6", "card-subtitle mb-2 text-muted");
    chapaInfo.textContent = `Chapa ID: ${this.chapa.id_chapa}, ...`;
    cardBody.appendChild(chapaInfo);

    const deleteButton = this.createDeleteButton();
    cardBody.appendChild(deleteButton);

    return chapaCard;
  }

  createDeleteButton() {
    const deleteButton = createElementWithClass("button", "btn btn-danger ml-2");
    deleteButton.textContent = "Deletar";
    deleteButton.addEventListener("click", () => {
      deleteEntity(this.chapa.id_chapa, "chapa");
    });
    return deleteButton;
  }
}
