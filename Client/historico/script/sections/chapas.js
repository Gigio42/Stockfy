// chapas.js
import { fetchChapas } from "../connections.js";
import { createChapasCharts } from "./chapasChart.js";

export async function loadChapasData(ctx1, ctx2, ctx3) {
  const chapasData = await fetchChapas();
  createChapasCharts(ctx1, ctx2, ctx3, chapasData);

  var columns = Object.keys(chapasData[0]);

  generateTableHeaders("myTable", columns);
  generateTableHeaders("myTable2", columns);

  populateTableWithDatatables("myTable", chapasData, columns);
  populateTableWithDatatables("myTable2", chapasData, columns);
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

function populateTableWithDatatables(tableId, data, columns) {
  $("#" + tableId).DataTable({
    retrieve: true,
    responsive: true,
    scrollY: "25vh", // Apply scrollY to all tables
    scrollCollapse: true,
    paging: true,
    data: data,
    columns: columns.map((column) => ({ data: column })),
  });
}
