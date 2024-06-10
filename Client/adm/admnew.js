//============================================
// Função para lidar com a lógica do Dark Mode
//============================================

function handleDarkModeToggle() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  darkModeToggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode", darkModeToggle.checked);
    localStorage.setItem("darkMode", darkModeToggle.checked ? "enabled" : "disabled");

    const aside = document.getElementById("aside");
    if (aside) {
      aside.classList.toggle("dark-mode-aside", darkModeToggle.checked);
    }
  });

  if (localStorage.getItem("darkMode") === "enabled") {
    darkModeToggle.checked = true;
    body.classList.add("dark-mode");

    const aside = document.getElementById("aside");
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
  const allMaquina = document.getElementById("allMaquina");
  const cardMaquina = document.createElement("div");
  cardMaquina.className = "cardMaquina";

  const maquinaName = document.createElement("span");
  maquinaName.textContent = maquina.nome;
  maquinaName.className ="maquinaName"
  cardMaquina.appendChild(maquinaName);

  const svgIcon = document.createElement("img");
  svgIcon.src = "media/icons8-link-externo.svg";
  svgIcon.alt = "External link icon";
  svgIcon.classList.add("svgIcon", "abrirModal");
  cardMaquina.appendChild(svgIcon);

  svgIcon.addEventListener("click", () => {
    openModal(maquinaName.textContent, maquina.id_maquina);
  });

  allMaquina.appendChild(cardMaquina);
}

//============================================
// Função para abrir o modal
//============================================

let currentMaquinaId;

