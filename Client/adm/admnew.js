var darkModeToggle = document.getElementById('darkModeToggle');
var body = document.body;

// DARK MODE
darkModeToggle.addEventListener('change', function () {
  body.classList.toggle('dark-mode', darkModeToggle.checked);
  localStorage.setItem('darkMode', darkModeToggle.checked ? 'enabled' : 'disabled');

  var aside = document.getElementById('aside');
  aside.classList.toggle('dark-mode-aside', darkModeToggle.checked);
});

if (localStorage.getItem('darkMode') === 'enabled') {
  darkModeToggle.checked = true;
  body.classList.add('dark-mode');

  var aside = document.getElementById('aside');
  if (aside) {
    aside.classList.add('dark-mode-aside');
  }
}

async function fetchMaquinas() {
  try {
    const response = await axios.get('http://localhost:3000/adm/maquina');
    const maquinas = response.data;

    maquinas.forEach(maquina => {
      let allMaquina = document.getElementById('allMaquina');
      let cardMaquina = document.createElement('div');
      cardMaquina.className = 'cardMaquina';

      // Criar o elemento de texto para o nome da máquina
      let maquinaName = document.createElement('span');
      maquinaName.textContent = maquina.nome;
      cardMaquina.appendChild(maquinaName);

      // Criar o elemento de imagem para o SVG
      let svgIcon = document.createElement('img');
      svgIcon.src = 'media/icons8-link-externo.svg';
      svgIcon.alt = 'External link icon';

      // Adicionar duas classes ao elemento
      svgIcon.classList.add('svgIcon', 'abrirModal');

      // Adicionar o elemento de imagem ao card
      cardMaquina.appendChild(svgIcon);
      // Adicionar o card ao contêiner
      allMaquina.appendChild(cardMaquina);
    });
  } catch (error) {
    console.error('Houve um erro!', error);
  }
}

fetchMaquinas();

// Função para abrir o modal com o nome da máquina
function openModal(maquinaName) {
  var modal = document.getElementById('myModal');
  modal.style.display = 'block';

  // Encontre o elemento de texto dentro do modal e atualize seu conteúdo com o nome da máquina
  var modalContent = modal.querySelector('.modal-content');
  var span = modalContent.querySelector('span');
  span.textContent = maquinaName;
}

// Função para fechar o modal
function closeModal() {
  document.getElementById('myModal').style.display = 'none';
}

// Adiciona um evento de clique ao ícone para abrir o modal com o nome da máquina
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('svgIcon')) {
    // Obtém o elemento de texto (span) que contém o nome da máquina
    var maquinaName = event.target.parentNode.querySelector('span').textContent;
    openModal(maquinaName);
  }
});

// Adiciona um evento de clique ao fundo escuro do modal para fechar o modal
document.getElementById('myModal').addEventListener('click', function (event) {
  if (event.target === document.getElementById('myModal')) {
    closeModal();
  }
});

// Adiciona um evento de clique ao botão de fechar para fechar o modal
document.addEventListener('click', function (event) {

  if (event.target.className === 'close') {
    closeModal();
  }
});

// Função para lidar com o clique no botão "Adicionar Item" e atualizar o status do item para "PRODUZINDO"
async function adicionarItem(itemId) {
  try {
    const response = await axios.post(`http://localhost:3000/adm/items/${itemId}/produzindo`);
    console.log(response.data); // Verifica a resposta do servidor
    // Adicione aqui qualquer lógica adicional após a atualização bem-sucedida do status do item
  
  } catch (error) {
    console.error('Erro ao adicionar item:', error);
    // Adicione aqui o tratamento de erro, se necessário
  }
}

async function fetchitens() {
  try {
    const response = await axios.get('http://localhost:3000/adm/items/chapas');
    const itens = response.data;

    let reservados = document.getElementById('reservados');

    if (!reservados) {
      console.error('Elemento #reservados não encontrado');
      return;
    }

    reservados.innerHTML = '';

    itens.forEach(item => {
      let card = document.createElement('div');
      card.className = 'card';

      let partNumberInfo = document.createElement('h3');
      partNumberInfo.textContent = `${item.part_number}`;
      card.appendChild(partNumberInfo);

      item.chapas.forEach(chapa => {
        let subcard = document.createElement('div');
        subcard.className = 'subcard';

        let chapaInfo = document.createElement('p');
        chapaInfo.innerHTML = `${chapa.medida}<br>${chapa.quantidade_comprada}`;
        subcard.appendChild(chapaInfo);

        card.appendChild(subcard);
      });

      // Adicionando botão "Adicionar Item" ao card
      let adicionarItemButton = document.createElement('button');
      adicionarItemButton.textContent = 'Adicionar Item';
      card.appendChild(adicionarItemButton);
      console.log(item.id_item)
      // Define o ID do item como um atributo de dados no botão "Adicionar Item"
      adicionarItemButton.dataset.id = item.id_item;


      // Adicionando evento de clique ao card para expandir/contrair os subcards
      card.addEventListener('click', () => {
        card.classList.toggle('expanded');
      });

      // Adicionando evento de clique ao botão "Adicionar Item"
      adicionarItemButton.addEventListener('click', async (event) => {
        event.stopPropagation();
        try {
          // Obtenha o ID do item a partir do atributo "data-id" do botão
          const itemId = event.target.dataset.id;
          console.log('ID do item:', itemId); // Verifica o ID do item
          // Chame a função adicionarItem() com o ID correto do item
          await adicionarItem(itemId);
        } catch (error) {
          console.error('Erro ao adicionar item:', error);
          // Adicione aqui o tratamento de erro, se necessário
        }
      });



      reservados.appendChild(card);
    });

    console.log('Finalizou o processamento dos itens');
  } catch (error) {
    console.error('Erro ao recuperar os itens!', error);
  }
}

fetchitens();
