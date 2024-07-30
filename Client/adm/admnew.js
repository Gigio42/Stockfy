import BASE_URL from "../utils/config.js";

  document.addEventListener("DOMContentLoaded", function () {
    const registerUserButton = document.getElementById("registerUserButton");
    const registerUserModal = document.getElementById("registerUserModal");
    const closeRegisterUserModal = document.getElementById("closeRegisterUserModal");

    // Abrir o modal
    registerUserButton.addEventListener("click", function () {
      registerUserModal.style.display = "flex";
    });

    // Fechar o modal
    closeRegisterUserModal.addEventListener("click", function () {
      registerUserModal.style.display = "none";
    });

    // Fechar o modal clicando fora do conteúdo do modal
    window.addEventListener("click", function (event) {
      if (event.target === registerUserModal) {
        registerUserModal.style.display = "none";
      }
    });

    // Enviar dados ao servidor
    document.getElementById("submitRegisterUserButton").addEventListener("click", function () {
      const username = document.getElementById("registerUserName").value;
      const password = document.getElementById("registerUserPassword").value;
      const role = document.getElementById("registerUserRole").value;

      // Validação simples
      if (username && password && role) {
        // Envio de dados via POST
        axios.post("http://localhost:3000/user/add", {
          username: username,
          password: password,
          cargo: role,
        })
        .then(response => {
          const { success, message } = response.data;
          if (success) {
            alert(message); // Mostra mensagem de sucesso
            registerUserModal.style.display = "none"; // Fecha modal
          } else {
            alert(message); // Mostra mensagem de erro
          }
        })
        .catch(error => {
          console.error("Erro ao cadastrar usuário:", error);
          alert("Erro ao cadastrar usuário. Tente novamente mais tarde.");
        });
      } else {
        alert("Por favor, preencha todos os campos.");
      }
    });
  });

//============================================
// Função para lidar com a lógica do Dark Mode
//============================================

function handleDarkModeToggle() {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const body = document.body;

  darkModeToggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode", darkModeToggle.checked);
    localStorage.setItem(
      "darkMode",
      darkModeToggle.checked ? "enabled" : "disabled"
    );

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
    const response = await axios.get(`${BASE_URL}/adm/maquina`);
    const maquinas = response.data;

    // Adiciona os cards completos das máquinas
    maquinas.forEach((maquina) => {
      createMaquinaCard(maquina);
    });

    // Adiciona o card para adicionar uma nova máquina
    createAddMaquinaCard();
  } catch (error) {
    console.error("Houve um erro!", error);
  }
}

function createAddMaquinaCard() {
  const allMaquina = document.getElementById("allMaquina");
  const addCard = document.createElement("div");
  (addCard.className = "cardMaquina"), "addCard";

  const addText = document.createElement("span");
  addText.textContent = "Add Processo";
  addText.className = "addText";

  const addIcon = document.createElement("img");
  addIcon.src = "media/icons8-add-48 (1).png"; // Ícone de adicionar
  addIcon.alt = "Add Machine";
  addIcon.classList.add("svgIcon");

  addCard.appendChild(addText);
  addCard.appendChild(addIcon);

  addCard.addEventListener("click", () => {
    openAddMaquinaModal();
  });

  allMaquina.appendChild(addCard);
}

async function deleteMaquina(maquinaId) {
  console.log(`Tentando deletar a máquina com ID: ${maquinaId}`);
  try {
    const response = await axios.delete(`${BASE_URL}/adm/maquina/${maquinaId}`);
    if (response.status === 204) {
      console.log(`Máquina com ID ${maquinaId} deletada com sucesso.`);
      return true; // Indica que a deleção foi bem-sucedida
    } else {
      throw new Error("Erro ao deletar a máquina: Status " + response.status);
    }
  } catch (error) {
    console.error("Erro ao deletar a máquina:", error);

    // Verifica se o erro é devido a itens associados à máquina
    if (
      error.response &&
      error.response.status === 500 &&
      error.response.data.message.includes(
        "Não é possível deletar a máquina porque há itens associados a ela."
      )
    ) {
      alert(
        "Não é possível deletar a máquina porque há itens associados a ela."
      );
    } else {
      alert(
        "Não é possível deletar a máquina porque há itens associados a ela."
      );
    }

    throw new Error("Erro ao deletar a máquina: " + error.message);
  }
}