function openModal(maquinaName, maquinaId) {
  currentMaquinaId = maquinaId;
  const modal = document.getElementById("myModal");
  modal.style.display = "block";

  const modalContent = modal.querySelector(".modal-content");
  const span = modalContent.querySelector("span");
  span.textContent = maquinaName;

  fetchitens(maquinaId);

  modal.addEventListener("click", closeModal);
  modalContent.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

function closeModal() {
  const modalContent2 = document.querySelector(".modal-content-2");

  if (!modalContent2.classList.contains("d-none")) {
    return;
  }

  document.getElementById("myModal").style.display = "none";
}

//=================================================
// Função para buscar e exibir os itens
//=================================================

async function fetchitens(maquinaId) {
  try {
    const response = await axios.get("http://localhost:3000/adm/items/chapas");
    const itens = response.data;
    console.log("Itens recuperados:", itens);

    const reservados = document.getElementById("reservados");
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

function adicionarItemAoStaged(item, maquinaId) {
  const stagedItems = document.getElementById("stagedItems");

  const card = document.createElement("div");
  card.className = "stagedCard";

  const partNumberInfo = document.createElement("h3");
  partNumberInfo.textContent = `${item.part_number}`;
  card.appendChild(partNumberInfo);

  const prazoInput = document.createElement("input");
  prazoInput.type = "text";
  prazoInput.placeholder = "Prazo";
  prazoInput.className = "inputPrazo";
  card.appendChild(prazoInput);

  const medidaInput = document.createElement("input");
  medidaInput.type = "text";
  medidaInput.placeholder = "corte";
  medidaInput.className = "inputMedida";
  card.appendChild(medidaInput);

  const ordemInput = document.createElement("input");
  ordemInput.type = "text";
  ordemInput.placeholder = "Ordem";
  ordemInput.className = "inputOrdem";
  card.appendChild(ordemInput);

  item.chapas.forEach((chapa) => {
    const subcard = document.createElement("div");
    subcard.className = "subcard";

    const chapaInfo = document.createElement("p");
    chapaInfo.innerHTML = `${chapa.corte}<br>${chapa.quantidade_comprada}`;
    subcard.appendChild(chapaInfo);

    card.appendChild(subcard);
  });

  const removeButton = document.createElement("button");
  removeButton.textContent = "x";
  removeButton.className = "removeButton";
  card.appendChild(removeButton);

  removeButton.addEventListener("click", () => {
    stagedItems.removeChild(card);
  });

  card.dataset.id = item.id_item;
  card.dataset.maquinaId = maquinaId;
  stagedItems.appendChild(card);

  console.log("Item adicionado à área de staged:", item);
}

//============================================================
// Função para confirmar os itens na área de "staged"
//=============================================================

//============================================================
// Função para confirmar os itens na área de "staged"
//=============================================================
async function confirmarItensStaged(event) {
  event.preventDefault(); // Evita a recarga da página

  const stagedItems = document.getElementById("stagedItems").children;

  for (const itemCard of stagedItems) {
    const itemId = itemCard.dataset.id;
    const maquinaId = currentMaquinaId;

    const prazo = itemCard.querySelector(".inputPrazo").value;
    const corte = itemCard.querySelector(".inputMedida").value;
    const ordem = itemCard.querySelector(".inputOrdem").value;

    try {
      const response = await axios.post(`http://localhost:3000/adm/maquina/${maquinaId}/item/${itemId}/produzindo`, {
        prazo: prazo,
        corte: corte,
        ordem: ordem,
      });

      console.log("Item confirmado:", response.data);
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  }

  document.getElementById("stagedItems").innerHTML = "";
  alert("Itens confirmados com sucesso!");
}

document.getElementById("confirmButton").addEventListener("click", confirmarItensStaged);

//=================================================
// Função para criar o card de item
//=================================================
function createItemCard(item, maquinaId) {
  const reservados = document.getElementById("reservados");
  const card = document.createElement("div");
  card.className = "card";

  const titleContainer = document.createElement("div");
  titleContainer.className = "title-container";

  const partNumberInfo = document.createElement("h3");
  partNumberInfo.textContent = `${item.part_number}`;
  titleContainer.appendChild(partNumberInfo);

  const imgContainer = document.createElement("div");
  imgContainer.className = "img-container";

  const arrowImage = document.createElement("img");
  arrowImage.src = "media/seta-para-a-direita.png";
  arrowImage.alt = "Seta para a direita";
  arrowImage.classList.add("arrow-icon");
  imgContainer.appendChild(arrowImage);

  titleContainer.appendChild(imgContainer);
  card.appendChild(titleContainer);

  item.chapas.forEach((chapa) => {
    const subcard = document.createElement("div");
    subcard.className = "subcard";

    const chapaInfo = document.createElement("p");
    chapaInfo.innerHTML = `Chapa: ${chapa.medida}<br>Quant.: ${chapa.quantidade_comprada}`;
    subcard.appendChild(chapaInfo);

    card.appendChild(subcard);
  });

  const adicionarItemButton = document.createElement("button");
  adicionarItemButton.textContent = "Adicionar";
  adicionarItemButton.className = "addItem";
  card.appendChild(adicionarItemButton);
  adicionarItemButton.dataset.id = item.id_item;

  titleContainer.addEventListener("click", () => {
    card.classList.toggle("expanded");
  });

  adicionarItemButton.removeEventListener("click", adicionarItemAoStaged); // Remova o evento anterior
  adicionarItemButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    adicionarItemAoStaged(item, maquinaId);
  });

  reservados.appendChild(card);

  console.log("Item criado:", item); // Log do item criado
}

//============================================================
// Botão para abrir o modal com os itens e seus status
//============================================================

let itensRecuperados = false; // Variável para controlar se os itens já foram recuperados

document.getElementById("MostrarProg").addEventListener("click", function () {
  const modalContent2 = document.querySelector(".modal-content-2");
  modalContent2.classList.remove("d-none");

  const maquinaId = currentMaquinaId;

  if (!itensRecuperados) {
    // Verificar se os itens já foram recuperados
    fetchAllItems(maquinaId);
    itensRecuperados = true; // Definir a variável para true para indicar que os itens foram recuperados
  }
});

//===============================================================================
// Função para buscar e exibir todos os itens PRODUZINDO e FINALIZADO para a máquina específica
//===============================================================================

async function fetchAllItems(maquinaId) {
  try {
    const response = await axios.get(`http://localhost:3000/adm/maquina/${maquinaId}/item`);
    const allItems = response.data;

    console.log("Itens encontrados/listados:", allItems); // Log com todos os itens encontrados/listados

    const produzindoItemList = document.getElementById("produzindoItemsList");
    const finalizadoItemList = document.getElementById("finalizadoItemsList");

    if (!produzindoItemList || !finalizadoItemList) {
      console.error("Elementos #produzindoItemsList ou #finalizadoItemsList não encontrados");
      return;
    }

    // Limpar as listas antes de adicionar novos itens
    produzindoItemList.innerHTML = "";
    finalizadoItemList.innerHTML = "";

    // Adicionar novos itens às listas
    allItems.forEach((item) => {
      createProduzindoItemCard(item);
    });

    // Chamada única para logItemPositions após adicionar todos os itens em ambas as listas
    logItemPositions(produzindoItemList); // Chama a função para exibir as posições no console para a lista de itens produzindo
    logItemPositions(finalizadoItemList); // Chama a função para exibir as posições no console para a lista de itens finalizados
  } catch (error) {
    console.error("Erro ao recuperar os itens!", error);
  }
}

//===============================================================================
// Função para criar os cards de status de cada item maquina
//===============================================================================


function createProduzindoItemCard(item) {
  const containerId = `container-${item.id_item}-${item.part_number}-${item.status}`;

  const itemContainer = document.createElement("div");
  itemContainer.className = "item-container";
  itemContainer.id = containerId;
  itemContainer.draggable = true;
  itemContainer.dataset.idItem = item.id_item; // Adiciona o id_item como um atributo data

  const icon = document.createElement("img");
  icon.src = "media/icons8-arraste-para-reordenar-50.png";
  icon.className = "drag-icon";
  itemContainer.appendChild(icon);

  const itemCard = document.createElement("div");
  itemCard.className = "item-card";
  itemCard.id = `item-${item.part_number}`;

  const partNumberElement = document.createElement("h3");
  partNumberElement.textContent = `${item.part_number}`;
  itemCard.appendChild(partNumberElement);

  const statusElement = document.createElement("p");
  statusElement.textContent = `${item.status}`;
  statusElement.className = item.status === "PRODUZINDO" ? "status-produzindo" : "status-finalizado";
  itemCard.appendChild(statusElement);

  const ordemElement = document.createElement("p");
  ordemElement.textContent = `Ordem: ${item.ordem}`;
  itemCard.appendChild(ordemElement);

  itemContainer.appendChild(itemCard);

  const listContainer = document.getElementById(item.status === "PRODUZINDO" ? "produzindoItemsList" : "finalizadoItemsList");

  if (listContainer) {
    const renumberItems = () => {
      const items = listContainer.querySelectorAll(".item-container");
      items.forEach((item, index) => {
        item.querySelector(".item-number").textContent = `${index + 1} `;
      });
      logItemPositions(listContainer);
    };

    itemContainer.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", itemContainer.id);
      itemContainer.classList.add("dragging");
    });

    itemContainer.addEventListener("dragend", () => {
      itemContainer.classList.remove("dragging");
    });

    listContainer.addEventListener("dragover", (event) => {
      event.preventDefault();
      const afterElement = getDragAfterElement(listContainer, event.clientY);
      const draggable = document.querySelector(".dragging");
      if (afterElement !== draggable.nextElementSibling && afterElement !== draggable) {
        if (afterElement == null) {
          listContainer.appendChild(draggable);
        } else {
          listContainer.insertBefore(draggable, afterElement);
        }
      }
    });

    listContainer.addEventListener("drop", (event) => {
      event.preventDefault();
      const idItemContainerBeingDragged = event.dataTransfer.getData("text/plain");
      const itemContainerBeingDragged = document.getElementById(idItemContainerBeingDragged);
      if (itemContainerBeingDragged) {
        const afterElement = getDragAfterElement(listContainer, event.clientY);
        if (afterElement == null) {
          listContainer.appendChild(itemContainerBeingDragged);
        } else {
          listContainer.insertBefore(itemContainerBeingDragged, afterElement);
        }
        renumberItems();
      }
    });

    const itemCount = listContainer.querySelectorAll(".item-container").length + 1;

    const itemNumberElement = document.createElement("span");
    itemNumberElement.textContent = `${itemCount} `;
    itemNumberElement.className = "item-number";
    itemCard.insertBefore(itemNumberElement, partNumberElement);

    listContainer.appendChild(itemContainer);

  } else {
    console.error("Elemento não encontrado ao criar cartão do item");
  }
}



