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
      });
  
      fileInput.click();
    }
  }