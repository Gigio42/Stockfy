document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("openModalLink").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("itemModal").style.display = "block";
  });

  document.getElementById("closeItemModal").addEventListener("click", function () {
    document.getElementById("itemModal").style.display = "none";
  });
});
