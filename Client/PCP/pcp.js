import { ItemModal } from "./scripts/consulta/mainConsulta.js";
import { Reservar } from "./scripts/reserva/mainForm.js";

document.addEventListener("DOMContentLoaded", function () {
  const reservar = new Reservar();
  reservar.initialize();
});

document.addEventListener("DOMContentLoaded", function () {
  const itemModal = new ItemModal();
  itemModal.initialize();
});

var darkModeToggle = document.getElementById("darkModeToggle");
var body = document.body;

// // DARK MODE
// darkModeToggle.addEventListener("change", function () {
//   body.classList.toggle("dark-mode", darkModeToggle.checked);
//   localStorage.setItem("darkMode", darkModeToggle.checked ? "enabled" : "disabled");

//   var aside = document.getElementById("aside");
//   aside.classList.toggle("dark-mode-aside", darkModeToggle.checked);
// });

// if (localStorage.getItem("darkMode") === "enabled") {
//   darkModeToggle.checked = true;
//   body.classList.add("dark-mode");

//   var aside = document.getElementById("aside");
//   if (aside) {
//     aside.classList.add("dark-mode-aside");
//   }
// }

// DARK MODE pode tirar se quiser
darkModeToggle.addEventListener("change", function () {
  if (darkModeToggle.checked) {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    localStorage.setItem("darkMode", "enabled");

    var aside = document.getElementById("aside");
    aside.classList.add("dark-mode-aside");
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("darkMode", "disabled");

    var aside = document.getElementById("aside");
    aside.classList.remove("dark-mode-aside");
  }
});

if (localStorage.getItem("darkMode") === "enabled") {
  darkModeToggle.checked = true;
  body.classList.add("dark-mode");

  var aside = document.getElementById("aside");
  if (aside) {
    aside.classList.add("dark-mode-aside");
  }
} else {
  darkModeToggle.checked = false;
  body.classList.add("light-mode");

  var aside = document.getElementById("aside");
  if (aside) {
    aside.classList.remove("dark-mode-aside");
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
  alert('Criar usuário function called!');
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

document.getElementById("optionsButton").addEventListener("click", function () {
  var form = document.getElementById("groupingForm");
  form.classList.toggle("d-none");
});

document.getElementById("mobileOptionsButton").addEventListener("click", function () {
  var form = document.getElementById("groupingForm");
  form.classList.toggle("d-none");
});