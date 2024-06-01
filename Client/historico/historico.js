var darkModeToggle = document.getElementById("darkModeToggle");
var body = document.body;

darkModeToggle.addEventListener("change", function () {
  body.classList.toggle("dark-mode", darkModeToggle.checked);
  localStorage.setItem("darkMode", darkModeToggle.checked ? "enabled" : "disabled");

  // Adicione uma classe adicional ao aside quando o modo escuro estiver ativado
  var aside = document.getElementById("aside");
  aside.classList.toggle("dark-mode-aside", darkModeToggle.checked);
});

if (localStorage.getItem("darkMode") === "enabled") {
  darkModeToggle.checked = true;
  body.classList.add("dark-mode");

  // Verifique se o modo escuro está ativado e adicione a classe adicional ao aside, se necessário
  var aside = document.getElementById("aside");
  if (aside) {
    aside.classList.add("dark-mode-aside");
  }
}

// Função para identificar a página atual e adicionar a classe 'active' ao link correspondente
function highlightCurrentPage() {
  var currentPage = window.location.pathname.split("/").pop(); // Obtém o nome do arquivo da URL
  $("ul.list-unstyled li").removeClass("active"); // Remove a classe 'active' de todos os itens de menu
  $("ul.list-unstyled li a[href='" + currentPage + "']")
    .parent()
    .addClass("active"); // Adiciona a classe 'active' ao item de menu correspondente à página atual
}

$(document).ready(function () {
  highlightCurrentPage(); // Chama a função ao carregar a página
});
// Suponha que "items" seja sua lista de objetos JSON
let items = [
  {
    id_grupo_chapas: 1,
    id_compra: 123,
    Qualidade: "Alta",
    Medida: "10x10",
    "Quantidade comprada": 100,
    "quantidade recebida": 90,
    onda: "A",
    Coluna: "B",
    vincos: "C",
    Status: "Em estoque",
    data_compra: "2024-01-01",
    data_recebimento: "2024-01-02",
  },
  // Mais itens aqui...
];

// Função para mostrar mais informações
function showMore(id) {
  var x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// Função para criar um card para cada item
function createCard(item) {
  let card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
        <p><strong>Qualidade:</strong> ${item.Qualidade}</p>
        <p><strong>Medida:</strong> ${item.Medida}</p>
        <p><strong>Quantidade total:</strong> ${item["Quantidade comprada"]}</p>
        <p><strong>Vincos:</strong> ${item.vincos}</p>
        <p><strong>Status:</strong> ${item.Status}</p>
        <button onclick="showMore('${item.id_compra}')">...</button>
        <div id="${item.id_compra}" style="display: none;">
            <p><strong>ID Grupo Chapas:</strong> ${item.id_grupo_chapas}</p>
            <p><strong>ID Compra:</strong> ${item.id_compra}</p>
            <p><strong>Quantidade Recebida:</strong> ${item["quantidade recebida"]}</p>
            <p><strong>Onda:</strong> ${item.onda}</p>
            <p><strong>Coluna:</strong> ${item.Coluna}</p>
            <p><strong>Data da Compra:</strong> ${item.data_compra}</p>
            <p><strong>Data do Recebimento:</strong> ${item.data_recebimento}</p>
        </div>
    `;
  return card;
}

// Adicione os cards ao DOM
let container = document.getElementById("container");
items.forEach((item) => {
  let card = createCard(item);
  container.appendChild(card);
});

function showMore(id) {
  var x = document.getElementById(id);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
