import { fetchMaquinas } from "./connections.js";

export function setUserInfo(name) {
  document.getElementById("user-name").textContent = name;
}

export async function setMachineName(name) {
  const urlParams = new URLSearchParams(window.location.search);
  const from = urlParams.get("from");
  const machineNameElement = document.getElementById("machine-name");

  if (from === "home") {
    const selectElement = document.createElement("select");
    selectElement.id = "machine-name";
    selectElement.className = "navbar-brand dark-mode-select";

    const maquinas = await fetchMaquinas();

    maquinas.forEach((maquina) => {
      const optionElement = document.createElement("option");
      optionElement.value = maquina.nome;
      optionElement.text = maquina.nome;
      if (maquina.nome === name) {
        optionElement.selected = true;
      }
      selectElement.appendChild(optionElement);
    });

    selectElement.addEventListener("change", (event) => {
      const selectedMachine = event.target.value;
      if (selectedMachine !== localStorage.getItem("maquina")) {
        localStorage.setItem("maquina", selectedMachine);
        location.reload();
      }
    });

    machineNameElement.parentNode.replaceChild(selectElement, machineNameElement);

    const event = new Event("change");
    selectElement.dispatchEvent(event);
  } else {
    machineNameElement.textContent = name;
  }
}
