import { fetchData } from './connections.js';
import { createCard } from './cardCreator.js';

export async function render(name) {
  const data = await fetchData(name);
  if (data && data.items) {
    const itemsList = document.getElementById("itemsList");
    data.items.forEach((item) => itemsList.appendChild(createCard(item)));
  }
}