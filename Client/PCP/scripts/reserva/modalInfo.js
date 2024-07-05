export class ModalInfo {
  constructor() {
    this.modal = document.getElementById("infoModal");
    this.modalContent = document.getElementById("infoContainer");
    this.closeInfoModalButton = document.getElementById("closeInfoModal");
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    if (!this.closeInfoModalButton) {
      this.closeInfoModalButton = document.getElementById("closeInfoModal");
    }

    if (this.closeInfoModalButton) {
      this.closeInfoModalButton.addEventListener("click", this.closeModal.bind(this));
    }

    this.modal.addEventListener("click", this.closeModal.bind(this));
    this.modalContent.addEventListener("click", (event) => event.stopPropagation());

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.closeModal();
      }
    });

    this.initialized = true;
  }

  openModal(item) {
    this.initialize();
    this.modal.classList.add("open");
    this.modalContent.style.maxHeight = "70vh";
    this.modalContent.style.overflowY = "auto";
    this.generateContent(item);
  }

  closeModal() {
    this.modal.classList.remove("open");
    while (this.modalContent.firstChild) {
      this.modalContent.removeChild(this.modalContent.firstChild);
    }
  }

  generateContent(item) {
    this.modalContent.innerHTML = "";

    const container = document.createElement("div");
    container.className = "container-fluid";

    const itemJson = JSON.parse(JSON.stringify(item, null, 2));
    const entries = Object.entries(itemJson);

    entries.forEach(([key, value], index) => {
      let row;
      if (index % 3 === 0) {
        row = document.createElement("div");
        row.className = "row";
        container.appendChild(row);
      } else {
        row = container.lastChild;
      }

      const col = document.createElement("div");
      col.className = "col-md-4";
      row.appendChild(col);

      const card = document.createElement("div");
      card.className = "card";
      col.appendChild(card);

      const cardBody = document.createElement("div");
      cardBody.className = "card-body info-card";
      card.appendChild(cardBody);

      const cardTitle = document.createElement("h5");
      cardTitle.className = "card-title";
      cardTitle.textContent = key;
      cardBody.appendChild(cardTitle);

      const cardText = document.createElement("p");
      cardText.className = "card-text";
      cardText.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
      cardBody.appendChild(cardText);
    });

    this.modalContent.appendChild(container);
  }
}
