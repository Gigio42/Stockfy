import { setUserInfo, setMachineName } from "./scripts/userInfo.js";
import { render } from "./scripts/render.js";

const username = localStorage.getItem("nome") || "UserName";
const name = localStorage.getItem("maquina") || "MachineName";

setUserInfo(username);
setMachineName(name);
render(name);

document.getElementById("darkModeToggle").addEventListener("change", function (e) {
  document.body.classList.toggle("light-mode", e.target.checked);
});
