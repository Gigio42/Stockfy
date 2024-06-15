// chart.js
var ctx1 = document.getElementById("myChart1").getContext("2d");
var ctx2 = document.getElementById("myChart2").getContext("2d");
var ctx3 = document.getElementById("myChart3").getContext("2d");

export function createCharts() {
  // Chart 1
  new Chart(ctx1, {
    type: "line",
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Dataset 1",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
  });

  // Chart 2
  new Chart(ctx2, {
    type: "bar",
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "Dataset 2",
          data: [20, 30, 40, 50, 60, 70, 80],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
        },
      ],
    },
  });

  // Chart 3
  new Chart(ctx3, {
    type: "pie",
    data: {
      labels: ["Red", "Blue", "Yellow"],
      datasets: [
        {
          label: "Dataset 3",
          data: [300, 50, 100],
          backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5, // Adjust this value to change the size of the chart
    },
  });
}
