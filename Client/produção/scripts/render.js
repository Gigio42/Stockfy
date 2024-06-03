import { fetchMaquinaData } from "./connections.js";
import { createCard } from "./cardCreator.js";

export async function render(name) {
  const data = await fetchMaquinaData(name);
  if (data && data.items) {
    const itemsList = document.getElementById("itemsList");
    itemsList.style.display = "flex";
    itemsList.style.flexDirection = "column";

    data.items.forEach((item) => {
      const card = createCard(item, name, item.estado);
      itemsList.appendChild(card);
    });
  }
}
