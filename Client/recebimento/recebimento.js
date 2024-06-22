import BASE_URL from "../utils/config.js";
import { alterarTema, hideDropZone, logout } from "./scripts/utils.js";
import { fetchChapas } from "./scripts/connections.js";
import { comparar, addLine, copiarTudo } from "./scripts/manipularTabela.js";
import { processPDF, processXML } from "./scripts/processFile.js";


document.getElementById("buscarChapa").addEventListener("click", buscarChapa);

function buscarChapa() {
  const idCompra = document.getElementById("id_compra").value;
  fetchChapas(idCompra);
}

document.getElementById("copiarTudo").addEventListener("click", copiarTudo)

document.getElementById("logout-button").addEventListener("click", logout);

document.getElementById("add-line-button").addEventListener("click", addLine);

document.getElementById("toggle-drop-zone").addEventListener("click", hideDropZone);

document.getElementById("darkModeToggle").addEventListener("change", alterarTema);

pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js";

document.getElementById("fileInput").addEventListener("change", function (event) {
  var file = event.target.files[0];

  if (!file) {
    displayMessage("Por favor, selecione um arquivo válido.");
    return;
  }
  switch (file.type) {
    case "application/pdf":
      processPDF(file);
      break;
    case "text/xml":
      processXML(file);
      break;
    default:
      displayMessage("Formato de arquivo não suportado!");
      break;
  }
  event.target.value = "";
});

const dropZone = document.getElementById("drop-zone");

dropZone.addEventListener("dragover", function (event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
});

dropZone.addEventListener("drop", function (event) {
  event.stopPropagation();
  event.preventDefault();
  const file = event.dataTransfer.files[0];

  if (!file) {
    displayMessage("Por favor, solte um arquivo válido.");
    return;
  }

  switch (file.type) {
    case "application/pdf":
      processPDF(file);
      break;
    case "text/xml":
      processXML(file);
      break;
    default:
      displayMessage("Formato de arquivo não suportado!");
      break;
  }
});





