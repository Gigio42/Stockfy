import { ItemCard } from './ItemCard.js';
import { fetchItems, deleteEntity } from '../utils/connection.js';

export class ItemModal {
  constructor() {
    this.modal = document.getElementById("itemModal");
    this.openModalLink = document.getElementById("openModalLink");
    this.closeModalButton = document.getElementById("closeItemModal");
    this.container = document.getElementById("itemContainer");
  }

  initialize() {
    this.openModalLink.addEventListener("click", this.openModal.bind(this));
    this.closeModalButton.addEventListener("click", this.closeModal.bind(this));
  }

  async openModal(event) {
    event.preventDefault();
    this.modal.style.display = "block";
    const items = await fetchItems();
    this.renderItems(items);
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  renderItems(items) {
    this.container.innerHTML = "";
    items.forEach(item => {
      const itemCard = new ItemCard(item);
      this.container.appendChild(itemCard.render());
    });
  }
}
