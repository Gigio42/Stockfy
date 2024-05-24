import { createModalContent } from '../utils/modalUtil.js';
import { ItemCard } from './ItemCard.js';
import { fetchItems, deleteEntity } from '../utils/connection.js';

export class ItemModal {
  constructor() {
    this.modal = document.getElementById("itemModal");
    this.modalContent = document.getElementById("itemContainer");
    this.openModalLink = document.getElementById("openModalLink");
    this.closeModalButton = document.getElementById("closeItemModal");
  }

  initialize() {
    this.openModalLink.addEventListener("click", this.openModal.bind(this));
    this.closeModalButton.addEventListener("click", this.closeModal.bind(this));
    this.modal.addEventListener("click", this.closeModal.bind(this));
    this.modalContent.addEventListener("click", (event) => event.stopPropagation());
  }

  async openModal(event) {
    event.preventDefault();
    this.modal.style.display = "block";
    const items = await fetchItems();
    this.renderItems = createModalContent(this.modalContent, this.closeModalButton, () => this.generateContent(items));
    this.renderItems();
  }

  closeModal() {
    this.modal.style.display = "none";
  }

  generateContent(items) {
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      const itemCard = new ItemCard(item);
      fragment.appendChild(itemCard.render());
    });
    return fragment;
  }
}