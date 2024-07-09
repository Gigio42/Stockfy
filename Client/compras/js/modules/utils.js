
export function showModal(jsonData) {
    var modal = document.getElementById("myModal");
    if (modal) {
      modal.style.display = "block";
      console.log("JSON Data:", jsonData);
    } else {
      console.error("Modal não encontrado.");
    }
  }

