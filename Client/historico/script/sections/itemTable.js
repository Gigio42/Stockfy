import { fetchItems } from "../connections.js";

export async function loadItemMaquinaData() {
  let itemData = await fetchItems();

  var itemColumns = ["id_item", "part_number", "prioridade", "status", "reservado_por"];

  let table = '<table id="myTable3" class="display responsive nowrap"><thead><tr><th></th>';

  itemColumns.forEach((column) => {
    table += `<th>${column}</th>`;
  });

  table += "</tr></thead><tbody>";

  itemData.forEach((item) => {
    table += `<tr data-item='${JSON.stringify(item.maquinas)}'><td class="details-control"><i class="fas fa-plus"></i></td>`;
    itemColumns.forEach((column) => {
      table += `<td>${item[column] || ""}</td>`;
    });
    table += "</tr>";
  });

  table += "</tbody></table>";

  // Insert the table into the modal body
  $("#itemModalBody").html(table);

  // If the table has already been initialized, destroy it
  if ($.fn.DataTable.isDataTable("#myTable3")) {
    $("#myTable3").DataTable().destroy();
  }

  // Initialize the DataTable
  let dataTable = $("#myTable3").DataTable({
    responsive: true,
    paging: true,
    searching: true,
    order: [[1, "asc"]],
    columns: [
      {
        className: "details-control",
        orderable: false,
        data: null,
        defaultContent: "",
      },
      { title: "id_item" },
      { title: "part_number" },
      { title: "prioridade" },
      { title: "status" },
      { title: "reservado_por" },
    ],
  });

  // Add event listener for opening and closing details
  $("#myTable3 tbody").on("click", "td.details-control", function () {
    var tr = $(this).closest("tr");
    var row = dataTable.row(tr);

    if (row.child.isShown()) {
      // This row is already open - close it
      row.child.hide();
      tr.removeClass("shown");
      $(this).html('<i class="fas fa-plus"></i>'); // Change icon to plus
    } else {
      // Open this row
      var maquinas = JSON.parse(tr.attr("data-item"));
      var childTable = "<table class='child-table display responsive nowrap'><thead><tr>";
      ["id_item_maquina", "prazo", "ordem", "executor", "finalizado", "corte", "maquinaId", "itemId"].forEach((column) => {
        childTable += `<th>${column}</th>`;
      });
      childTable += "</tr></thead><tbody>";
      maquinas.forEach((maquina) => {
        childTable += "<tr>";
        ["id_item_maquina", "prazo", "ordem", "executor", "finalizado", "corte", "maquinaId", "itemId"].forEach((column) => {
          if (column === "finalizado") {
            childTable += `<td>${maquina[column] ? '<i class="fas fa-check"></i>' : ""}</td>`;
          } else {
            childTable += `<td>${maquina[column] || ""}</td>`;
          }
        });
        childTable += "</tr>";
      });
      childTable += "</tbody></table>";
      row.child(childTable).show();
      tr.addClass("shown");
      $(this).html('<i class="fas fa-minus"></i>'); // Change icon to minus
    }
  });
}