function createMaquinaCardsInModalWithoutIcons(maquinas) {
  const modalContent = document.getElementById("modalContentMaquinas");
  modalContent.innerHTML = ""; // Limpa o conteúdo existente

  // Função para limpar a seleção atual de cards e restaurar o estado inicial
  function clearSelection() {
    const cards = document.querySelectorAll(".cardMaquinainmodal");
    cards.forEach((card) => {
      const maquinaName = card.querySelector(".maquinaName");
      const deleteIcon = card.querySelector(".deleteIcon");
      maquinaName.style.display = "block";
      deleteIcon.style.display = "none";
    });
  }

  maquinas.forEach((maquina) => {
    const cardMaquina = document.createElement("div");
    cardMaquina.className = "cardMaquinainmodal";

    const maquinaName = document.createElement("span");
    maquinaName.textContent = maquina.nome;
    maquinaName.className = "maquinaName";
    cardMaquina.appendChild(maquinaName);

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "media/icons8-delete-48.png"; // Ícone de deletar
    deleteIcon.alt = "Delete Machine";
    deleteIcon.classList.add("svgIcon", "deleteIcon");
    deleteIcon.style.display = "none"; // Inicialmente oculto
    cardMaquina.appendChild(deleteIcon);

    // Adicionar evento para exibir o ícone de deletar ao clicar no card
    cardMaquina.addEventListener("click", () => {
      clearSelection(); // Limpa qualquer seleção existente
      maquinaName.style.display = "none"; // Esconder o nome da máquina
      deleteIcon.style.display = "block"; // Mostrar o ícone de deletar
    });

    // Exemplo de uso no evento de clique do ícone de deletar
    deleteIcon.addEventListener("click", async (event) => {
      event.stopPropagation(); // Impede a propagação do evento para o card
      try {
        const success = await deleteMaquina(maquina.id_maquina); // Chama a função para deletar a máquina
        if (success) {
          cardMaquina.remove(); // Remove o card da interface após a deleção
        }
      } catch (error) {
        console.error("Erro ao deletar a máquina:", error);
        // Trate o erro, se necessário
      }
    });

    modalContent.appendChild(cardMaquina);
  });

  // Event listener para clicar fora do card e limpar a seleção
  modalContent.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.closest(".cardMaquinainmodal")) {
      clearSelection(); // Limpa a seleção ao clicar fora do card
    }
  });
}

async function openAddMaquinaModal() {
  const modal = document.getElementById("addMaquinaModal");
  modal.style.display = "block";

  try {
    const response = await axios.get(`${BASE_URL}/adm/maquina`);
    const maquinas = response.data;
    createMaquinaCardsInModalWithoutIcons(maquinas);
  } catch (error) {
    console.error("Houve um erro ao buscar as máquinas para o modal!", error);
  }
}

function closeAddMaquinaModal() {
  const modal = document.getElementById("addMaquinaModal");
  modal.style.display = "none";
}

// Fechar o modal ao clicar no "x"
document
  .querySelector(".close")
  .addEventListener("click", closeAddMaquinaModal);

