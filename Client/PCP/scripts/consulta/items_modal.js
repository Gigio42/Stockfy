document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("openModalLink").addEventListener("click", async function (event) {
    event.preventDefault();
    document.getElementById("itemModal").style.display = "block";

    const response = await axios.get('http://localhost:3000/PCP/items');
    const items = response.data;

    const container = document.getElementById('itemContainer');
    container.innerHTML = ''; 

    items.forEach(item => {
      const itemCard = createItemCard(item);
      container.appendChild(itemCard);
    });
  });

  document.getElementById("closeItemModal").addEventListener("click", function () {
    document.getElementById("itemModal").style.display = "none";
  });
});

function createItemCard(item) {
  const itemCard = createElementWithClass('div', 'card');
  const cardBody = createElementWithClass('div', 'card-body');
  itemCard.appendChild(cardBody);

  const titleContainer = createElementWithClass('div', 'd-flex justify-content-between');
  cardBody.appendChild(titleContainer);

  const itemInfo = createElementWithClass('h5', 'card-title');
  itemInfo.textContent = `Item ID: ${item.id_item}, Part Number: ${item.part_number}, Status: ${item.Status}`;
  titleContainer.appendChild(itemInfo);

  const chapasContainer = createChapasContainer(item.chapas);
  cardBody.appendChild(chapasContainer);

  const buttonContainer = createElementWithClass('div', 'd-flex justify-content-end');
  titleContainer.appendChild(buttonContainer);

  const dropdownButton = createDropdownButton(chapasContainer);
  buttonContainer.appendChild(dropdownButton);

  const deleteButton = createDeleteButton(item.id_item);
  buttonContainer.appendChild(deleteButton);

  return itemCard;
}

function createDeleteButton(itemId) {
  const deleteButton = createElementWithClass('button', 'btn btn-danger ml-2');
  deleteButton.textContent = 'Deletar';
  deleteButton.addEventListener('click', function () {
    deleteItem(itemId);
  });
  return deleteButton;
}

async function deleteItem(itemId) {
  try {
    await axios.delete(`http://localhost:3000/PCP/items/${itemId}`);
    // Refresh the items list after deletion
    const openModalLink = document.getElementById("openModalLink");
    openModalLink.click();
  } catch (error) {
    console.error(`Error deleting item: ${error}`);
  }
}

function createDropdownButton(chapasContainer) {
  const dropdownButton = document.createElement('button');
  dropdownButton.className = 'btn btn-primary btn-sm ml-2 card-info-button';
  dropdownButton.innerHTML = '<i class="fas fa-chevron-down"></i>';
  dropdownButton.addEventListener('click', function () {
    chapasContainer.style.display = chapasContainer.style.display === 'none' ? 'block' : 'none';
  });
  return dropdownButton;
}

function createChapasContainer(chapas) {
  const chapasContainer = createElementWithClass('div', 'card-body');
  chapasContainer.style.display = 'none';
  chapas.forEach(chapa => {
    const chapaCard = createChapaCard(chapa);
    chapasContainer.appendChild(chapaCard);
  });
  return chapasContainer;
}

function createChapaCard(chapa) {
  const chapaCard = createElementWithClass('div', 'card mt-3');
  chapaCard.style.backgroundColor = '#252525';
  const cardBody = createElementWithClass('div', 'card-body');
  chapaCard.appendChild(cardBody);

  const chapaInfo = createElementWithClass('h6', 'card-subtitle mb-2 text-muted');
  chapaInfo.textContent = `Chapa ID: ${chapa.id_chapa}, ...`; 
  cardBody.appendChild(chapaInfo);

  return chapaCard;
}

function createElementWithClass(elementType, className) {
  const element = document.createElement(elementType);
  element.className = className;
  return element;
}