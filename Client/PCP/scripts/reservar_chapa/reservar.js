import { Card } from "./card.js";
import { handleShowSelectedButtonClick as handlePopupButtonClick } from "./modal.js";

const sortKeyElement = document.getElementById("sortKey");
const sortOrderElement = document.getElementById("sortOrder");
const filterElements = {
  comprimento: document.getElementById("filterLength"),
  largura: document.getElementById("filterWidth"),
  vincos: document.getElementById("filterVincos"),
  qualidade: document.getElementById("filterQualidade"),
  onda: document.getElementById("filterOnda"),
};
const containerElement = document.getElementById("container");
const clearButtonElement = document.getElementById("clearButton");
const updateFormElement = document.getElementById("groupingForm");
const checkboxButtons = document.querySelectorAll(".checkbox-button");

const onFormSubmit = (event) => {
  event.preventDefault();
  populateCards();
};

const onCheckboxButtonClick = function () {
  const isChecked = this.getAttribute("data-checked") === "true";
  this.setAttribute("data-checked", !isChecked);
};

const onSortOrderClick = function () {
  const isAscending = this.getAttribute("data-sort") === "asc";
  this.setAttribute("data-sort", isAscending ? "descending" : "asc");
  this.innerHTML = isAscending ? " &#8595" : " &#8593";
  populateCards();
};

const onClearButtonClick = () => {
  selectedChapas.clear();
  document.querySelectorAll(".card-checkbox").forEach((checkbox) => {
    checkbox.checked = false;
  });
};

let selectedChapas = new Map();

async function populateCards() {
  const sortKey = sortKeyElement.value;
  const sortOrder = sortOrderElement.getAttribute("data-sort");

  let filterCriteria = {};
  for (let key in filterElements) {
    const value = filterElements[key].value;
    if (value) {
      filterCriteria[key] = value;
    }
  }

  try {
    const response = await axios.get(`http://localhost:3000/PCP/chapas`, {
      params: {
        sortBy: sortKey,
        sortOrder: sortOrder,
        filterCriteria: JSON.stringify(filterCriteria),
      },
    });
    let items = response.data;

    const onSubcardSelectionChange = (chapa, isSelected) => {
      if (isSelected) {
        selectedChapas.set(chapa.id_chapa, chapa);
      } else {
        selectedChapas.delete(chapa.id_chapa);
      }
    };

    containerElement.innerHTML = "";
    items.forEach((chapa, index) => {
      const keys = ["medida", "vincos", "qualidade", "onda", "quantidade_comprada", "quantidade_estoque", "data_prevista", "status"];
      const card = new Card(chapa, keys, index, sortKey, onSubcardSelectionChange, selectedChapas.has(chapa.id_chapa));
      const cardElement = card.create();
      containerElement.appendChild(cardElement);
    });

    handlePopupButtonClick(() => Array.from(selectedChapas.values()));
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

updateFormElement.addEventListener("submit", onFormSubmit);
checkboxButtons.forEach((button) => button.addEventListener("click", onCheckboxButtonClick));
sortOrderElement.addEventListener("click", onSortOrderClick);
clearButtonElement.addEventListener("click", onClearButtonClick);

populateCards();
