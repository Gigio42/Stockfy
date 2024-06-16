import { fetchChapas, fetchItems } from "../connections.js";
import { createChapasCharts } from "./chapasChart.js";

export async function loadChapasData(ctx1, ctx2, ctx3) {
  let chapasData = await fetchChapas();
  const itemsData = await fetchItems();

  createChapasCharts(ctx1, ctx2, ctx3, chapasData);

  var chapasColumns = ["id_compra", "numero_cliente", "fornecedor", "comprador", "quantidade_estoque", "status", "data_compra", "data_prevista", "data_recebimento"];
  var itemsColumns = Object.keys(itemsData[0]);

  generateTableHeaders("myTable", itemsColumns);
  generateTableHeaders("myTable2", chapasColumns);

  chapasData = chapasData.map((chapa) => {
    if (chapa.data_compra) {
      chapa.data_compra = moment(chapa.data_compra, "DD/MM/YYYY").format("YYYY-MM-DD");
    }
    if (chapa.data_prevista) {
      chapa.data_prevista = moment(chapa.data_prevista, "DD/MM/YYYY").format("YYYY-MM-DD");
    }
    if (chapa.data_recebimento) {
      chapa.data_recebimento = moment(chapa.data_recebimento, "DD/MM/YYYY").format("YYYY-MM-DD");
    }
    return chapa;
  });

  populateTableWithDatatables("myTable", itemsData, itemsColumns);
  populateTableWithDatatables("myTable2", chapasData, chapasColumns);
}

function generateTableHeaders(tableId, columns) {
  var thead = document.getElementById(tableId).createTHead();
  var row = thead.insertRow();
  for (let key of columns) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
}

function populateTableWithDatatables(tableId, data, columns, scrollHeight = "25vh", pageLength = 5) {
  const isTable2 = tableId === "myTable2";

  const columnData = columns.map((column) => ({
    data: column,
    render: function (data, type, row) {
      if (["data_compra", "data_prevista", "data_recebimento"].includes(column) && type === "display" && data) {
        return moment(data, "YYYY-MM-DD").format("DD/MM/YYYY");
      }
      return data;
    },
  }));

  // Find the index of the 'data_compra' column
  const dataCompraIndex = columns.indexOf("data_compra");

  const domString = isTable2 ? "<'row'<'col-sm-4'l><'col-sm-4'B><'col-sm-4'f>>rtip" : "lfrtip";

  const buttons = isTable2
    ? [
        {
          text: "Expandir",
          attr: { id: "expandButton", class: "theme-button" },
          action: function (e, dt, node, config) {
            var tableWrapper = document.getElementById("tableWrapper");
            if (tableWrapper.classList.contains("expanded")) {
              tableWrapper.classList.remove("expanded");
              node.textContent = "Expand";
              reinitializeTable(tableId, data, columns, "25vh", 5);
            } else {
              tableWrapper.classList.add("expanded");
              node.textContent = "Collapse";
              reinitializeTable(tableId, data, columns, "60vh", 20);
            }
          },
        },
      ]
    : [];

  $("#" + tableId).DataTable({
    retrieve: true,
    responsive: true,
    scrollY: scrollHeight,
    scrollCollapse: true,
    paging: true,
    data: data,
    columns: columnData,
    dom: domString,
    buttons: buttons,
    order: dataCompraIndex !== -1 ? [[dataCompraIndex, "desc"]] : [],
    pageLength: pageLength,
    initComplete: function () {
      if (isTable2) {
        addEventListeners(tableId, data, columns);
      }
      adjustColumns(tableId);
    },
  });
}

function reinitializeTable(tableId, data, columns, scrollHeight, pageLength) {
  $("#" + tableId)
    .DataTable()
    .destroy();
  populateTableWithDatatables(tableId, data, columns, scrollHeight, pageLength);
  adjustColumns(tableId);
}

function adjustColumns(tableId) {
  setTimeout(function () {
    $("#" + tableId)
      .DataTable()
      .columns.adjust()
      .draw();
  }, 0);
}

function addEventListeners(tableId, data, columns) {
  var expandButton = document.getElementById("expandButton");
  var tableWrapper = document.getElementById("tableWrapper");

  tableWrapper.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  window.addEventListener("click", function () {
    if (tableWrapper.classList.contains("expanded")) {
      tableWrapper.classList.remove("expanded");
      expandButton.textContent = "Expand";
      reinitializeTable(tableId, data, columns, "25vh", 5);
    }
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (tableWrapper.classList.contains("expanded")) {
        tableWrapper.classList.remove("expanded");
        expandButton.textContent = "Expand";
        reinitializeTable(tableId, data, columns, "25vh", 5);
      }
    }
  });

  // Adjust columns on window resize
  window.addEventListener("resize", function () {
    adjustColumns(tableId);
  });
}
