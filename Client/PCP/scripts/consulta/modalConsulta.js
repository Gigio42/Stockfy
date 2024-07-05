import { createModalContent } from "../utils/modalUtil.js";
import { CardItem } from "./cardItem.js";
import { fetchItems } from "../utils/connection.js";

export class ItemModal {
  constructor() {
    this.modal = document.getElementById("itemModal");
    this.modalContent = document.getElementById("itemContainer");
    this.openModalLink = document.getElementById("openModalLink");
    //mobile
    this.mobileOpenModalLink = document.getElementById("mobileOpenModalLink");
    this.closeModalButton = document.getElementById("closeItemModal");
  }

  initialize() {
    this.openModalLink.addEventListener("click", this.openModal.bind(this));
    //mobile
    this.mobileOpenModalLink.addEventListener("click", this.openModal.bind(this));
    this.closeModalButton.addEventListener("click", this.closeModal.bind(this));
    this.modal.addEventListener("click", this.closeModal.bind(this));
    this.modalContent.addEventListener("click", (event) => event.stopPropagation());

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeModal();
      }
    });
  }

  async openModal(event) {
    event.preventDefault();
    this.modal.classList.add("open");
    const items = await fetchItems();
    this.renderItems = createModalContent(this.modalContent, this.closeModalButton, () => this.generateContent(items));
    this.renderItems();
  }

  closeModal() {
    this.modal.classList.remove("open");
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

    $(searchBar).mask("9999.9999");

    return searchBar;
  }

  createSearchButton() {
    const searchButton = document.createElement("button");
    searchButton.textContent = "Search";
    searchButton.className = "btn btn-primary";
    searchButton.addEventListener("click", async () => {
      try {
        const searchValue = this.searchBar.value;
        const filteredItems = await fetchItems(searchValue);
        if (filteredItems.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Item não encontrado",
          });
        } else {
          this.renderItems = createModalContent(this.modalContent, this.closeModalButton, () => this.generateContent(filteredItems));
          this.renderItems();
        }
      } catch (error) {
        const errorMessage = error.message.split(": ")[1];
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: errorMessage,
        });
      }
    });
    return searchButton;
  }

  generateContent(items) {
    const fragment = document.createDocumentFragment();

    const searchContainer = document.createElement("div");
    searchContainer.style.display = "flex";
    searchContainer.style.justifyContent = "space-between";
    searchContainer.style.marginBottom = "10px";
    fragment.appendChild(searchContainer);

    this.searchBar = this.createSearchBar();
    searchContainer.appendChild(this.searchBar);

    this.searchButton = this.createSearchButton();
    searchContainer.appendChild(this.searchButton);

    items.forEach((item) => {
      const itemCard = new CardItem(item);
      fragment.appendChild(itemCard.render());
    });

    return fragment;
  }
}
