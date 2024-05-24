import { createElementWithClass } from "../utils/dom.js";
import { deleteEntity } from "../utils/connection.js";

export class ChapaCard {
  constructor(chapa) {
    this.chapa = chapa;
    this.keys = ["status", "medida", "vincos", "qualidade", "onda", "quantidade_comprada", "quantidade_estoque", "data_prevista"];
  }

  createValueDiv(key, value) {
    let valueDiv = createElementWithClass("div", `card-value-div col-12 col-sm text-center value align-items-center justify-content-center rounded`);
    valueDiv.style.width = "100px";
    valueDiv.style.padding = "5px";
    valueDiv.style.marginRight = "10px";
    valueDiv.style.marginLeft = "10px"; 

    if (key.startsWith("data")) {
      let [day, month] = value.split("/");
      value = `${day}/${month}`;
    }
    
    if (key === "status") {
      valueDiv.className += " card-status d-flex align-items-center justify-content-center";
      let status = value.toLowerCase();
      if (status === "recebido") {
        valueDiv.className += " card-status-recebido";
      } else if (status === "comprado") {
        valueDiv.className += " card-status-comprado";
      }
    }

    valueDiv.textContent = value;
    return valueDiv;
  }

  createValueRow() {
    let valueRow = createElementWithClass("div", "value-row row flex-nowrap flex-sm-wrap overflow-auto w-100 align-items-stretch");
    this.keys.forEach((key) => valueRow.appendChild(this.createValueDiv(key, this.chapa[key])));

    const deleteButton = this.createDeleteButton();
    valueRow.appendChild(deleteButton); 

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

    return chapaCard;
  }
}
