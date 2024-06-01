//============================================
// Função para lidar com a lógica do Dark Mode
//============================================

function handleDarkModeToggle() {
  var darkModeToggle = document.getElementById("darkModeToggle");
  var body = document.body;

  darkModeToggle.addEventListener("change", function () {
    body.classList.toggle("dark-mode", darkModeToggle.checked);
    localStorage.setItem("darkMode", darkModeToggle.checked ? "enabled" : "disabled");

    var aside = document.getElementById("aside");
    if (aside) {
      aside.classList.toggle("dark-mode-aside", darkModeToggle.checked);
    }
  });

  if (localStorage.getItem("darkMode") === "enabled") {
    darkModeToggle.checked = true;
    body.classList.add("dark-mode");

    var aside = document.getElementById("aside");
    if (aside) {
      aside.classList.add("dark-mode-aside");
    }
  }
}

//============================================
// Função para buscar e exibir as máquinas
//============================================

async function fetchMaquinas() {
  try {
    const response = await axios.get("http://localhost:3000/adm/maquina");
    const maquinas = response.data;

    maquinas.forEach((maquina) => {
      createMaquinaCard(maquina);
    });
  } catch (error) {
    console.error("Houve um erro!", error);
  }
}

//============================================
// Função para criar um card de máquina
//============================================

function createMaquinaCard(maquina) {
  let allMaquina = document.getElementById("allMaquina");
  let cardMaquina = document.createElement("div");
  cardMaquina.className = "cardMaquina";

  let maquinaName = document.createElement("span");
  maquinaName.textContent = maquina.nome;
  cardMaquina.appendChild(maquinaName);

  let svgIcon = document.createElement("img");
  svgIcon.src = "media/icons8-link-externo.svg";
  svgIcon.alt = "External link icon";
  svgIcon.classList.add("svgIcon", "abrirModal");
  cardMaquina.appendChild(svgIcon);

  svgIcon.addEventListener("click", function () {
    openModal(maquinaName.textContent, maquina.id_maquina);
  });

  allMaquina.appendChild(cardMaquina);
}

//========================
//modal
//========================

function openModal(maquinaName, maquinaId) {
  var modal = document.getElementById("myModal");
  modal.style.display = "block";

  var modalContent = modal.querySelector(".modal-content");
  var span = modalContent.querySelector("span");
  span.textContent = maquinaName;

  fetchitens(maquinaId);

  modal.addEventListener("click", closeModal);
  modalContent.addEventListener("click", function (event) {
    event.stopPropagation();
  });
}

function closeModal() {
  document.getElementById("myModal").style.display = "none";
}
//=================================================
// Função para adicionar item
//=================================================

async function adicionarItem(itemId, maquinaId) {
  try {
    const response = await axios.post(`http://localhost:3000/adm/maquina/${maquinaId}/item/${itemId}/produzindo`);
    console.log(response.data);
  } catch (error) {
    console.error("Erro ao adicionar item:", error);
  }
}
//=================================================
// Função para buscar e exibir os itens
//=================================================

async function fetchitens(maquinaId) {
  try {
    const response = await axios.get("http://localhost:3000/adm/items/chapas");
    const itens = response.data;

    let reservados = document.getElementById("reservados");
    if (!reservados) {
      console.error("Elemento #reservados não encontrado");
      return;
    }
    reservados.innerHTML = "";

    itens.forEach((item) => {
      createItemCard(item, maquinaId);
    });

    console.log("Finalizou o processamento dos itens");
  } catch (error) {
    console.error("Erro ao recuperar os itens!", error);
  }
}

//=================================================
// Função para criar um card de item
//=================================================

function createItemCard(item, maquinaId) {
  let reservados = document.getElementById("reservados");
  let card = document.createElement("div");
  card.className = "card";

  let partNumberInfo = document.createElement("h3");
  partNumberInfo.textContent = `${item.part_number}`;
  card.appendChild(partNumberInfo);

  item.chapas.forEach((chapa) => {
    let subcard = document.createElement("div");
    subcard.className = "subcard";

    let chapaInfo = document.createElement("p");
    chapaInfo.innerHTML = `${chapa.medida}<br>${chapa.quantidade_comprada}`;
    subcard.appendChild(chapaInfo);

    card.appendChild(subcard);
  });

  let adicionarItemButton = document.createElement("button");
  adicionarItemButton.textContent = "Adicionar Item";
  card.appendChild(adicionarItemButton);
  adicionarItemButton.dataset.id = item.id_item;

  card.addEventListener("click", () => {
    card.classList.toggle("expanded");
  });

  adicionarItemButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      console.log("ID do item:", item.id_item);
      console.log("ID da máquina:", maquinaId);
      await adicionarItem(item.id_item, maquinaId);
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  });

  reservados.appendChild(card);
}

//=================================================
// Chama as funções necessárias ao carregar a página
//=================================================

window.onload = function () {
  handleDarkModeToggle();
  fetchMaquinas();
};
