import { ItemModal } from "./scripts/consulta/modalConsulta.js";
import { Reservar } from "./scripts/reserva/cardHandler.js";
import { ModalInfo } from "./scripts/reserva/modalInfo.js";

const LOGIN_URL = "../login/login.html";
const HOME_URL = "../home.html";
const PFP_DEFAULT_IMG = "./media/pfpImg.jpg";
const PFP_API_URL = "https://api.dicebear.com/8.x/shapes/svg?seed=";
const DARK_THEME_URL = "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-dark@4/dark.css";
const LIGHT_THEME_URL = "https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4@4/bootstrap-4.css";


if (localStorage.getItem("cargo") === "OPERADOR") {
  window.location.href = "../home.html";
}
// Utilidade
const redirectTo = (url) => (window.location.href = url);

const getUserName = () => localStorage.getItem("nome") || "UserName";

const setProfilePicture = (name, imgElement) => {
  imgElement.src = PFP_API_URL + name;
  imgElement.onerror = function () {
    this.onerror = null;
    this.src = PFP_DEFAULT_IMG;
  };
};

const setSwal2Theme = (darkMode, themeElement) => {
  themeElement.href = darkMode ? DARK_THEME_URL : LIGHT_THEME_URL;
};

const toggleClass = (element, class1, class2, condition) => {
  element.classList.toggle(class1, condition);
  element.classList.toggle(class2, !condition);
};

const highlightCurrentPage = () => {
  const currentPage = window.location.pathname.split("/").pop();
  $("ul.list-unstyled li").removeClass("active");
  $(`ul.list-unstyled li a[href='${currentPage}']`).parent().addClass("active");
};

const initializeModules = () => {
  new Reservar().initialize();
  new ItemModal().initialize();
  new ModalInfo().initialize();
};

const initializeDarkMode = (darkModeToggle, body, themeElement) => {
  let isDarkModeEnabled = localStorage.getItem("darkMode");
  if (isDarkModeEnabled === null) {
    // Se a preferência não estiver definida, começa no modo escuro
    isDarkModeEnabled = "enabled";
    localStorage.setItem("darkMode", isDarkModeEnabled);
  }
  const darkMode = isDarkModeEnabled === "enabled";
  darkModeToggle.checked = darkMode;
  toggleClass(body, "dark-mode", "light-mode", darkMode);
  setSwal2Theme(darkMode, themeElement);
};

const addEventListeners = (body, swal2Theme) => {
  document.getElementById("logoutButton").addEventListener("click", () => redirectTo(HOME_URL));

  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.addEventListener("change", () => {
    const isDarkModeEnabled = darkModeToggle.checked;
    toggleClass(body, "dark-mode", "light-mode", isDarkModeEnabled);
    localStorage.setItem("darkMode", isDarkModeEnabled ? "enabled" : "disabled");
    setSwal2Theme(isDarkModeEnabled, swal2Theme);
  });

  //refactor mt louco pro modal de filtro, com opt de esc p/ sair
  const filtroModal = document.getElementById("groupingForm");
  document.getElementById("optionsButton").onclick = () => filtroModal.classList.toggle("d-none");
  document.onkeydown = (e) => {
    if (e.key === "Escape" && document.activeElement.tagName !== "INPUT") {
      filtroModal.classList.add("d-none");
    }
  };

  //botão da vs mobile
  document.getElementById("mobileOptionsButton").addEventListener("click", () => {
    document.getElementById("groupingForm").classList.toggle("d-none");
  });

  $(document).ready(() => highlightCurrentPage());
};

if (localStorage.getItem("isLoggedIn") !== "true") {
  redirectTo(LOGIN_URL);
} else {
  document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const swal2Theme = document.getElementById("swal2-theme");

    document.getElementById("user-name").textContent = getUserName();
    setProfilePicture(getUserName(), document.getElementById("profilePic"));
    initializeModules();
    initializeDarkMode(document.getElementById("darkModeToggle"), body, swal2Theme);
    addEventListeners(body, swal2Theme);
  });
}

window.addEventListener("keydown", function (event) {
  if (event.key === "e" || event.key === "E") {
    let subcardsContainers = document.querySelectorAll(".subcards-container");
    subcardsContainers.forEach((subcardsContainer) => {
      if (subcardsContainer.style.display === "none") {
        subcardsContainer.style.display = "block";
      } else {
        subcardsContainer.style.display = "none";
      }
    });
  }
});
