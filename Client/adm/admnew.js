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

let currentMaquinaId;

function openModal(maquinaName, maquinaId) {
  currentMaquinaId = maquinaId;
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
  var modalContent2 = document.querySelector(".modal-content-2");

  if (!modalContent2.classList.contains("d-none")) {
    return;
  }

  document.getElementById("myModal").style.display = "none";
}

//=================================================
// Função para adicionar item
//=================================================

async function adicionarItem(itemId, maquinaId) {
  try {
    const response = await axios.post(`http://localhost:3000/adm/maquina/${maquinaId}/item/${itemId}/produzindo`);
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
  } catch (error) {
    console.error("Erro ao recuperar os itens!", error);
  }
}

//=================================================
// Função para adicionar item à área de "staged"
//=================================================

function adicionarItemAoStaged(item, maquinaId) {
  let stagedItems = document.getElementById("stagedItems");

  let card = document.createElement("div");
  card.className = "stagedCard";

  let partNumberInfo = document.createElement("h3");
  partNumberInfo.textContent = `${item.part_number}`;
  card.appendChild(partNumberInfo);

  // Input para prazo
  let prazoInput = document.createElement("input");
  prazoInput.type = "text";
  prazoInput.placeholder = "Prazo";
  prazoInput.className = "inputPrazo";
  card.appendChild(prazoInput);

  // Input para corte
  let medidaInput = document.createElement("input");
  medidaInput.type = "text";
  medidaInput.placeholder = "corte";
  medidaInput.className = "inputMedida";
  card.appendChild(medidaInput);

  // Input para ordem
  let ordemInput = document.createElement("input");
  ordemInput.type = "text";
  ordemInput.placeholder = "Ordem";
  ordemInput.className = "inputOrdem";
  card.appendChild(ordemInput);

  item.chapas.forEach((chapa) => {
    let subcard = document.createElement("div");
    subcard.className = "subcard";

    let chapaInfo = document.createElement("p");
    chapaInfo.innerHTML = `${chapa.corte}<br>${chapa.quantidade_comprada}`;
    subcard.appendChild(chapaInfo);

    card.appendChild(subcard);
  });

  let removeButton = document.createElement("button");
  removeButton.textContent = "x";
  removeButton.className = "removeButton";
  card.appendChild(removeButton);

  removeButton.addEventListener("click", () => {
    stagedItems.removeChild(card);
  });

  card.dataset.id = item.id_item;
  card.dataset.maquinaId = maquinaId;
  stagedItems.appendChild(card);
}

//============================================================
//Função para confirmar o item que está na area de staged
//=============================================================

