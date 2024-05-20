import { Card } from './card.js';
import { filterItem } from './filter.js';
import { handleShowSelectedButtonClick as handlePopupButtonClick } from './popup.js';

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

// Função para identificar a página atual e adicionar a classe 'active' ao link correspondente
function highlightCurrentPage() {
    var currentPage = window.location.pathname.split("/").pop(); // Obtém o nome do arquivo da URL
    $("ul.list-unstyled li").removeClass("active"); // Remove a classe 'active' de todos os itens de menu
    $("ul.list-unstyled li a[href='" + currentPage + "']").parent().addClass("active"); // Adiciona a classe 'active' ao item de menu correspondente à página atual
}

$(document).ready(function () {
    highlightCurrentPage(); // Chama a função ao carregar a página
});


async function populateCards() {
    const keys = Array.from(document.querySelectorAll('.checkbox-button[data-checked="true"]')).map(button => button.getAttribute('data-value'));
    const sortKey = document.getElementById('sortKey').value;
    const sortOrder = document.getElementById('sortOrder').getAttribute('data-sort');
    let filterCriteria = document.getElementById('filterCriteria').value;

    try {
        const response = await axios.get(`http://localhost:3000/PCP/chapas`, {
            params: {
                groupingCriteria: keys.join(','),
                sortBy: sortKey,
                sortOrder: sortOrder,
                filterCriteria: filterCriteria
            }
        });
        let items = response.data;

        items = items.filter(item => filterItem(item, filterCriteria));

        const selectedChapas = new Set();
        const onSubcardSelectionChange = (chapa, isSelected) => {
            if (isSelected) {
                selectedChapas.add(chapa);
            } else {
                selectedChapas.delete(chapa);
            }
        };

        const container = document.getElementById('container');
        container.innerHTML = '';
        items.forEach((item, index) => {
            const card = new Card(item, keys, index, sortKey, onSubcardSelectionChange);
            const cardElement = card.create();
            container.appendChild(cardElement);
        });

        handlePopupButtonClick(() => Array.from(selectedChapas));

    }
    catch (error) {
        console.error('Error fetching data: ', error);
    }
}
document.getElementById('groupingForm').addEventListener('submit', event => {
    event.preventDefault();
    populateCards();
});
document.querySelectorAll('.checkbox-button').forEach(function(checkboxButton) {
    checkboxButton.addEventListener('click', function() {
        if (checkboxButton.getAttribute('data-checked') === 'true') {
            checkboxButton.setAttribute('data-checked', 'false');
        } else {
            checkboxButton.setAttribute('data-checked', 'true');
        }
    });
});
document.getElementById('sortOrder').addEventListener('click', function() {
    if (this.getAttribute('data-sort') === 'ascending') {
        this.setAttribute('data-sort', 'descending');
        this.innerHTML = ' &#8595;';
    } else {
        this.setAttribute('data-sort', 'ascending');
        this.innerHTML = ' &#8593;';
    }
    populateCards();
});
populateCards();

function showMore(id) {
    var x = document.getElementById(id);
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

// Lógica para o modal do botão criar usuário

function criarUsuario() {
    document.getElementById("modal").style.display = "block";
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
}

function mostrarSenha() {
    const senha = document.getElementById("senha");
    if (senha.type === "password") {
        senha.type = "text";
    } else {
        senha.type = "password";
    }
}