import { setUserInfo, setMachineName } from "./scripts/userInfo.js";
import { render } from "./scripts/render.js";

if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../login/login.html";
}

const urlParams = new URLSearchParams(window.location.search);
const from = urlParams.get('from');

document.getElementById("logoutLink").addEventListener("click", function (event) {
  localStorage.clear();
  if (from === 'home') {
    window.location.href = "../home/home.html";
  } else {
    window.location.href = "../login/login.html";
  }
});

const username = localStorage.getItem("nome") || "UserName";
let maquinaName = localStorage.getItem("maquina") || "MachineName";

setUserInfo(username);
setMachineName(maquinaName);

if (from === 'home') {
  render(maquinaName, username);
} else {
  render(maquinaName, username);
}

document.getElementById("darkModeToggle").addEventListener("change", function (e) {
  document.body.classList.toggle("light-mode", e.target.checked);
});