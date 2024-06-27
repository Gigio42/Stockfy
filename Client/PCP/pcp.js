import { ItemModal } from "./scripts/consulta/mainConsulta.js";
import { Reservar } from "./scripts/reserva/mainForm.js";
import { InfoModal } from "./scripts/reserva/infoModal.js";

if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../login/login.html";
}

logoutButton.addEventListener("click", function () {
  window.location.href = "../home.html";
});

document.addEventListener("DOMContentLoaded", function () {
  const reservar = new Reservar();
  reservar.initialize();

  const itemModal = new ItemModal();
  itemModal.initialize();

  const infoModal = new InfoModal();
  infoModal.initialize();
});

document.getElementById("user-name").textContent = localStorage.getItem("nome") || "UserName";
var name = localStorage.getItem("nome");
var profilePic = document.getElementById("profilePic");
profilePic.src = "https://api.dicebear.com/8.x/shapes/svg?seed=" + name;

profilePic.onerror = function () {
  this.onerror = null;
  this.src = "./media/pfpImg.jpg";
};

var darkModeToggle = document.getElementById("darkModeToggle");
var body = document.body;

// Set dark mode by default
body.classList.add("dark-mode");
var aside = document.getElementById("aside");
if (aside) {
  aside.classList.add("dark-mode-aside");
}

// DARK MODE toggle
darkModeToggle.addEventListener("change", function () {
  if (darkModeToggle.checked) {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    localStorage.setItem("darkMode", "enabled");

    if (aside) {
      aside.classList.add("dark-mode-aside");
    }
  } else {
    body.classList.remove("dark-mode");
    body.classList.add("light-mode");
    localStorage.setItem("darkMode", "disabled");

    if (aside) {
      aside.classList.remove("dark-mode-aside");
    }
  }
});

// Check local storage for dark mode setting
if (localStorage.getItem("darkMode") === "disabled") {
  darkModeToggle.checked = false;
  body.classList.remove("dark-mode");
  body.classList.add("light-mode");

  if (aside) {
    aside.classList.remove("dark-mode-aside");
  }
} else {
  darkModeToggle.checked = true;
}

function highlightCurrentPage() {
  var currentPage = window.location.pathname.split("/").pop();
  $("ul.list-unstyled li").removeClass("active");
  $("ul.list-unstyled li a[href='" + currentPage + "']")
    .parent()
    .addClass("active");
}

$(document).ready(function () {
  highlightCurrentPage();
});

document.getElementById("optionsButton").addEventListener("click", function () {
  var form = document.getElementById("groupingForm");
  form.classList.toggle("d-none");
});

document.getElementById("mobileOptionsButton").addEventListener("click", function () {
  var form = document.getElementById("groupingForm");
  form.classList.toggle("d-none");
});
