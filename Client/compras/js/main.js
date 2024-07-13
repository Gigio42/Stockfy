import { handleExpectedDateChange, convertToInteger, extractPdfData } from "./modules/extractToJson.js";
import { addTableHeader, addTableRow, populateTable } from "./modules/table.js";
import { updateCardboardRepresentation } from "./modules/cardboard.js";
import { handleAddMeasureBtnClick } from "./modules/form.js";
import { openFilePicker } from "./modules/openfile.js";
import { undoChanges, redoChanges } from "./modules/undoRedo.js";
import {sendJSONDataToBackend} from "../sendToBackend.js"

document.addEventListener("DOMContentLoaded", () => {
  var dropEnabled = true;
  var dropzone = document.getElementById("dropzone");
 var jsonData = {
    infoPedido: {},
    infoProdComprados: [], // Inicializando como array vazio
  };

  // Exemplo de como chamar as funções dentro do contexto apropriado
  document.getElementById("desfazerChapa").addEventListener("click", redoChanges);
  document.getElementById("refazerChapa").addEventListener("click", undoChanges);

  let selectedCardboard = {};

  openFilePicker();

  dropzone.addEventListener("click", openFilePicker);

  document.addEventListener("dragover", function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (dropEnabled) {
      dropzone.classList.add("dragover");
    }
    return false;
  });

  document.addEventListener("drop", function (event) {
    event.preventDefault();
    event.stopPropagation();
    dropzone.classList.remove("dragover");

    if (dropEnabled) {
      var file = event.dataTransfer.files[0];
      console.log("Arquivo solto:", file.name);
      handleFile(URL.createObjectURL(file));
    }
  });

  window.handleFile = function (fileUrl) {
    console.log("Lendo arquivo:", fileUrl);
    pdfjsLib
      .getDocument(fileUrl)
      .promise.then(function (pdf) {
        console.log("PDF processado com sucesso:", fileUrl);
        extractPdfData(pdf, jsonData);
      })
      .finally(function () {
        dropEnabled = true;
        console.log("Evento de solta reativado.");
      });
  };

  document.getElementById("adicionarMedidaBtn").addEventListener("click", () => {
    handleAddMeasureBtnClick();
  });

  addTableHeader(dataTable);

  let prod = 0;

  addTableRow(dataTable, prod, 0, selectedCardboard);

  updateCardboardRepresentation(prod);

  populateTable(jsonData.infoProdComprados, selectedCardboard);

  var expectedDateInput = document.getElementById("expectedDate");

  var sendButton = document.getElementById("sendButton");
  if (sendButton) {
    sendButton.addEventListener("click", function () {
      if (expectedDateInput.value === "") {
        expectedDateInput.classList.add("invalid-date");
        console.error("A data prevista não foi selecionada.");
        return;
      }

      sendJSONDataToBackend();
    });
  } else {
    console.error("Botão 'Enviar' não encontrado.");
  }
});



export { handleExpectedDateChange, convertToInteger, populateTable, addTableHeader, addTableRow, updateCardboardRepresentation, handleAddMeasureBtnClick };
