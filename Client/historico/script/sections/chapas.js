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

function populateTableWithDatatables(tableId, data, columns) {
  $("#" + tableId).DataTable({
    retrieve: true,
    responsive: true,
    scrollY: "25vh",
    scrollCollapse: true,
    paging: true,
    data: data,
    columns: columns.map((column) => ({
      data: column,
      render: function (data, type, row) {
        if (["data_compra", "data_prevista", "data_recebimento"].includes(column) && type === "display" && data) {
          return moment(data, "YYYY-MM-DD").format("DD/MM/YYYY");
        }
        return data;
      },
    })),
  });
}
