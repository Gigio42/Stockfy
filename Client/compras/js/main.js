import {
  handleExpectedDateChange,
  convertToInteger,
  extractPdfData,
} from "./modules/extractToJson.js";
import { addTableHeader, addTableRow, populateTable } from "./modules/table.js";
import { updateCardboardRepresentation } from "./modules/cardboard.js";
import { handleAddMeasureBtnClick } from "./modules/form.js";
import { openFilePicker } from "./modules/openfile.js";
import { undoChanges, redoChanges } from "./modules/undoRedo.js";
import { sendJSONDataToBackend } from "../sendToBackend.js";

document.addEventListener('DOMContentLoaded', (event) => {

  window.medidasConjugConfimed = [];

  // Função para limpar todos os inputs
  function clearAllInputs() {
      // Seleciona todos os elementos input
      const inputs = document.querySelectorAll('input');
      // Itera sobre todos os inputs e limpa o valor
      inputs.forEach(input => {
          input.value = '';
      });
  }
  
  // Chama a função para limpar os inputs após a página ser carregada
  clearAllInputs();
});


document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "../login/login.html";
  }

  $("#user-name").text(localStorage.getItem("nome") || "UserName");
  var name = localStorage.getItem("nome");
  var profilePic = $("#profilePic");
  profilePic.attr(
    "src",
    "https://api.dicebear.com/8.x/shapes/svg?seed=" + name
  );

  var dropEnabled = true;
  var dropzone = document.getElementById("dropzone");
  var jsonData = {
    infoPedido: {},
    infoProdComprados: [], // Inicializando como array vazio
  };

  // Exemplo de como chamar as funções dentro do contexto apropriado
  document
    .getElementById("desfazerChapa")
    .addEventListener("click", redoChanges);
  document
    .getElementById("refazerChapa")
    .addEventListener("click", undoChanges);

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

  document
    .getElementById("adicionarMedidaBtn")
    .addEventListener("click", () => {
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
      // Verifica se o campo de data está vazio
      if (!expectedDateInput.value) {
        // Exibe uma notificação de erro se o campo estiver vazio
        Swal.fire({
          title: 'Campo de Data Obrigatório',
          text: 'Por favor, selecione uma data antes de enviar.',
          icon: 'warning',
          confirmButtonText: 'OK',
          background: '#e9e9e9',
          customClass: {
            title: 'custom-title-class',
            content: 'custom-content-class',
            icon: 'custom-icon-class'
          }
        });
        return; // Interrompe a função de envio
      }

      // Se o campo de data estiver preenchido, chama a função para enviar os dados
      sendJSONDataToBackend();
    });
  } else {
    console.error("Botão 'Enviar' não encontrado.");
  }
});

export {
  handleExpectedDateChange,
  convertToInteger,
  populateTable,
  addTableHeader,
  addTableRow,
  updateCardboardRepresentation,
  handleAddMeasureBtnClick,
};
