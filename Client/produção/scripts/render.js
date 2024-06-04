import { fetchMaquinaData } from "./connections.js";
import { createCard } from "./cardCreator.js";

export async function render(name, userName) {
  const data = await fetchMaquinaData(name);
  if (data && data.items) {
    const itemsList = document.getElementById("itemsList");
    itemsList.style.display = "flex";
    itemsList.style.flexDirection = "column";

    data.items.forEach((item) => {
      const card = createCard(item, name, item.estado, userName);
      itemsList.appendChild(card);
    });
  }
}