function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll(".item-container:not(.dragging)")];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY },
  ).element;
}

//=================================================
// Função para Abrir o modal de finalizados
//=================================================

// Seleciona o botão e o modal
const listarFinalizadosButton = document.getElementById("ListarFinalizados");
const modalContent = document.querySelector(".modal-content-3");
const voltarButton = document.getElementById("voltarModalContent");

// Adiciona um evento de clique para abrir o modal
listarFinalizadosButton.addEventListener("click", () => {
  modalContent.classList.add("show");
});

// Adiciona um evento de clique para fechar o modal
voltarButton.addEventListener("click", () => {
  modalContent.classList.remove("show");
});

//=================================================
// função para fechar o modalcontent 2 e 3
//=================================================

// Adicionar event listeners para voltarModalContent
const voltarButton1 = document.getElementById("voltarModalContent");
const voltarButton2 = document.getElementById("voltarModalContent2");
const modalContent2 = document.querySelector(".modal-content-2");
const modalContent3 = document.querySelector(".modal-content-3");

if (voltarButton1 && voltarButton2 && modalContent2 && modalContent3) {
  voltarButton1.addEventListener("click", () => {
    modalContent2.classList.add("d-none");
    modalContent3.classList.add("d-none");
  });

  voltarButton2.addEventListener("click", () => {
    modalContent2.classList.remove("d-none");
    modalContent3.classList.add("d-none");
  });

  listarFinalizadosButton.addEventListener("click", () => {
    modalContent2.classList.add("d-none");
    modalContent3.classList.remove("d-none");
    console.log("modal-content-2 escondido, modal-content-3 mostrado");
  })

} else {
  console.error("Não foi possível encontrar um ou mais elementos necessários para adicionar event listeners.");
}

