import { fetchChapas, fetchItems } from "../connections.js";
import { createChapasCharts } from "./chapasChart.js";

export async function loadChapasData(ctx1, ctx2, ctx3) {
  const chapasData = await fetchChapas();
  const itemsData = await fetchItems();

  createChapasCharts(ctx1, ctx2, ctx3, chapasData);

  var chapasColumns = Object.keys(chapasData[0]);
  var itemsColumns = Object.keys(itemsData[0]);

  generateTableHeaders("myTable", itemsColumns);
  generateTableHeaders("myTable2", chapasColumns);

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

function populateTableWithDatatables(tableId, data, columns) {
  $("#" + tableId).DataTable({
    retrieve: true,
    responsive: true,
    scrollY: "25vh",
    scrollCollapse: true,
    paging: true,
    data: data,
    columns: columns.map((column) => ({ data: column })),
  });
}
