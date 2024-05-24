import { createModalContent } from "../utils/modalUtil.js";
import { ItemCard } from "./ItemCard.js";
import { fetchItems, deleteEntity } from "../utils/connection.js";

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

  createSearchBar() {
    const searchBar = document.createElement("input");
    searchBar.type = "search";
    searchBar.id = "searchBar";
    searchBar.placeholder = "Procurar PART NUMBER";
    searchBar.className = "form-control";
    searchBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.searchButton.click();
      }
    });
    return searchBar;
  }

  createSearchButton() {
    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.className = "btn btn-primary";
    searchButton.addEventListener("click", async () => {
      const searchValue = this.searchBar.value;
      const filteredItems = await fetchItems(searchValue);
      this.renderItems = createModalContent(this.modalContent, this.closeModalButton, () => this.generateContent(filteredItems));
      this.renderItems();
    });
    return searchButton;
  }

  generateContent(items) {
    const fragment = document.createDocumentFragment();

    const searchContainer = document.createElement("div");
    searchContainer.classList.add("agrupar-button");
    searchContainer.style.display = "flex";
    searchContainer.style.justifyContent = "space-between";
    searchContainer.style.marginBottom = "10px";
    fragment.appendChild(searchContainer);

    this.searchBar = this.createSearchBar();
    searchContainer.appendChild(this.searchBar);

    this.searchButton = this.createSearchButton();
    searchContainer.appendChild(this.searchButton);

    items.forEach((item) => {
      const itemCard = new ItemCard(item);
      fragment.appendChild(itemCard.render());
    });

    return fragment;
  }
}