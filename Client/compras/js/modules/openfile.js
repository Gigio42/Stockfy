var dropEnabled = true;

export function openFilePicker() {
    if (dropEnabled) {
        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".pdf";
        fileInput.style.display = "none";
        
        fileInput.addEventListener("change", function (event) {
            var file = event.target.files[0];
            console.log("Arquivo selecionado:", file.name);
            handleFile(URL.createObjectURL(file));
            // Oculta o dropzone após selecionar o arquivo
            dropzone.style.display = "none";
        });

        // Eventos para arrastar e soltar
        document.body.addEventListener("dragenter", function (event) {
            event.preventDefault();
            dropzone.style.display = "block"; // Exibe o dropzone ao arrastar
        });

        document.body.addEventListener("dragover", function (event) {
            event.preventDefault();
            dropzone.style.display = "block"; // Exibe o dropzone ao arrastar
        });

        document.body.addEventListener("drop", function (event) {
            event.preventDefault();
            dropzone.style.display = "none"; // Oculta o dropzone ao soltar o arquivo
            var file = event.dataTransfer.files[0];
            console.log("Arquivo arrastado:", file.name);
            handleFile(URL.createObjectURL(file));
        });

        fileInput.click();
    }
}
