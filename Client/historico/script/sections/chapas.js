// chapas.js
import { fetchChapas } from "../connections.js";

export async function loadChapasData(ctx1, ctx2, ctx3) {
  const chapasData = await fetchChapas();
  createChapasCharts(ctx1, ctx2, ctx3, chapasData);

  var columns = Object.keys(chapasData[0]);

  generateTableHeaders("myTable", columns);
  generateTableHeaders("myTable2", columns);

  populateTableWithDatatables("myTable", chapasData, columns);
  populateTableWithDatatables("myTable2", chapasData, columns);
}

function createChapasCharts(ctx1, ctx2, ctx3, data) {
  // Chart 1 - Chapas received by quantity by date
  console.log(
    "Chart 1 data:",
    data.map((item) => item.quantidade_recebida),
  );
  new Chart(ctx1, {
    type: "line",
    data: {
      labels: data.map((item) => item.data_recebimento),
      datasets: [
        {
          label: "Chapas inseridas",
          data: data.map((item) => item.quantidade_comprada),
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
  });

  // Chart 2 - Quantity bought by each supplier
  const suppliers = [...new Set(data.map((item) => item.fornecedor))];
  const supplierData = suppliers.map((supplier) => {
    return {
      supplier,
      quantidade_recebida: data.filter((item) => item.fornecedor === supplier).reduce((total, item) => total + item.quantidade_recebida, 0),
    };
  });

  console.log("Chart 2 data:", supplierData); // Debug line
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: supplierData.map((item) => item.supplier),
      datasets: [
        {
          label: "Quantidade por Fornecedor",
          data: supplierData.map((item) => item.quantidade_recebida),
          backgroundColor: "rgba(173, 216, 230, 0.2)", 
          borderColor: "rgba(70, 130, 180, 1)", 
        },
      ],
    },
  });

  // Chart 3 - Status (Comprado, Parcial Usado, etc.)
  const statuses = [...new Set(data.map((item) => item.status.toUpperCase()))]; // Convert status to uppercase
  const statusData = statuses.map((status) => {
    return {
      status,
      count: data.filter((item) => item.status.toUpperCase() === status).length, // Convert status to uppercase
    };
  });

  new Chart(ctx3, {
    type: "pie",
    data: {
      labels: statusData.map((item) => item.status),
      datasets: [
        {
          label: "Status",
          data: statusData.map((item) => item.count),
          backgroundColor: [
            "rgba(220, 53, 69, 0.2)", // .card-status-comprado
            "rgba(0, 123, 255, 0.2)", // .card-status-recebido
            "rgba(40, 167, 69, 0.2)", // .card-status-parcial
            "rgba(128, 128, 128, 0.2)", // .card-status-usado
          ],
          borderColor: [
            "rgba(220, 53, 69, 1)", // .card-status-comprado
            "rgba(0, 123, 255, 1)", // .card-status-recebido
            "rgba(40, 167, 69, 1)", // .card-status-parcial
            "rgba(128, 128, 128, 1)", // .card-status-usado
          ],
          borderWidth: 2,
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        title: {
          display: true,
          text: "Status",
          font: {
            size: 20,
          },
        },
        subtitle: {
          display: true,
          text: "Chapas adicionadas",
          font: {
            size: 16,
          },
        },
        legend: {
          display: true,
          position: "bottom",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              var label = context.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed !== null) {
                label += context.parsed;
                label += " (" + Math.round((context.parsed / statusData.reduce((a, b) => a + b.count, 0)) * 100) + "%)"; // Add percentage
              }
              return label;
            },
          },
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
    },
  });
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