// Fechar o modal ao clicar fora da área do modal
window.addEventListener("click", (event) => {
  const modal = document.getElementById("addMaquinaModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

//============================================
// Função para criar um card de máquina
//============================================

function createMaquinaCard(maquina) {
  const allMaquina = document.getElementById("allMaquina");
  const cardMaquina = document.createElement("div");
  cardMaquina.className = "cardMaquina";

  const maquinaName = document.createElement("span");
  maquinaName.textContent = maquina.nome;
  maquinaName.className = "maquinaName";
  cardMaquina.appendChild(maquinaName);

  const svgIcon = document.createElement("img");
  svgIcon.src = "media/icons8-link-externo-48.png";
  svgIcon.alt = "External link icon";
  svgIcon.classList.add("svgIcon", "abrirModal");
  cardMaquina.appendChild(svgIcon);

  svgIcon.addEventListener("click", () => {
    openModal(maquinaName.textContent, maquina.id_maquina);
  });

  allMaquina.appendChild(cardMaquina);
}

//============================================
// Função para criar um card com o nome da máquina
//============================================

function createNomeCard(maquina) {
  const container = document.getElementById("machineCardsContainer");
  const card = document.createElement("div");
  card.className = "nomeCard";

  const nome = document.createElement("span");
  nome.textContent = maquina.nome;
  nome.className = "nomeMaquina";

  card.appendChild(nome);
  container.appendChild(card);
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

  // Adiciona o listener de clique ao botão
  document
    .getElementById("voltarModalContent5", "voltarModalContentnext")
    .addEventListener("click", closeModal); // Recarrega a página);
}

document
  .getElementById("voltarModalContent5")
  .addEventListener("click", function () {
    location.reload();
  });

function closeModal() {
  const modalContent2 = document.querySelector(".modal-content-2");

  // Verifica se modalContent2 tem a classe "d-none"
  if (!modalContent2.classList.contains("d-none")) {
    return;
  }

  // Esconde o modal e o botão de volta
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

//=================================================
// Função para buscar e exibir os itens
//=================================================

async function fetchitens(maquinaId) {
  try {
    const response = await axios.get(`${BASE_URL}/adm/items/chapas`);
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
  } catch {
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
  prazoInput.type = "date";
  prazoInput.placeholder = "Prazo";
  prazoInput.className = "inputPrazo";
  prazoInput.classList.add("date-icon"); // Adiciona uma classe para estilização do ícone
  card.appendChild(prazoInput);

  const medidaInput = document.createElement("input");
  medidaInput.type = "text";
  medidaInput.placeholder = "Medida";
  medidaInput.className = "inputMedida";
  card.appendChild(medidaInput);

  const opInput = document.createElement("input");
  opInput.type = "text";
  opInput.placeholder = "OP";
  opInput.className = "inputOp";
  card.appendChild(opInput);

  const sistemaSelect = document.createElement("select");
  sistemaSelect.className = "inputSistema";
  
  // Criando as opções
  const optionJferres = document.createElement("option");
  optionJferres.value = "JFERRES";
  optionJferres.textContent = "JFERRES";
  
  const optionNovaDimensao = document.createElement("option");
  optionNovaDimensao.value = "NOVA DIMENSÃO";
  optionNovaDimensao.textContent = "NOVA DIMENSÃO";
  
  // Adicionando as opções ao select
  sistemaSelect.appendChild(optionJferres);
  sistemaSelect.appendChild(optionNovaDimensao);
  
  // Adicionando o select ao card
  card.appendChild(sistemaSelect);
  

  const clienteInput = document.createElement("input");
  clienteInput.type = "text";
  clienteInput.placeholder = "Cliente";
  clienteInput.className = "inputCliente";
  card.appendChild(clienteInput);

  const quantidadeInput = document.createElement("input");
  quantidadeInput.type = "number";
  quantidadeInput.placeholder = "Quantidade";
  quantidadeInput.className = "inputQuantidade";
  card.appendChild(quantidadeInput);

  const colaboradorInput = document.createElement("input");
  colaboradorInput.type = "text";
  colaboradorInput.placeholder = "Colaboradores";
  colaboradorInput.className = "inputColaborador";
  card.appendChild(colaboradorInput);

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
//============================================================

// Verifica se o usuário está logado
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../login/login.html";
}

// Obtém o nome do usuário do localStorage
var userName = localStorage.getItem("nome") || "UserName";

// Define o nome de usuário no elemento com id "user-name"
$("#user-name").text(userName);

// Define a imagem de perfil
var profilePic = $("#profilePic");
profilePic.attr(
  "src",
  "https://api.dicebear.com/8.x/shapes/svg?seed=" + userName
);

// Variável global para o nome de usuário
window.globalUserName = userName;

async function confirmarItensStaged(event) {
  event.preventDefault();

  const stagedItems = document.getElementById("stagedItems").children;
  const maquinaId = currentMaquinaId;

  // Obtendo o nome do usuário da variável global
  const nomeUsuario = window.globalUserName;
  console.log("Nome do usuário obtido:", nomeUsuario);

  // Verifica se há itens para confirmar
  if (stagedItems.length === 0) {
    Swal.fire({
      title: 'Nenhum item para confirmar',
      text: 'Não há itens para confirmar.',
      icon: 'info',
      confirmButtonText: 'OK',
      background: '#e9e9e9',
      customClass: {
        title: 'custom-title-class',
        content: 'custom-content-class',
        icon: 'custom-icon-class'
      }
    });
    return;
  }

  // Buscando itens existentes na máquina
  let existingItemMaquinaIds;
  try {
    const response = await axios.get(
      `${BASE_URL}/adm/maquina/${maquinaId}/item`
    );
    existingItemMaquinaIds = response.data.map((item) => item.id_item_maquina);
  } catch (error) {
    console.error("Erro ao buscar itens existentes na máquina:", error);
    return;
  }

  // Buscando prioridades dos itens existentes na tabela Item_Maquina
  let existingItems;
  try {
    const response = await axios.post(
      `${BASE_URL}/adm/maquina/itens/prioridades`,
      {
        ids: existingItemMaquinaIds,
      }
    );
    existingItems = response.data;
  } catch (error) {
    console.error("Erro ao buscar prioridades dos itens existentes:", error);
    return;
  }

  // Encontrando a maior prioridade existente
  let maxPriority = 0;
  existingItems.forEach((item) => {
    if (item.prioridade !== null && item.prioridade !== undefined) {
      maxPriority = Math.max(maxPriority, item.prioridade);
    }
  });

  // Exibindo o valor da maior prioridade encontrada no console
  console.log("Maior prioridade encontrada:", maxPriority);

  // Armazenar erros
  const errors = [];

  for (const itemCard of stagedItems) {
    const itemId = itemCard.dataset.id;
    const prazo = itemCard.querySelector(".inputPrazo").value;
    const medida = itemCard.querySelector(".inputMedida").value;
    const op = parseInt(itemCard.querySelector(".inputOp").value, 10); // Convertendo para número
    const sistema = itemCard.querySelector(".inputSistema").value;
    const cliente = itemCard.querySelector(".inputCliente").value;
    const quantidade = parseInt(itemCard.querySelector(".inputQuantidade").value, 10); // Convertendo para número
    const colaborador = itemCard.querySelector(".inputColaborador").value;
    const ordem = 1; // Define a ordem automaticamente como "1"
    const prioridade = maxPriority + 1; // Definindo a prioridade

    // Verificações e adição de erros
    if (!prazo || !medida || isNaN(op) || op <= 0 || !sistema || !cliente || isNaN(quantidade) || quantidade <= 0 || !colaborador) {
      errors.push("Campos não preenchidos são obrigatórios.");
      break; // Interrompe o loop se houver erro
    }

    try {
      console.log("Prioridade enviada para o servidor:", prioridade);
      const response = await axios.post(
        `${BASE_URL}/adm/maquina/${maquinaId}/item/${itemId}/produzindo`,
        {
          prazo: prazo,
          ordem: ordem,
          medida: medida,
          op: op,
          sistema: sistema,
          cliente: cliente,
          quantidade: quantidade,
          colaborador: colaborador,
          prioridade: prioridade, // Enviando a prioridade
          executor: nomeUsuario // Enviando o nome do usuário
        }
      );

      console.log("Dados enviados ao servidor:", {
        prazo: prazo,
        ordem: ordem,
        medida: medida,
        op: op,
        sistema: sistema,
        cliente: cliente,
        quantidade: quantidade,
        colaborador: colaborador,
        prioridade: prioridade,
        executor: nomeUsuario
      });
      console.log("Item confirmado:", response.data);
      maxPriority++; // Incrementando a prioridade para o próximo item
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
    }
  }

  if (errors.length > 0) {
    Swal.fire({
      title: 'Erro',
      text: errors.join(' '),
      icon: 'error',
      confirmButtonText: 'OK',
      background: '#e9e9e9',
      customClass: {
        title: 'custom-title-class',
        content: 'custom-content-class',
        icon: 'custom-icon-class'
      }
    });
  } else {
    document.getElementById("stagedItems").innerHTML = "";
    Swal.fire({
      title: 'Sucesso!',
      text: 'Itens confirmados com sucesso.',
      icon: 'success',
      confirmButtonText: 'OK',
      background: '#e9e9e9',
      customClass: {
        title: 'custom-title-class',
        content: 'custom-content-class',
        icon: 'custom-icon-class'
      }
    });
  }
}






document
  .getElementById("confirmButton")
  .addEventListener("click", confirmarItensStaged);

//=================================================
// Função para criar o card de item a ser programado
//=================================================
function createItemCard(item, maquinaId) {
  const reservados = document.getElementById("reservados");
  const card = document.createElement("div");
  card.className = "cardItem";

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

  const itemInfoContainer = document.createElement("div");
  itemInfoContainer.className = "item-info-container";


  card.appendChild(itemInfoContainer);

  // Adicionar informações das chapas e conjugações, se existirem
  if (item.chapas && Array.isArray(item.chapas)) {
    item.chapas.forEach((chapa) => {
      const subcard = document.createElement("div");
      subcard.className = "subcard";

      const chapaDiv = document.createElement("div");
      const chapaInfo = document.createElement("p");
      chapaInfo.textContent = `Chapa: ${chapa.chapa.medida}`;
      chapaInfo.className = "cardInfoMedida"
      chapaDiv.appendChild(chapaInfo);
      subcard.appendChild(chapaDiv);

      const quantidadeDiv = document.createElement("div");
      const quantidadeInfo = document.createElement("p");
      quantidadeInfo.textContent = `Quantidade: ${chapa.quantidade}`;
      quantidadeInfo.className = "cardInfoQuantidade"
      quantidadeDiv.appendChild(quantidadeInfo);
      subcard.appendChild(quantidadeDiv);

      // Verifica se há conjugação e a adiciona, se existir
      if (chapa.conjugacao) {
        const conjugacaoDiv = document.createElement("div");
        const conjugacaoInfo = document.createElement("p");
        conjugacaoInfo.textContent = `Conjugação: ${chapa.conjugacao.medida}`;
        conjugacaoInfo.className = "cardInfoConjugação"
        conjugacaoDiv.appendChild(conjugacaoInfo);
        subcard.appendChild(conjugacaoDiv);

        const rendimentoDiv = document.createElement("div");
        const rendimentoInfo = document.createElement("p");
        rendimentoInfo.textContent = `Rendimento: ${chapa.conjugacao.rendimento}`;
        rendimentoInfo.className = "cardInfoRendimento"
        rendimentoDiv.appendChild(rendimentoInfo);
        subcard.appendChild(rendimentoDiv);
      }

      card.appendChild(subcard);
    });
  }

  // Adicionar botão para adicionar o item
  const adicionarItemButton = document.createElement("button");
  adicionarItemButton.textContent = "Adicionar";
  adicionarItemButton.className = "addItem";
  card.appendChild(adicionarItemButton);
  adicionarItemButton.dataset.id = item.id_item;

  // Adicionar evento para expandir o card ao clicar no título
  titleContainer.addEventListener("click", () => {
    card.classList.toggle("expanded");
  });

  // Adicionar evento para adicionar o item ao staged
  adicionarItemButton.removeEventListener("click", adicionarItemAoStaged); // Remover o evento anterior
  adicionarItemButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    adicionarItemAoStaged(item, maquinaId);
  });

  // Adicionar o card ao elemento reservados
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
    const response = await axios.get(
      `${BASE_URL}/adm/maquina/${maquinaId}/item`
    );
    const allItems = response.data;

    console.log("Itens encontrados/listados:", allItems); // Log com todos os itens encontrados/listados

    const produzindoItemList = document.getElementById("produzindoItemsList");

    if (!produzindoItemList) {
      console.error("Elemento #produzindoItemsList não encontrado");
      return;
    }

    // Limpar a lista antes de adicionar novos itens
    produzindoItemList.innerHTML = "";

    // Adicionar novos itens à lista
    allItems.forEach((item) => {
      createProduzindoItemCard(item, produzindoItemList);
    });

    // Chamada única para logItemPositions após adicionar todos os itens na lista de produzindo
    logItemPositions(produzindoItemList); // Chama a função para exibir as posições no console para a lista de itens produzindo
  } catch (error) {
    console.error("Erro ao recuperar os itens!", error);
  }
}

function createProduzindoItemCard(item, produzindoItemList) {
  const containerId = `container-${item.id_item}-${item.part_number}-${item.status}`;

  const itemContainer = document.createElement("div");
  itemContainer.className = "item-container";
  itemContainer.id = containerId;
  itemContainer.draggable = true;
  itemContainer.dataset.idItem = item.id_item; // Adiciona o id_item como um atributo data
  itemContainer.dataset.idItemMaquina = item.id_item_maquina; // Adiciona o id_item_maquina como um atributo data

  // Exibir id_item_maquina no console
  console.log("id_item_maquina:", item.id_item_maquina);

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
  statusElement.className =
    item.status === "PRODUZINDO"
      ? "status-produzindo"
      : item.status === "FINALIZADO"
        ? "status-finalizado"
        : "status-programado";
  itemCard.appendChild(statusElement);

  itemContainer.appendChild(itemCard);

  if (produzindoItemList) {
    const renumberItems = () => {
      const items = produzindoItemList.querySelectorAll(".item-container");
      items.forEach((item, index) => {
        item.querySelector(".item-number").textContent = `${index + 1} `;
      });
      logItemPositions(produzindoItemList);
    };

    itemContainer.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", itemContainer.id);
      itemContainer.classList.add("dragging");
    });

    itemContainer.addEventListener("dragend", () => {
      itemContainer.classList.remove("dragging");
    });

    produzindoItemList.addEventListener("dragover", (event) => {
      event.preventDefault();
      const afterElement = getDragAfterElement(produzindoItemList, event.clientY);
      const draggable = document.querySelector(".dragging");
      if (
        afterElement !== draggable.nextElementSibling &&
        afterElement !== draggable
      ) {
        if (afterElement == null) {
          produzindoItemList.appendChild(draggable);
        } else {
          produzindoItemList.insertBefore(draggable, afterElement);
        }
      }
    });

    produzindoItemList.addEventListener("drop", (event) => {
      event.preventDefault();
      const idItemContainerBeingDragged =
        event.dataTransfer.getData("text/plain");
      const itemContainerBeingDragged = document.getElementById(
        idItemContainerBeingDragged
      );
      if (itemContainerBeingDragged) {
        const afterElement = getDragAfterElement(produzindoItemList, event.clientY);
        if (afterElement == null) {
          produzindoItemList.appendChild(itemContainerBeingDragged);
        } else {
          produzindoItemList.insertBefore(itemContainerBeingDragged, afterElement);
        }
        renumberItems();
      }
    });

    const itemCount =
      produzindoItemList.querySelectorAll(".item-container").length + 1;

    const itemNumberElement = document.createElement("span");
    itemNumberElement.textContent = `${itemCount} `;
    itemNumberElement.className = "item-number";
    itemCard.insertBefore(itemNumberElement, partNumberElement);

    produzindoItemList.appendChild(itemContainer);
  } else {
    console.error("Elemento não encontrado ao criar cartão do item");
  }
}