async function confirmarItensStaged() {
  let stagedItems = document.getElementById("stagedItems").children;

  for (let itemCard of stagedItems) {
    let itemId = itemCard.dataset.id;
    let maquinaId = currentMaquinaId;

    // Capturar os valores dos campos de entrada
    let prazo = itemCard.querySelector(".inputPrazo").value;
    let corte = itemCard.querySelector(".inputMedida").value;
    let ordem = itemCard.querySelector(".inputOrdem").value;

    try {
      // Incluir os valores no corpo da solicitação
      await axios.post(`http://localhost:3000/adm/maquina/${maquinaId}/item/${itemId}/produzindo`, {
        prazo: prazo,
        corte: corte,
        ordem: ordem,
      });
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  }

  document.getElementById("stagedItems").innerHTML = "";
  alert("Itens confirmados com sucesso!");
}

document.getElementById("confirmButton").addEventListener("click", confirmarItensStaged);

//=================================================
// Função para buscar e exibir os itens (atualizada)
//=================================================
function createItemCard(item, maquinaId) {
  let reservados = document.getElementById("reservados");
  let card = document.createElement("div");
  card.className = "card";

  // Criar um contêiner para o título e a imagem
  let titleContainer = document.createElement("div");
  titleContainer.className = "title-container";

  // Adicionar o h3 dentro do contêiner do título
  let partNumberInfo = document.createElement("h3");
  partNumberInfo.textContent = `${item.part_number}`;
  titleContainer.appendChild(partNumberInfo);

  // Criar o contêiner da imagem
  let imgContainer = document.createElement("div");
  imgContainer.className = "img-container";

  // Criar a imagem e adicioná-la ao contêiner da imagem
  let arrowImage = document.createElement("img");
  arrowImage.src = "media/seta-para-a-direita.png";
  arrowImage.alt = "Seta para a direita";
  arrowImage.classList.add("arrow-icon");
  imgContainer.appendChild(arrowImage);

  // Adicionar o contêiner da imagem ao contêiner do título
  titleContainer.appendChild(imgContainer);

  // Adicionar o contêiner do título ao card
  card.appendChild(titleContainer);

  item.chapas.forEach((chapa) => {
    let subcard = document.createElement("div");
    subcard.className = "subcard";

    let chapaInfo = document.createElement("p");
    chapaInfo.innerHTML = `Chapa: ${chapa.medida}<br>Quant.: ${chapa.quantidade_comprada}`;
    subcard.appendChild(chapaInfo);

    card.appendChild(subcard);
  });

  let adicionarItemButton = document.createElement("button");
  adicionarItemButton.textContent = "Adicionar";
  adicionarItemButton.className = "addItem";
  card.appendChild(adicionarItemButton);
  adicionarItemButton.dataset.id = item.id_item;

  // Adicionar evento de clique ao contêiner do título
  titleContainer.addEventListener("click", () => {
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

//============================================================
//botão para abrir p modal com os itens e seus status
//============================================================

document.getElementById("MostrarProg").addEventListener("click", function () {
  var modalContent2 = document.querySelector(".modal-content-2");
  modalContent2.classList.remove("d-none");

  var maquinaId = currentMaquinaId;

  fetchAllItems(maquinaId);
});

document.getElementById("voltarModalContent").addEventListener("click", function () {
  var modalContent2 = document.querySelector(".modal-content-2");
  modalContent2.classList.add("d-none");
});

//===============================================================================
// Função para buscar e exibir os itens PRODUZINDO para a máquina específica
//===============================================================================

async function fetchAllItems(maquinaId) {
  try {
    const response = await axios.get(`http://localhost:3000/adm/maquina/${maquinaId}/item`);

    const allItems = response.data;

    let produzindoItemList = document.getElementById("produzindoItemsList");
    if (!produzindoItemList) {
      console.error("Elemento #produzindoItemsList não encontrado");
      return;
    }
    produzindoItemList.innerHTML = "";

    allItems.forEach((item) => {
      createProduzindoItemCard(item);
    });
  } catch (error) {
    console.error("Erro ao recuperar os itens!", error);
  }
}

//===================================================
//função para criar o card de visualização de status de item de cada Maquina
//===================================================

function createProduzindoItemCard(item) {
  let itemCard = document.createElement("div");
  itemCard.className = "item-card";

  let partNumberElement = document.createElement("h3");
  partNumberElement.textContent = `${item.part_number}`;
  itemCard.appendChild(partNumberElement);

  let statusElement = document.createElement("p");
  statusElement.textContent = `${item.status}`;

  if (item.status === "PRODUZINDO") {
    statusElement.className = "status-produzindo";
  } else if (item.status === "FINALIZADO") {
    statusElement.className = "status-finalizado";
  }
  itemCard.appendChild(statusElement);

  let produzindoItemList = document.getElementById("produzindoItemsList");
  if (produzindoItemList) {
    produzindoItemList.appendChild(itemCard);
  } else {
    console.error("Elemento #produzindoItemsList não encontrado ao criar cartão do item");
  }
}

//=================================================
// Chama as funções necessárias ao carregar a página
//=================================================

window.onload = function () {
  handleDarkModeToggle();
  fetchMaquinas();
};
