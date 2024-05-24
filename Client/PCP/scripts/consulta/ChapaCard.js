import { createElementWithClass } from "../utils/dom.js";
import { deleteEntity } from "../utils/connection.js";

export class ChapaCard {
  constructor(chapa) {
    this.chapa = chapa;
    this.keys = ["medida", "vincos", "qualidade", "onda", "quantidade_comprada", "quantidade_estoque", "data_prevista", "status"]; // replace with your actual keys
  }

  createValueDiv(key, value) {
    let valueDiv = createElementWithClass("div", `card-value-div col-12 col-sm text-center value align-items-center justify-content-center rounded`);
    valueDiv.style.width = "100px";
    valueDiv.style.padding = "5px";

    if (key.startsWith("data")) {
      let [day, month] = value.split("/");
      value = `${day}/${month}`;
    }

    valueDiv.textContent = value;
    return valueDiv;
  }

  createValueRow() {
    let valueRow = createElementWithClass("div", "value-row row flex-nowrap flex-sm-wrap overflow-auto w-100 align-items-stretch");
    this.keys.forEach((key) => valueRow.appendChild(this.createValueDiv(key, this.chapa[key])));
    return valueRow;
  }

  createDeleteButton() {
    const deleteButton = createElementWithClass("button", "btn btn-danger ml-auto");
    deleteButton.textContent = "Deletar";
    deleteButton.addEventListener("click", () => {
      deleteEntity(this.chapa.id_chapa, "chapa");
    });
    return deleteButton;
  }

  render() {
    const chapaCard = createElementWithClass("div", "card mt-3");
    chapaCard.style.backgroundColor = "#252525";
    const cardBody = createElementWithClass("div", "card-body d-flex align-items-start");
    chapaCard.appendChild(cardBody);

    const valueRow = this.createValueRow();
    cardBody.appendChild(valueRow);

    const deleteButton = this.createDeleteButton();
    cardBody.appendChild(deleteButton);

    return chapaCard;
  }
}
