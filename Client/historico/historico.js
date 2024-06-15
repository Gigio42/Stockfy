// main.js
import { loadChapasData } from "./script/sections/chapas.js";

$(document).ready(function () {
  var ctx1 = document.getElementById("myChart1").getContext("2d");
  var ctx2 = document.getElementById("myChart2").getContext("2d");
  var ctx3 = document.getElementById("myChart3").getContext("2d");

  loadChapasData(ctx1, ctx2, ctx3);

  $("#chartCarousel").on("slid.bs.carousel", function () {
    var currentIndex = $(".carousel-item.active").index();
    $(".carousel-indicators li").removeClass("active");
    $(".carousel-indicators li").eq(currentIndex).addClass("active");
  });
});

if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../login/login.html";
}

logoutButton.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = "../login/login.html";
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
