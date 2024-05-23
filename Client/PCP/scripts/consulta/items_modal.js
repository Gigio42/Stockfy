document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("openModalLink").addEventListener("click", async function (event) {
    event.preventDefault();
    document.getElementById("itemModal").style.display = "block";

    const response = await fetch('http://localhost:3000/PCP/items');
    const items = await response.json();

    const container = document.getElementById('itemContainer');
    container.innerHTML = ''; // Clear the container

    items.forEach(item => {
      const itemCard = document.createElement('div');
      itemCard.className = 'item-card';

      const itemInfo = document.createElement('div');
      itemInfo.textContent = `Item ID: ${item.id_item}, Part Number: ${item.part_number}, Status: ${item.Status}`;
      itemCard.appendChild(itemInfo);

      const dropdownButton = document.createElement('button');
      dropdownButton.textContent = 'Show Chapas';
      dropdownButton.addEventListener('click', function () {
        const chapasContainer = this.nextElementSibling;
        chapasContainer.style.display = chapasContainer.style.display === 'none' ? 'block' : 'none';
      });
      itemCard.appendChild(dropdownButton);

      const chapasContainer = document.createElement('div');
      chapasContainer.style.display = 'none';
      item.chapas.forEach(chapa => {
        const chapaCard = document.createElement('div');
        chapaCard.className = 'chapa-card';
        chapaCard.textContent = `Chapa ID: ${chapa.id_chapa}, ...`; // Add other chapa properties here
        chapasContainer.appendChild(chapaCard);
      });
      itemCard.appendChild(chapasContainer);

      container.appendChild(itemCard);
    });
  });

  document.getElementById("closeItemModal").addEventListener("click", function () {
    document.getElementById("itemModal").style.display = "none";
  });
});