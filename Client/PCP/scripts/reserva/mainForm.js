import { Card } from "./card.js";
import { reservarModal } from "./modal.js";
import { fetchChapas } from "../utils/connection.js";

export class Reservar {
  constructor() {
    this.initDOMElements();
    this.selectedChapas = new Map();
    this.selectedSubcards = new Map();
    this.animationExecuted = false;
    this.sortOrder = "asc";
  }

  initDOMElements() {
    this.sortKeyElement = document.getElementById("sortKey");
    this.sortOrderElement = document.getElementById("sortOrder");
    this.filterElements = {
      comprimento: document.getElementById("filterLength"),
      largura: document.getElementById("filterWidth"),
      vincos: document.getElementById("filterVincos"),
      qualidade: document.getElementById("filterQualidade"),
      onda: document.getElementById("filterOnda"),
    };
    this.containerElement = document.getElementById("container");
    this.clearButtonElement = document.getElementById("clearButton");
    this.updateFormElement = document.getElementById("groupingForm");
  }

  initialize() {
    console.log("Initializing Reservar module");
    this.setupEventListeners();
    this.populateCards();
  }

  setupEventListeners() {
    console.log("Setting up event listeners");
    this.updateFormElement.addEventListener("submit", (event) => this.onFormSubmit(event));
    this.sortOrderElement.addEventListener("click", (event) => this.onSortOrderClick(event));
    this.clearButtonElement.addEventListener("click", () => this.clearFiltersAndSelection());
  }

  onFormSubmit(event) {
    event.preventDefault();
    this.populateCards();
  }

  async onSortOrderClick(event) {
    this.toggleSortOrder();
    this.sortOrderElement.disabled = true;

    try {
      await this.populateCards();
    } finally {
      this.sortOrderElement.disabled = false;
    }
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    const isAscending = this.sortOrder === "asc";
    this.sortOrderElement.setAttribute("data-sort", isAscending ? "ascending" : "descending");
    this.sortOrderElement.innerHTML = isAscending ? " &#8593" : " &#8595";
  }

  getFilterCriteria() {
    return Object.fromEntries(
      Object.entries(this.filterElements)
        .map(([key, element]) => [key, element.value])
        .filter(([, value]) => value),
    );
  }

  async populateCards() {
    const sortKey = this.sortKeyElement.value;
    const sortOrder = this.sortOrderElement.getAttribute("data-sort");
    const filterCriteria = this.getFilterCriteria();

    try {
      const items = await fetchChapas(sortKey, sortOrder, filterCriteria);

      this.clearContainer();
      this.renderCards(items);

      if (!this.animationExecuted) {
        this.animateCards();
        this.animationExecuted = true;
      }

      reservarModal(() => {
        const selectedChapas = Array.from(this.selectedChapas.values());
        const selectedSubcards = Array.from(this.selectedSubcards.values());
        return [selectedChapas, selectedSubcards];
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  clearContainer() {
    this.containerElement.innerHTML = "";
  }

  renderCards(items) {
    items.forEach((chapa, index) => {
      const keys = ["largura", "vincos", "qualidade", "onda", "quantidade_disponivel", "data_prevista", "status"];
      const isSelected = this.selectedChapas.has(chapa.id_chapa);
      const card = new Card(chapa, keys, index, this.sortKey, (item, isSelected) => this.onSubcardSelectionChange(item, isSelected), isSelected);
      this.containerElement.appendChild(card.createCard());
    });
  }

  onSubcardSelectionChange(item, isSelected) {
    if (item.id_chapa) {
      if (isSelected) {
        this.selectedChapas.set(item.id_chapa, item);
      } else {
        this.selectedChapas.delete(item.id_chapa);
      }
    } else if (item.id_conjugacoes) {
      if (isSelected) {
        this.selectedSubcards.set(item.id_conjugacoes, item);
      } else {
        this.selectedSubcards.delete(item.id_conjugacoes);
      }
    }
  }

  animateCards() {
    anime({
      targets: ".card.mb-3.shadow-sm",
      translateX: [-100, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 500,
      easing: "easeOutQuad",
    });
  }

  clearFiltersAndSelection() {
    Object.values(this.filterElements).forEach((element) => (element.value = ""));
    this.selectedChapas.clear();
    this.selectedSubcards.clear();
    this.populateCards();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (!window.reservarInstance) {
    window.reservarInstance = new Reservar();
    window.reservarInstance.initialize();
  }
});
