import { toggleDropzoneVisibility } from './toggleDropzone.js';
import { lerTextoPdf, carregarScript } from './pdfHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    // Configuração inicial
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js";
    initializeFlatpickrs();
    initializeEventHandlers();

    // Observar mudanças nos modais
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const observer = new MutationObserver(toggleDropzoneVisibility);
        observer.observe(modal, { attributes: true, attributeFilter: ['style'] });
    });

    toggleDropzoneVisibility();

    // Funções utilitárias
    function initializeFlatpickrs() {
        flatpickr("#expectedDate, #expectedDateManual, #purchaseDate", {
            dateFormat: "Y/m/d",
        });
    }

    function initializeEventHandlers() {
        // Evento de clique no botão de voltar
        $("#backButton").on("click", function () {
            clearContentAndReload();
        });

        // Evento de clique nos botões de fechar
        $(".closeButton").on("click", function () {
            $("#errorModal, #myModal, #mModal").hide();
            clearContentAndReload();
        });

        // Evento de queda (drop) no dropzone
        $("#dropzone").on("drop", function (event) {
            event.preventDefault();
            const arquivo = event.originalEvent.dataTransfer.files[0];

            if (arquivo && arquivo.type == "application/pdf") {
                const arquivoUrl = URL.createObjectURL(arquivo);
                lerTextoPdf(arquivoUrl);
            } else {
                showNotification("Por favor, carregue um arquivo PDF.", "error");
            }
        });

        $(document).ready(function () {
            // Evento de clique no botão para abrir o modal
            $("#btnAdicionarManualmente").on("click", function () {
                $("#mModal").modal("show");
            });
        
            // Restante do seu código JavaScript aqui...
        });
        

        // Evento de arrastar sobre o dropzone
        $("#dropzone").on("dragover", function (event) {
            event.preventDefault();
        });

        // Evento de mudança no fornecedor
        $("#fornecedor").on("change", function (event) {
            const fornecedorSelecionado = $(this).val();
            if (fornecedorSelecionado === "Adicionar Manualmente") {
                $("#mModal").show();
            } else {
                $("#mModal").hide();
            }
        });

        // Fechar modal ao clicar fora dele
        window.onclick = function (event) {
            const modal = document.getElementById("myModal");
            if (event.target == modal) {
                clearContentAndReload();
            }
        };
    }

    // Funções de utilidade
    function showNotification(message, type = "info") {
        $("#notificationMessage").text(message);
        $("#notification").show();

        setTimeout(function () {
            $("#notification").hide();
        }, 5000);
    }

    function clearContentAndReload() {
        $("#dataTable").html("");
        $("#jsonContent").text("");
        $("#myModal, #mModal").modal("hide");
        window.location.reload();
    }

    // Carregar script se a largura da janela for menor que 768
    if (window.innerWidth < 768) {
        const modal = document.getElementById("myModal");
        if (modal) {
            modal.style.display = "block";
        }
        carregarScript("adicionar_manualmente.js");
    }
});
