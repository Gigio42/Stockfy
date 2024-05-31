import { fetchData } from "./connections.js";
import { createCard, createFinalizadoCard } from "./cardCreator.js";

export async function render(name) {
  const data = await fetchData(name);
  if (data && data.items) {
    const itemsList = document.getElementById("itemsList");
    itemsList.style.display = "flex";
    itemsList.style.flexDirection = "column";

    data.items.forEach((item) => {
      let card;
      if (item.Item.status === "FINALIZADO") {
        card = createFinalizadoCard(item);
      } else {
        card = createCard(item);
      }
      itemsList.appendChild(card);
    });
  }
}
