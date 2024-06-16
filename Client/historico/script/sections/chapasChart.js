export function createChapasCharts(ctx1, ctx2, ctx3, data) {
  // Chart 1
  console.log(
    "Chart 1 data:",
    data.map((item) => item.quantidade_recebida),
  );
  
  // Sort data by 'data_prevista'
data.sort((a, b) => new Date(a.data_prevista) - new Date(b.data_prevista));

// Create chart
new Chart(ctx1, {
  type: "line",
  data: {
    labels: data.map((item) => item.data_prevista),
    datasets: [
      {
        label: "Chapas compradas",
        data: data.map((item) => Number(item.quantidade_comprada)),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "Chapas recebidas",
        data: data.map((item) => Number(item.quantidade_recebida)),
        fill: false,
        borderColor: "rgb(192, 75, 75)",
        tension: 0.1,
      },
      {
        label: "Chapas em estoque",
        data: data.map((item) => Number(item.quantidade_estoque)),
        fill: false,
        borderColor: "rgb(75, 75, 192)",
        tension: 0.1,
      },
      {
        label: "Chapas disponíveis",
        data: data.map((item) => Number(item.quantidade_disponivel)),
        fill: false,
        borderColor: "rgb(192, 192, 75)",
        tension: 0.1,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Line Chart - Cubic interpolation mode'
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value'
        },
        suggestedMin: -10,
        suggestedMax: 200
      }
    }
  },
});

  // Chart 2
  const suppliers = [...new Set(data.map((item) => item.fornecedor))];
  const supplierData = suppliers.map((supplier) => {
    return {
      supplier,
      quantidade_recebida: data.filter((item) => item.fornecedor === supplier).reduce((total, item) => total + item.quantidade_recebida, 0),
    };
  });

  console.log("Chart 2 data:", supplierData);
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

  // Chart 3 - Status
  const statuses = [...new Set(data.map((item) => item.status.toUpperCase()))];
  const statusData = statuses.map((status) => {
    return {
      status,
      count: data.filter((item) => item.status.toUpperCase() === status).length,
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