function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".item-container:not(.dragging)"),
  ];

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
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

//=================================================
// Função para Abrir o modal de finalizados
//=================================================

// Seleciona o botão e o modal
const modalContent = document.querySelector(".modal-content-3");
const voltarButton = document.getElementById("voltarModalContent");


// Adiciona um evento de clique para fechar o modal
voltarButton.addEventListener("click", () => {
  modalContent.classList.remove("show");
});

//=================================================
// função para fechar o modalcontent 2
//=================================================

// Adicionar event listener para voltarModalContent
const voltarButton1 = document.getElementById("voltarModalContent");
const voltarButton2 = document.getElementById("voltarModalContent2");
const modalContent2 = document.querySelector(".modal-content-2");

if (voltarButton1 && voltarButton2 && modalContent2) {
  voltarButton1.addEventListener("click", () => {
    modalContent2.classList.add("d-none");
  });

  voltarButton2.addEventListener("click", () => {
    modalContent2.classList.remove("d-none");
  });
} else {
  console.error(
    "Não foi possível encontrar um ou mais elementos necessários para adicionar event listeners."
  );
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
// função para abrir e fechar o nextProcessModal
//=================================================

// Adicione essa função ao seu arquivo JavaScript existente (admnew.js)
$(document).ready(function () {
  // Quando o botão "próximo processo" for clicado, exiba o modal
  $("#optionsButton").click(function () {
    $("#nextProcessModal").css("display", "block");
  });

  // Quando o usuário clicar fora do modal, feche o modal
  $(window).click(function (event) {
    if (event.target == $("#nextProcessModal")[0]) {
      $("#nextProcessModal").css("display", "none");
    }
  });

  // Quando o usuário clicar no botão de fechar no modal, feche o modal
  $(".close").click(function () {
    $("#nextProcessModal").css("display", "none");
  });
});

async function createEmptyCard(cardWrapper) {
  const emptyCard = document.createElement("div");
  emptyCard.className = "empty-card";
  emptyCard.textContent = "Selecione";
  cardWrapper.appendChild(emptyCard);

  emptyCard.addEventListener("click", async (event) => {
    const existingMachineList = emptyCard.querySelector(".machine-list");
    if (existingMachineList) {
      if (
        !event.target.classList.contains("machine-list") &&
        !event.target.classList.contains("machine-card")
      ) {
        existingMachineList.remove();
      }
      return;
    }

    try {
      const machinesResponse = await axios.get(`${BASE_URL}/adm/maquina`);
      const machines = machinesResponse.data;

      const machineList = document.createElement("ul");
      machineList.className = "machine-list";

      machines.forEach((machine) => {
        const existingMachineCards =
          cardWrapper.querySelectorAll(".machine-card");
        const machineAlreadyAdded = Array.from(existingMachineCards).some(
          (card) => card.textContent === machine.nome
        );
        if (machineAlreadyAdded) return;

        const machineButton = document.createElement("button");
        machineButton.className = "machine-card";
        machineButton.textContent = machine.nome;

        // Prevenir propagação do evento de clique no emptyCard
        machineButton.addEventListener("click", (event) => {
          event.stopPropagation(); // Previne a propagação do evento

          emptyCard.textContent = `${machine.nome} (ID: ${machine.id_maquina})`; // Mostra o nome da máquina e seu ID
          emptyCard.classList.add("add-processo");
          emptyCard.dataset.maquinaId = machine.id_maquina;

          const card = cardWrapper.querySelector(".card");
          if (card) {
            const ordem = parseInt(card.dataset.ordem) + 1;
            const updatedData = {
              id_item_maquina: card.dataset.idItemMaquina,
              prazo: card.dataset.prazo,
              ordem: ordem,
              executor: card.dataset.executor,
              finalizado: card.dataset.finalizado === "true",
              corte: card.dataset.corte,
              maquinaId: machine.id_maquina,
              itemId: card.dataset.itemId,
            };

            console.log("JSON atualizado:", updatedData);
          } else {
            console.error("Card não encontrado para atualizar os dados.");
          }

          machineList.remove(); // Fecha a lista de máquinas após selecionar uma máquina
        });

        machineList.appendChild(machineButton);
      });

      emptyCard.appendChild(machineList);
    } catch (error) {
      console.error("Erro ao buscar os nomes das máquinas:", error);
    }
  });
}

function addAddButton(card, cardWrapper) {
  if (card.classList.contains("empty-card")) return; // Não adicionar botão ao empty card

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";

  const addButton = document.createElement("button");
  addButton.className = "add-button";
  addButton.textContent = "+";
  addButton.style.display = "none";

  buttonContainer.appendChild(addButton);
  card.appendChild(buttonContainer);

  addButton.addEventListener("click", () => createEmptyCard(cardWrapper));

  card.addEventListener("mouseover", () => (addButton.style.display = "block"));
  card.addEventListener("mouseout", () => (addButton.style.display = "none"));
}

// ==========================================================================
// Função para exclluir um processo
//==========================================================================

async function toggleOverlayDiv(maquinaDiv) {
  const overlayDiv = maquinaDiv.querySelector(".overlay-div");

  if (overlayDiv) {
    maquinaDiv.removeChild(overlayDiv);
  } else {
    const newOverlayDiv = document.createElement("div");
    newOverlayDiv.className = "overlay-div";
    
    const deleteIcon = document.createElement("img");
    deleteIcon.src = "media/icons8-delete-48.png";
    deleteIcon.alt = "Delete";
    deleteIcon.className = "delete-icon";
    deleteIcon.addEventListener("click", async (event) => {
      event.stopPropagation(); // Impede que o evento de clique se propague para a maquina-div

      const idItemMaquina = maquinaDiv.dataset.idItemMaquina;

      Swal.fire({
        title: 'Tem certeza?',
        text: "Você está prestes a excluir este processo!",
        showCancelButton: true,
        confirmButtonColor: '#7066e0',
        cancelButtonColor: '#888',
        confirmButtonText: 'Sim, exclua!',
        cancelButtonText: 'Cancelar',
        background: '#e9e9e9',
        customClass: {
          title: 'custom-title-class',
          content: 'custom-content-class',
          icon: 'custom-icon-class'
        }
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Enviar requisição DELETE para o backend
            await axios.delete(`${BASE_URL}/adm/item_maquina/${idItemMaquina}`);

            // Remover a máquina da interface
            maquinaDiv.removeChild(newOverlayDiv);
            Swal.fire(
              'Excluído!',
              'Seu item foi excluído com sucesso.',
              'success'
            );
          } catch (error) {
            console.error("Erro ao enviar requisição DELETE:", error); // Adicionar log detalhado
            Swal.fire(
              'Erro!',
              'Houve um problema ao excluir o item.',
              'error'
            );
          }
        }
      });
    });

    newOverlayDiv.appendChild(deleteIcon);

    maquinaDiv.addEventListener("click", (event) => {
      if (event.target === maquinaDiv) {
        maquinaDiv.removeChild(newOverlayDiv);
      }
    });

    maquinaDiv.appendChild(newOverlayDiv);
  }
}



