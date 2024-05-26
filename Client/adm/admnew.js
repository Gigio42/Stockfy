

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
            cardMaquina.id = 'cardMaquina'

            // Criar o elemento de texto para o nome da máquina
            let maquinaName = document.createElement('span');
            maquinaName.textContent = maquina.name;
            cardMaquina.appendChild(maquinaName);

            // Criar o elemento de imagem para o SVG
            let svgIcon = document.createElement('img');
            svgIcon.src = 'media/icons8-link-externo.svg';
            svgIcon.alt = 'External link icon';
            svgIcon.className = 'svgIcon'; // Adicione uma classe para estilização se necessário
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
document.addEventListener('click', function(event) {
    if (event.target.className === 'svgIcon') {
        // Obtém o elemento de texto (span) que contém o nome da máquina
        var maquinaName = event.target.parentNode.querySelector('span').textContent;
        openModal(maquinaName);
    }
});

  // Adiciona um evento de clique ao fundo escuro do modal para fechar o modal
  document.getElementById('myModal').addEventListener('click', function(event) {
    if (event.target === document.getElementById('myModal')) {
      closeModal();
    }
  });

  // Adiciona um evento de clique ao botão de fechar para fechar o modal
  document.addEventListener('click', function(event) {
    if (event.target.className === 'close') {
      closeModal();
    }
  });