function logItemPositions(listContainer) {
  const items = listContainer.querySelectorAll(".item-container");
  items.forEach((item, index) => {
    const position = index + 1; // Armazenando a posição em uma variável
    const partNumber = item.querySelector(".item-card h3").textContent;
    console.log(`Posição: ${position}, Part Number: ${partNumber}`);
  });
}

//=================================================
// função para CONFIRMAR prioridade
//=================================================

document.getElementById("confirmarOrdem").addEventListener("click", async () => {
  try {
    const listContainer = document.getElementById("produzindoItemsList");
    const items = listContainer.querySelectorAll(".item-container");

    const newPriorities = Array.from(items).map((item, index) => {
      const id_item = parseInt(item.dataset.idItem, 10); // Extrai o id_item do atributo data

      return {
        id_item: id_item,
        prioridade: index + 1
      };
    });

    console.log("Dados enviados para atualização de prioridades:", newPriorities);

    await axios.post("http://localhost:3000/adm/atualizar-prioridades", newPriorities);
    alert("Prioridades atualizadas com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar as prioridades:", error);
    alert("Erro ao atualizar as prioridades. Verifique o console para mais detalhes.");
  }
});




document.addEventListener("DOMContentLoaded", () => {
  handleDarkModeToggle();
  fetchMaquinas();
});