// Função no Frontend
async function showPartNumbersAndMachines() {
  try {
    const response = await axios.get(`${BASE_URL}/adm/item_maquina`);
    const cardContainer = document.getElementById("partNumberCardsContainer");
    cardContainer.innerHTML = "";

    const partNumberMap = {};

    response.data.forEach((itemMaquina) => {
      const partNumber = itemMaquina.Item.part_number.replace("::maker", "");

      if (!partNumberMap[partNumber]) {
        partNumberMap[partNumber] = {
          maquinas: [],
          idItem: itemMaquina.itemId, // Use itemId, não id_item_maquina
          ordem: itemMaquina.ordem,
        };
      }

      const nome = itemMaquina.maquina.nome;

      partNumberMap[partNumber].maquinas.push({
        idItemMaquina: itemMaquina.id_item_maquina,
        nome: nome,
        finalizado: itemMaquina.finalizado,
      });
    });

    for (const [partNumber, data] of Object.entries(partNumberMap)) {
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "card-wrapper";

      const card = document.createElement("div");
      card.className = "card";
      card.dataset.partNumber = partNumber;
      card.dataset.itemId = data.idItem;
      card.dataset.ordem = data.ordem;

      const cardContent = `
        <div class="card-header d-flex justify-content-between align-items-center">
          <span>${partNumber}</span>
          <img class="toggle-arrow" src="media/seta.png" style="cursor: pointer; transform: rotate(0deg);">
        </div>
        <div class="card-body d-none">
          ${data.maquinas.map((maquina) => `
              <div 
                class="maquina-div ${maquina.finalizado ? "finalizado" : ""}"
                data-id-item-maquina="${maquina.idItemMaquina}">
                ${maquina.nome || "Nome não disponível"}
              </div>`).join("")}
        </div>
      `;

      card.innerHTML = cardContent;

      const cardHeader = card.querySelector(".card-header");
      const cardBody = card.querySelector(".card-body");
      const toggleArrow = card.querySelector(".toggle-arrow");

      cardHeader.addEventListener("click", () => {
        cardBody.classList.toggle("d-none");
        if (cardBody.classList.contains("d-none")) {
          toggleArrow.style.transform = "rotate(0deg)";
        } else {
          toggleArrow.style.transform = "rotate(180deg)";
        }
      });

      const maquinaDivs = card.querySelectorAll(".maquina-div");
      maquinaDivs.forEach((maquinaDiv) => {
        maquinaDiv.addEventListener("click", () => {
          toggleOverlayDiv(maquinaDiv);
        });
      });

      cardWrapper.appendChild(card);
      addAddButton(card, cardWrapper);
      cardContainer.appendChild(cardWrapper);
    }
  } catch (error) {
    console.error("Erro ao buscar os part-numbers e máquinas:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const optionsButton = document.getElementById("optionsButton");
  if (!optionsButton) {
    console.error("Botão optionsButton não encontrado.");
    return;
  }
  optionsButton.addEventListener("click", showPartNumbersAndMachines);
});

document.getElementById("confirmarProcesso").addEventListener("click", async () => {
  const cards = document.querySelectorAll(".card");
  const items = [];
  const duplicates = [];
  const allMaquinaIds = [];

  for (const card of cards) {
    const emptyCards = card.closest(".card-wrapper").querySelectorAll(".empty-card");

    if (emptyCards.length === 0) {
      console.warn("Nenhum empty-card encontrado para o card:", card);
      continue;
    }

    const maquinaIds = Array.from(emptyCards).map(emptyCard => parseInt(emptyCard.dataset.maquinaId));
    const uniqueMaquinaIds = [...new Set(maquinaIds)];
    allMaquinaIds.push(...uniqueMaquinaIds);

    for (const maquinaId of uniqueMaquinaIds) {
      const itemId = parseInt(card.dataset.itemId);
      if (isNaN(itemId)) {
        console.error(`itemId inválido para o card:`, card);
        continue;
      }

      let ordem = parseInt(card.dataset.ordem);

      if (!isNaN(ordem)) {
        ordem += 1;
      } else {
        console.warn(`Ordem inválida para o card com itemId: ${itemId}`);
        ordem = 1;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/adm/item_maquina/existence-check`,
          {
            params: {
              itemId: itemId,
              maquinaId: maquinaId,
            },
          }
        );

        if (response.data.exists) {
          duplicates.push({
            itemId: itemId,
            maquinaId: maquinaId,
          });
        } else {
          const prazo = card.dataset.prazo;
          const executor = card.dataset.executor;
          const finalizado = card.dataset.finalizado === "true";
          const corte = card.dataset.corte;

          const item = {
            itemId: itemId,
            maquinaId: maquinaId,
            ordem: ordem,
            prazo: prazo,
            executor: executor,
            finalizado: finalizado,
            corte: corte,
          };

          items.push(item);
        }
      } catch (error) {
        console.error("Erro ao verificar a existência do processo:", error);
      }
    }
  }

  console.log("IDs de máquinas que serão enviados:", allMaquinaIds);

  if (duplicates.length > 0) {
    alert(
      "Alguns processos já existem:\n" +
      duplicates
        .map((d) => `Item ID: ${d.itemId}, Máquina ID: ${d.maquinaId}`)
        .join("\n")
    );
  }

  if (items.length > 0) {
    try {
      await axios.post(`${BASE_URL}/adm/item_maquina/selecionar-maquinas`, items);

      console.log("Processos confirmados com sucesso.");
      showPartNumbersAndMachines();
    } catch (error) {
      console.error("Erro ao confirmar processos:", error);
    }
  } else {
    console.warn("Nenhum item selecionado.");
  }
});




//=================================================
// função para CONFIRMAR prioridade
//=================================================

document
  .getElementById("confirmarOrdem")
  .addEventListener("click", async () => {
    try {
      const listContainer = document.getElementById("produzindoItemsList");
      const itemMaquina = listContainer.querySelectorAll(".item-container");

      const newPriorities = Array.from(itemMaquina).map(
        (itemsMaquina, index) => {
          const id_item_maquina = parseInt(
            itemsMaquina.dataset.idItemMaquina,
            10
          ); // Extrai o id_item do atributo data

          return {
            id_item_maquina: id_item_maquina,
            prioridade: index + 1,
          };
        }
      );

      console.log(
        "Dados enviados para atualização de prioridades:",
        newPriorities
      );

      await axios.post(`${BASE_URL}/adm/atualizar-prioridades`, newPriorities);
      alert("Prioridades atualizadas com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar as prioridades:", error);
      alert(
        "Erro ao atualizar as prioridades. Verifique o console para mais detalhes."
      );
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  handleDarkModeToggle();
  fetchMaquinas();
});

document
  .getElementById("criarMaquinaModalBtn")
  .addEventListener("click", async () => {
    const nome = document.getElementById("maquinaNomeModal").value;

    if (nome.trim() === "") {
      alert("O nome da máquina não pode estar vazio.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/adm/maquina`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar a máquina.");
      }

      const newMaquina = await response.json();
      alert(`Máquina criada com sucesso: ${newMaquina.nome}`);
      closeAddMaquinaModal();
      // Recarrega as máquinas para incluir a nova
      document.getElementById("allMaquina").innerHTML = "";
      fetchMaquinas();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar a máquina. Verifique o console para mais detalhes.");
    }
  });
