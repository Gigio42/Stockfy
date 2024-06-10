import { setUserInfo, setMachineName } from "./scripts/userInfo.js";
import { render } from "./scripts/render.js";

if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../login/login.html";
}

document.getElementById("logoutLink").addEventListener("click", function(event) {
  localStorage.clear();
});

const username = localStorage.getItem("nome") || "UserName";
const maquinaName = localStorage.getItem("maquina") || "MachineName";

setUserInfo(username);
setMachineName(maquinaName);
render(maquinaName, username);

document.getElementById("darkModeToggle").addEventListener("change", function (e) {
  document.body.classList.toggle("light-mode", e.target.checked);
});
