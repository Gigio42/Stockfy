export function createChapasCharts(ctx1, ctx2, ctx3, data) {
  // Chart 1
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
          text: "Chart.js Line Chart - Cubic interpolation mode",
        },
      },
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Value",
          },
          suggestedMin: -10,
          suggestedMax: 200,
        },
      },
      animation: {
        duration: 2000,
        easing: "easeInOutQuad",
      },
    },
  });

  // Chart 2
  const qualidades = [...new Set(data.map((item) => item.qualidade))];
  const fornecedores = [...new Set(data.map((item) => item.fornecedor))];

  const colors = [
    "rgba(255, 99, 132, 0.8)",
    "rgba(54, 162, 235, 0.8)",
    "rgba(255, 206, 86, 0.8)",
    "rgba(75, 192, 192, 0.8)",
    "rgba(153, 102, 255, 0.8)",
    "rgba(255, 159, 64, 0.8)",
  ];

  const datasets = qualidades.map((qualidade, index) => {
    return {
      label: qualidade,
      data: fornecedores.map((fornecedor) => {
        const itemsForFornecedorAndQualidade = data.filter((item) => item.fornecedor === fornecedor && item.qualidade === qualidade);
        return itemsForFornecedorAndQualidade.reduce((total, item) => total + item.quantidade_comprada, 0);
      }),
      backgroundColor: colors[index % colors.length],
    };
  });

  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: fornecedores,
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stacked: true,
        },
        x: {
          stacked: true,
        },
      },
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
    type: "doughnut",
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
      aspectRatio: 2,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "Chapas - Status",
          font: {
            size: 20,
          },
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
                label += " (" + Math.round((context.parsed / statusData.reduce((a, b) => a + b.count, 0)) * 100) + "%)";
              }
              return label;
            },
          },
        },
        datalabels: {
          anchor: "end",
          align: "end",
          color: "#000000",
          formatter: function (value, context) {
            return context.chart.data.labels[context.dataIndex] + ": " + value;
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
